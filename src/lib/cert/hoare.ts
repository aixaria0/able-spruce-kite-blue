import { sha256Hex } from "@/lib/quantum/math";
import type { ShadowResult } from "@/lib/quantum/shadows";
import type { TargetKind } from "@/lib/quantum/statevector";

export type QuantumHoareCert = {
  version: number;
  programHash: string;
  precondition: string;
  postcondition: string;
  proofType: "statistical_classical_shadow";
  fidelity: number;
  fidelityError: number;
  witness: number;
  witnessError: number;
  trueFidelity: number;
  shots: number;
  nQubits: number;
  noise: number;
  target: TargetKind;
  backend: string;
  timestamp: number;
  accepted: boolean;
  view: number;
  leader: number;
  quorum: number;
  binding: string;
  usedMps: boolean;
  bondDim: number;
  correlators: Record<string, { value: number; error: number }>;
};

export type RoundConfig = {
  nQubits: number;
  shots: number;
  noise: number;
  target: TargetKind;
  byzantine: boolean;
  useMps: boolean;
  fidelityThreshold: number;
};

export function defaultConfig(): RoundConfig {
  return {
    nQubits: 2,
    shots: 256,
    noise: 0.04,
    target: "bell",
    byzantine: false,
    useMps: false,
    fidelityThreshold: 0.65,
  };
}

export function programLabel(cfg: RoundConfig) {
  if (cfg.target === "product") return `product |0⟩^${cfg.nQubits}`;
  if (cfg.nQubits === 2) return "Bell |Φ+⟩";
  return `GHZ-${cfg.nQubits}`;
}

export function buildCert(
  shadow: ShadowResult,
  cfg: RoundConfig,
  bft: { view: number; leader: number; committed: boolean },
): QuantumHoareCert {
  const program = `${programLabel(cfg)} shadows=${shadow.shots} noise=${cfg.noise}`;
  const programHash = sha256Hex(program);
  const witnessOk = shadow.witness.value < 0;
  const fidOk = shadow.fidelity.value >= cfg.fidelityThreshold;
  const accepted = bft.committed && fidOk && witnessOk;

  const correlators: Record<string, { value: number; error: number }> = {};
  for (const [k, v] of Object.entries(shadow.correlators)) {
    correlators[k] = { value: v.value, error: v.error };
  }

  const cert: QuantumHoareCert = {
    version: 1,
    programHash,
    precondition: `ρ prepared as ${programLabel(cfg)} on trapped-ion noise model`,
    postcondition: `F(ρ, entangled target) ≥ ${cfg.fidelityThreshold} AND ⟨W⟩ < 0`,
    proofType: "statistical_classical_shadow",
    fidelity: shadow.fidelity.value,
    fidelityError: shadow.fidelity.error,
    witness: shadow.witness.value,
    witnessError: shadow.witness.error,
    trueFidelity: shadow.trueFidelity,
    shots: shadow.shots,
    nQubits: shadow.nQubits,
    noise: cfg.noise,
    target: shadow.target,
    backend: "local_aer_trapped_ion_noise",
    timestamp: Date.now(),
    accepted,
    view: bft.view,
    leader: bft.leader,
    quorum: 3,
    binding: "",
    usedMps: shadow.usedMps,
    bondDim: shadow.bondDim,
    correlators,
  };
  cert.binding = sha256Hex(JSON.stringify({ ...cert, binding: "" }));
  return cert;
}

export function certToJson(cert: QuantumHoareCert) {
  return JSON.stringify(
    {
      version: cert.version,
      program_hash: cert.programHash,
      precondition: cert.precondition,
      postcondition: cert.postcondition,
      proof_type: cert.proofType,
      fidelity: Number(cert.fidelity.toFixed(6)),
      fidelity_error: Number(cert.fidelityError.toFixed(6)),
      witness: Number(cert.witness.toFixed(6)),
      witness_error: Number(cert.witnessError.toFixed(6)),
      true_fidelity: Number(cert.trueFidelity.toFixed(6)),
      shots: cert.shots,
      n_qubits: cert.nQubits,
      noise: cert.noise,
      target: cert.target,
      backend: cert.backend,
      timestamp: cert.timestamp,
      accepted: cert.accepted,
      bft: { view: cert.view, leader: cert.leader, quorum: cert.quorum },
      mps: { used: cert.usedMps, bond_dim: cert.bondDim },
      correlators: cert.correlators,
      binding: cert.binding,
    },
    null,
    2,
  );
}
