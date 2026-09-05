import type { RoundConfig } from "@/lib/cert/hoare";
import type { TargetKind } from "@/lib/quantum/statevector";

export type ParsedIntent = {
  config: Partial<RoundConfig>;
  run: boolean;
  note: string;
};

export function parseIntent(raw: string, base: RoundConfig): ParsedIntent {
  const text = raw.toLowerCase().trim();
  const config: Partial<RoundConfig> = {};
  let run = /run|launch|execute|go|start/.test(text);
  const notes: string[] = [];

  const qubitMatch = text.match(/(\d+)\s*q(?:ubit)?s?/);
  if (qubitMatch) {
    const n = Math.max(2, Math.min(6, Number(qubitMatch[1])));
    config.nQubits = n;
    notes.push(`${n} qubits`);
  } else if (/all twelve|12/.test(text) && /entangle|ghz|inham|درهم/.test(text)) {
    config.nQubits = 6;
    notes.push("capped at 6 physical qubits for exact shadows");
  }

  const shotMatch = text.match(/(\d+)\s*shots?/);
  if (shotMatch) {
    config.shots = Math.max(32, Math.min(2000, Number(shotMatch[1])));
    notes.push(`${config.shots} shots`);
  }

  if (/product|computational|\|0/.test(text)) {
    config.target = "product";
    notes.push("product |0…0⟩");
  } else if (/ghz/.test(text) || /entangle|inham|درهم/.test(text)) {
    const n = config.nQubits ?? base.nQubits;
    config.target = n === 2 ? "bell" : "ghz";
    notes.push(n === 2 ? "Bell pair" : "GHZ");
  } else if (/bell|phi|φ/.test(text)) {
    config.target = "bell";
    config.nQubits = 2;
    notes.push("Bell |Φ+⟩");
  }

  if (/heavy|kill|severe|شدید|سنگین|زیاد/.test(text)) {
    config.noise = 0.28;
    notes.push("heavy depolarizing noise");
  } else if (/light|low|کم|ریز/.test(text)) {
    config.noise = 0.02;
    notes.push("light ion-like noise");
  } else if (/clean|no noise|zero noise|perfect/.test(text)) {
    config.noise = 0;
    notes.push("noiseless");
  } else if (/noise|نویز|خراب/.test(text)) {
    config.noise = 0.1;
    notes.push("moderate noise");
  }

  if (/byzantine|faulty|evil|liar/.test(text)) {
    config.byzantine = true;
    notes.push("one Byzantine replica");
  } else if (/honest|no byz/.test(text)) {
    config.byzantine = false;
  }

  if (/mps|tensor|bond/.test(text)) {
    config.useMps = true;
    config.nQubits = Math.max(config.nQubits ?? base.nQubits, 6);
    notes.push("MPS path");
  }

  if (!run && notes.length > 0 && /please|now|do it/.test(text)) run = true;
  if (notes.length === 0 && text.length > 0) {
    notes.push("no keywords matched — using current controls");
  }

  return { config, run, note: notes.join(" · ") || "ready" };
}

export const PRESETS: { id: string; label: string; hint: string; config: Partial<RoundConfig> }[] = [
  {
    id: "clean-bell",
    label: "Clean Bell",
    hint: "Should accept",
    config: { nQubits: 2, target: "bell" as TargetKind, noise: 0.02, shots: 256, byzantine: false, useMps: false },
  },
  {
    id: "noisy-ghz",
    label: "Noisy GHZ-4",
    hint: "Borderline",
    config: { nQubits: 4, target: "ghz" as TargetKind, noise: 0.18, shots: 400, byzantine: false, useMps: false },
  },
  {
    id: "product",
    label: "Product state",
    hint: "Should reject",
    config: { nQubits: 2, target: "product" as TargetKind, noise: 0.02, shots: 256, byzantine: false },
  },
  {
    id: "byz",
    label: "Byzantine quorum",
    hint: "f = 1 still commits",
    config: { nQubits: 2, target: "bell" as TargetKind, noise: 0.03, shots: 256, byzantine: true },
  },
  {
    id: "heavy",
    label: "Guillotine",
    hint: "Noise kills the cert",
    config: { nQubits: 3, target: "ghz" as TargetKind, noise: 0.42, shots: 320, byzantine: false },
  },
];
