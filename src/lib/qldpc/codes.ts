import { circulant, eye, hstack, kron, transpose, type Mat } from "./gf2";

export type CssCode = {
  id: string;
  name: string;
  n: number;
  k: number;
  d: number;
  Hx: Mat;
  Hz: Mat;
  notes: string;
};

function hammingParity(): Mat {
  // [7,4,3] Hamming: columns = all nonzero 3-bit vectors
  return [
    [1, 0, 1, 0, 1, 0, 1],
    [0, 1, 1, 0, 0, 1, 1],
    [0, 0, 0, 1, 1, 1, 1],
  ];
}

/** Steane [[7,1,3]] — CSS with Hx = Hz = Hamming. */
export function steane(): CssCode {
  const H = hammingParity();
  return {
    id: "steane",
    name: "Steane [[7,1,3]]",
    n: 7,
    k: 1,
    d: 3,
    Hx: H,
    Hz: H.map((r) => r.slice()),
    notes: "Self-dual CSS. Transversal Clifford. Ground-truth for the decoder.",
  };
}

/**
 * Bivariate-bicycle style CSS on 12 qubits.
 * Hx = [A | B], Hz = [Bᵀ | Aᵀ] with commuting circulants — matches the 12-qubit mesh.
 */
export function bicycle12(): CssCode {
  const A = circulant([1, 1, 0, 1, 0, 0]);
  const B = circulant([1, 0, 1, 0, 0, 1]);
  const Hx = hstack(A, B);
  const Hz = hstack(transpose(B), transpose(A));
  return {
    id: "bb12",
    name: "Bicycle [[12, k, ~3]]",
    n: 12,
    k: Math.max(1, 12 - Hx.length - Hz.length + 2),
    d: 3,
    Hx,
    Hz,
    notes: "Circulant bicycle on 12 edges. The live mesh register is this block.",
  };
}

/** Hypergraph product of two classical cycle codes. */
export function hgpTiny(): CssCode {
  // Classical even-parity repetition-like 3×6 cycle
  const Ha: Mat = [
    [1, 1, 0, 0, 0, 1],
    [0, 1, 1, 0, 1, 0],
    [0, 0, 1, 1, 0, 1],
  ];
  const Hb: Mat = [
    [1, 1, 0, 1],
    [0, 1, 1, 1],
  ];
  const na = Ha[0].length;
  const nb = Hb[0].length;
  const ra = Ha.length;
  const rb = Hb.length;
  const Hx = hstack(kron(Ha, eye(nb)), kron(eye(ra), transpose(Hb)));
  const Hz = hstack(kron(eye(na), Hb), kron(transpose(Ha), eye(rb)));
  return {
    id: "hgp",
    name: `HGP [[${Hx[0].length}, ·, ·]]`,
    n: Hx[0].length,
    k: Math.max(1, Hx[0].length - Hx.length - Hz.length),
    d: 2,
    Hx,
    Hz,
    notes: "Hypergraph product of two small classical LDPC matrices.",
  };
}

export const CATALOG: CssCode[] = [bicycle12(), steane(), hgpTiny()];

export function getCode(id: string): CssCode {
  return CATALOG.find((c) => c.id === id) ?? bicycle12();
}
