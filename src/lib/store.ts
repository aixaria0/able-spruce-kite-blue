import { create } from "zustand";
import { buildCert, defaultConfig, type QuantumHoareCert, type RoundConfig } from "@/lib/cert/hoare";
import { makeCluster, stepCommit, stepPrecommit, stepPrepare, stepPropose, stepViewChange, type BftSnapshot } from "@/lib/bft/hotstuff";
import { runClassicalShadows, type ShadowResult } from "@/lib/quantum/shadows";
import { sha256Hex } from "@/lib/quantum/math";
import { sleep } from "@/lib/utils";

const LEDGER_KEY = "lattice.certs.v1";

export type LogLine = { t: number; text: string; tone: "info" | "ok" | "bad" | "warn" };

type EngineState = {
  config: RoundConfig;
  bft: BftSnapshot;
  shadow: ShadowResult | null;
  cert: QuantumHoareCert | null;
  running: boolean;
  progress: number;
  phaseLabel: string;
  log: LogLine[];
  ledger: QuantumHoareCert[];
  history: { t: number; fidelity: number; witness: number; accepted: boolean }[];
  setConfig: (patch: Partial<RoundConfig>) => void;
  hydrate: () => void;
  launch: () => Promise<void>;
  reset: () => void;
};

function pushLog(log: LogLine[], text: string, tone: LogLine["tone"] = "info"): LogLine[] {
  return [...log, { t: Date.now(), text, tone }].slice(-80);
}

function loadLedger(): QuantumHoareCert[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LEDGER_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as QuantumHoareCert[];
    return Array.isArray(parsed) ? parsed.slice(0, 40) : [];
  } catch {
    return [];
  }
}

function saveLedger(certs: QuantumHoareCert[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LEDGER_KEY, JSON.stringify(certs.slice(0, 40)));
}

export const useEngine = create<EngineState>((set, get) => ({
  config: defaultConfig(),
  bft: makeCluster({ n: 4, byzantineId: null }),
  shadow: null,
  cert: null,
  running: false,
  progress: 0,
  phaseLabel: "Idle",
  log: [{ t: Date.now(), text: "Lattice idle. Local trapped-ion simulator online.", tone: "info" }],
  ledger: [],
  history: [],
  setConfig: (patch) => set((s) => ({ config: { ...s.config, ...patch } })),
  hydrate: () => set({ ledger: loadLedger() }),
  reset: () =>
    set({
      bft: makeCluster({ n: 4, byzantineId: get().config.byzantine ? 3 : null }),
      shadow: null,
      cert: null,
      running: false,
      progress: 0,
      phaseLabel: "Idle",
    }),
  launch: async () => {
    if (get().running) return;
    const cfg = get().config;
    const bftCfg = { n: 4, byzantineId: cfg.byzantine ? 3 : null as number | null };
    set({
      running: true,
      progress: 4,
      phaseLabel: "Propose",
      cert: null,
      shadow: null,
      bft: makeCluster(bftCfg),
      log: pushLog(get().log, `Round armed · ${cfg.nQubits}q · ${cfg.shots} shots · p=${cfg.noise.toFixed(2)}`),
    });

    const value = sha256Hex(`round-${Date.now()}-${cfg.target}-${cfg.nQubits}`);
    await sleep(280);
    let bft = stepPropose(get().bft, value, bftCfg);
    set({ bft, progress: 18, phaseLabel: "Prepare", log: pushLog(get().log, bft.log[bft.log.length - 1]) });

    await sleep(320);
    bft = stepPrepare(bft, value, bftCfg);
    set({
      bft,
      progress: 34,
      phaseLabel: bft.phase === "view-change" ? "View-change" : "Shadows",
      log: pushLog(get().log, bft.log[bft.log.length - 1], bft.phase === "view-change" ? "warn" : "info"),
    });

    if (bft.phase === "view-change") {
      await sleep(260);
      bft = stepViewChange(bft, bftCfg);
      bft = stepPropose(bft, value, { ...bftCfg });
      bft = stepPrepare(bft, value, { ...bftCfg, failFirstView: false });
      set({
        bft,
        progress: 42,
        phaseLabel: "Shadows",
        log: pushLog(get().log, "Leader rotated. Prepare QC recovered."),
      });
    }

    await sleep(180);
    set({ phaseLabel: "Classical shadows", progress: 48, log: pushLog(get().log, "Sampling Pauli snapshots on the ion-noise backend.") });
    await sleep(40);
    const shadow = runClassicalShadows({
      nQubits: cfg.nQubits,
      shots: cfg.shots,
      noise: cfg.noise,
      target: cfg.target,
      useMps: cfg.useMps || cfg.nQubits >= 6,
    });
    set({
      shadow,
      progress: 70,
      phaseLabel: "Pre-commit",
      log: pushLog(
        get().log,
        `Shadow F = ${shadow.fidelity.value.toFixed(3)} ± ${shadow.fidelity.error.toFixed(3)} · ⟨W⟩ = ${shadow.witness.value.toFixed(3)}`,
      ),
    });

    await sleep(300);
    bft = stepPrecommit(bft, value, bftCfg);
    set({ bft, progress: 82, phaseLabel: "Commit", log: pushLog(get().log, bft.log[bft.log.length - 1]) });

    await sleep(280);
    bft = stepCommit(bft, value, bftCfg);
    const committed = bft.phase === "decided";
    const cert = buildCert(shadow, cfg, { view: bft.view, leader: bft.leader, committed });
    const ledger = [cert, ...get().ledger].slice(0, 40);
    saveLedger(ledger);
    const history = [
      ...get().history,
      { t: cert.timestamp, fidelity: cert.fidelity, witness: cert.witness, accepted: cert.accepted },
    ].slice(-24);

    set({
      bft,
      cert,
      ledger,
      history,
      running: false,
      progress: 100,
      phaseLabel: cert.accepted ? "Accepted" : "Rejected",
      log: pushLog(
        get().log,
        cert.accepted
          ? `HybridCert ACCEPT · bound ${cert.binding.slice(0, 12)}…`
          : `HybridCert REJECT · BFT ${committed ? "ok" : "fail"} · F ${cert.fidelity.toFixed(2)}`,
        cert.accepted ? "ok" : "bad",
      ),
    });
  },
}));
