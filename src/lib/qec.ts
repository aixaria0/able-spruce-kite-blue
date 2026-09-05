export type QldpcFamily = "surface" | "color" | "hgp" | "bicycle";

export type QldpcCode = {
  id: QldpcFamily;
  name: string;
  params: string;
  n: number;
  k: number;
  d: number;
  rate: number;
  notes: string;
  hardware: string;
};

export function surfaceCode(distance: number): QldpcCode {
  const d = Math.max(3, Math.min(15, distance | 1)); // odd
  const n = d * d;
  return {
    id: "surface",
    name: "Rotated surface",
    params: `[[${n}, 1, ${d}]]`,
    n,
    k: 1,
    d,
    rate: 1 / n,
    notes: "Local stabilizers, ~1% threshold, lattice surgery. Workhorse on superconducting hardware.",
    hardware: "Superconducting",
  };
}

export function colorCode(distance: number): QldpcCode {
  const d = Math.max(3, Math.min(13, distance | 1));
  const n = (3 * d * d + 1) / 4;
  return {
    id: "color",
    name: "2-D color code",
    params: `[[${n}, 1, ${d}]]`,
    n,
    k: 1,
    d,
    rate: 1 / n,
    notes: "Transversal Clifford set. Matches all-to-all trapped-ion connectivity.",
    hardware: "Trapped ion",
  };
}

export function hypergraphProduct(a: number, b: number): QldpcCode {
  const n = a * a + b * b;
  const k = Math.max(1, (a - b) * (a - b));
  const d = Math.min(a, b);
  return {
    id: "hgp",
    name: "Hypergraph product",
    params: `[[${n}, ${k}, ~${d}]]`,
    n,
    k,
    d,
    rate: k / n,
    notes: "Product of two classical codes. Constant rate as n grows; non-local checks.",
    hardware: "Future qLDPC",
  };
}

export function bicycleCode(): QldpcCode {
  return {
    id: "bicycle",
    name: "Bivariate bicycle",
    params: "[[144, 12, 12]]",
    n: 144,
    k: 12,
    d: 12,
    rate: 12 / 144,
    notes: "IBM Gross-code family. Twelve logical qubits at distance 12 — the near-term qLDPC flagship.",
    hardware: "Superconducting (research)",
  };
}

export function distillT(pIn: number) {
  const p = Math.max(1e-6, Math.min(0.2, pIn));
  // 15-to-1 Bravyi–Kitaev leading term ≈ 35 p³
  const pOut = 35 * p ** 3;
  const yieldRate = 1 / 15;
  const roundsToTarget = (target: number) => {
    let x = p;
    let r = 0;
    while (x > target && r < 8) {
      x = 35 * x ** 3;
      r++;
    }
    return r;
  };
  return {
    pIn: p,
    pOut: Math.min(1, pOut),
    yieldRate,
    physicalT: 15,
    roundsTo1e6: roundsToTarget(1e-6),
    roundsTo1e12: roundsToTarget(1e-12),
  };
}

export type MpsPoint = { cut: number; chi: number; discarded: number; entropy: number };

export function mpsSpectrum(kind: "ghz" | "product" | "volume", n: number): MpsPoint[] {
  const points: MpsPoint[] = [];
  for (let cut = 1; cut < n; cut++) {
    if (kind === "product") {
      points.push({ cut, chi: 1, discarded: 0, entropy: 0 });
    } else if (kind === "ghz") {
      points.push({ cut, chi: 2, discarded: 0, entropy: 1 });
    } else {
      const chiMax = 2 ** Math.min(cut, n - cut);
      const chi = Math.min(chiMax, 16);
      const entropy = Math.min(cut, n - cut);
      const discarded = chi < chiMax ? 0.15 + 0.05 * cut : 0;
      points.push({ cut, chi, discarded, entropy });
    }
  }
  return points;
}
