import { mulberry32 } from "./math";
import {
  allPauliStrings,
  applyPauliBasis,
  cloneState,
  indexToBits,
  pauliExpectation,
  pauliKey,
  prepareTarget,
  sampleComputational,
  type Pauli,
  type TargetKind,
} from "./statevector";

export type Snapshot = { bits: string; pauli: string };

export type ShadowEstimate = {
  value: number;
  error: number;
  samples: number;
};

export type ShadowResult = {
  snapshots: Snapshot[];
  fidelity: ShadowEstimate;
  witness: ShadowEstimate;
  correlators: Record<string, ShadowEstimate>;
  trueFidelity: number;
  trueWitness: number;
  shots: number;
  nQubits: number;
  noise: number;
  target: TargetKind;
  usedMps: boolean;
  bondDim: number;
  discardedWeight: number;
};

const PAULI_XYZ: Pauli[] = ["X", "Y", "Z"];

function inverseFactor(pauli: string): number {
  let k = 0;
  for (const ch of pauli) if (ch !== "I") k++;
  return 3 ** k;
}

function snapshotContribution(bits: string, measured: string, observable: string): number {
  let val = 1;
  for (let i = 0; i < observable.length; i++) {
    const o = observable[i];
    if (o === "I") continue;
    if (measured[i] !== o) return 0;
    val *= bits[i] === "0" ? 1 : -1;
  }
  return val * inverseFactor(observable);
}

export function medianOfMeans(values: number[], nBatches = 8): ShadowEstimate {
  if (values.length === 0) return { value: 0, error: 1, samples: 0 };
  const nBatchesClamped = Math.max(1, Math.min(nBatches, Math.floor(values.length / 2) || 1));
  const batchSize = Math.max(1, Math.floor(values.length / nBatchesClamped));
  const means: number[] = [];
  for (let i = 0; i < nBatchesClamped; i++) {
    const start = i * batchSize;
    const end = i === nBatchesClamped - 1 ? values.length : start + batchSize;
    if (end <= start) continue;
    let s = 0;
    for (let j = start; j < end; j++) s += values[j];
    means.push(s / (end - start));
  }
  if (means.length === 0) {
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return { value: avg, error: 1, samples: values.length };
  }
  means.sort((a, b) => a - b);
  const med = means[Math.floor(means.length / 2)];
  const absDev = means.map((m) => Math.abs(m - med)).sort((a, b) => a - b);
  const mad = absDev[Math.floor(absDev.length / 2)] + 1e-12;
  const se = (1.4826 * mad) / Math.sqrt(means.length);
  return { value: med, error: se, samples: values.length };
}

function estimatePauli(snapshots: Snapshot[], observable: string): ShadowEstimate {
  const vals: number[] = [];
  for (const s of snapshots) {
    vals.push(snapshotContribution(s.bits, s.pauli, observable));
  }
  return medianOfMeans(vals);
}

function fidelityFromPaulis(
  snapshots: Snapshot[],
  targetPaulis: { key: string; chi: number }[],
  n: number,
): ShadowEstimate {
  const dim = 2 ** n;
  let fid = 0;
  let varSum = 0;
  for (const t of targetPaulis) {
    const est = estimatePauli(snapshots, t.key);
    fid += t.chi * est.value;
    varSum += (est.error * t.chi) ** 2;
  }
  fid /= dim;
  const err = Math.sqrt(varSum) / dim;
  return {
    value: Math.min(1, Math.max(0, fid)),
    error: err,
    samples: snapshots.length,
  };
}

function bellWitness(snapshots: Snapshot[]): ShadowEstimate {
  const xx = estimatePauli(snapshots, "XX");
  const yy = estimatePauli(snapshots, "YY");
  const zz = estimatePauli(snapshots, "ZZ");
  const value = 0.5 - 0.25 * (1 + xx.value - yy.value + zz.value);
  const err = 0.25 * Math.sqrt(xx.error ** 2 + yy.error ** 2 + zz.error ** 2);
  return { value, error: err, samples: snapshots.length };
}

function ghzWitness(snapshots: Snapshot[], n: number): ShadowEstimate {
  const xKey = "X".repeat(n);
  const xx = estimatePauli(snapshots, xKey);
  const zzKeys: string[] = [];
  for (let i = 0; i < n - 1; i++) {
    let s = "";
    for (let q = 0; q < n; q++) s += q === i || q === i + 1 ? "Z" : "I";
    zzKeys.push(s);
  }
  const zzs = zzKeys.map((k) => estimatePauli(snapshots, k));
  const zMean = zzs.reduce((a, b) => a + b.value, 0) / Math.max(1, zzs.length);
  const value = 0.5 - 0.25 * (1 + xx.value + zMean);
  const err = 0.25 * Math.sqrt(xx.error ** 2 + 0.05 ** 2);
  return { value, error: err, samples: snapshots.length };
}

function relevantPaulis(kind: TargetKind, n: number): { key: string; chi: number }[] {
  const psi = prepareTarget(kind, n);
  if (n <= 3) {
    return allPauliStrings(n).map((p) => ({
      key: pauliKey(p),
      chi: pauliExpectation(psi, p),
    }));
  }
  const keys: Pauli[][] = [];
  keys.push(Array(n).fill("I"));
  keys.push(Array(n).fill("X"));
  keys.push(Array(n).fill("Z"));
  for (let i = 0; i < n - 1; i++) {
    const s: Pauli[] = Array(n).fill("I");
    s[i] = "Z";
    s[i + 1] = "Z";
    keys.push(s);
  }
  if (n === 2) keys.push(["Y", "Y"]);
  return keys.map((p) => ({ key: pauliKey(p), chi: pauliExpectation(psi, p) }));
}

function schmidtDiscarded(kind: TargetKind, n: number, maxBond: number): { bondDim: number; discarded: number } {
  if (kind === "product") return { bondDim: 1, discarded: 0 };
  const rank = 2;
  const kept = Math.min(rank, Math.max(1, maxBond));
  const discarded = kept >= rank ? 0 : 0.5;
  return { bondDim: kept, discarded };
}

export function runClassicalShadows(opts: {
  nQubits: number;
  shots: number;
  noise: number;
  target: TargetKind;
  seed?: number;
  useMps?: boolean;
}): ShadowResult {
  const n = Math.max(2, Math.min(6, opts.nQubits));
  const shots = Math.max(32, Math.min(2000, Math.floor(opts.shots)));
  const noise = Math.max(0, Math.min(0.6, opts.noise));
  const prepared: TargetKind = n === 2 && opts.target === "ghz" ? "bell" : opts.target;
  const certified: TargetKind = n === 2 ? "bell" : "ghz";
  const rand = mulberry32(opts.seed ?? (Date.now() ^ (shots * 997)));
  const psi = prepareTarget(prepared, n);
  const snapshots: Snapshot[] = [];

  for (let s = 0; s < shots; s++) {
    const bases: Pauli[] = [];
    for (let q = 0; q < n; q++) bases.push(PAULI_XYZ[Math.floor(rand() * 3)]);
    let bits: string;
    if (rand() < noise) {
      bits = "";
      for (let q = 0; q < n; q++) bits += rand() < 0.5 ? "0" : "1";
    } else {
      const copy = cloneState(psi);
      applyPauliBasis(copy, bases);
      const idx = sampleComputational(copy, rand);
      bits = indexToBits(idx, n);
    }
    snapshots.push({ bits, pauli: bases.join("") });
  }

  const targetPaulis = relevantPaulis(certified, n);
  const fidelity = fidelityFromPaulis(snapshots, targetPaulis, n);

  const dim = 2 ** n;
  const overlap = prepared === "product" ? 0.5 : 1;
  const trueFidelity = (1 - noise) * overlap + noise / dim;
  const trueWitness = 0.5 - trueFidelity;

  const witness = n === 2 ? bellWitness(snapshots) : ghzWitness(snapshots, n);

  const correlators: Record<string, ShadowEstimate> = {};
  if (n === 2) {
    correlators.XX = estimatePauli(snapshots, "XX");
    correlators.YY = estimatePauli(snapshots, "YY");
    correlators.ZZ = estimatePauli(snapshots, "ZZ");
  } else {
    correlators["X".repeat(n)] = estimatePauli(snapshots, "X".repeat(n));
    let zz = "ZZ";
    while (zz.length < n) zz += "I";
    correlators[zz] = estimatePauli(snapshots, zz);
  }

  const mps = schmidtDiscarded(prepared, n, opts.useMps ? 8 : 64);

  return {
    snapshots,
    fidelity,
    witness,
    correlators,
    trueFidelity,
    trueWitness,
    shots,
    nQubits: n,
    noise,
    target: prepared,
    usedMps: Boolean(opts.useMps) && n >= 6,
    bondDim: mps.bondDim,
    discardedWeight: mps.discarded,
  };
}
