import { abs2, bit, c, cmul, cscale, flip, type Complex, zeros } from "./math";

export type Pauli = "I" | "X" | "Y" | "Z";

const INV_SQRT2 = 1 / Math.sqrt(2);

export function dimOf(n: number) {
  return 1 << n;
}

export function ketZero(n: number): Complex[] {
  const psi = zeros(dimOf(n));
  psi[0] = c(1, 0);
  return psi;
}

export function applyH(psi: Complex[], q: number): void {
  const dim = psi.length;
  const mask = 1 << q;
  for (let i = 0; i < dim; i++) {
    if (i & mask) continue;
    const j = i | mask;
    const a = psi[i];
    const b = psi[j];
    psi[i] = { re: INV_SQRT2 * (a.re + b.re), im: INV_SQRT2 * (a.im + b.im) };
    psi[j] = { re: INV_SQRT2 * (a.re - b.re), im: INV_SQRT2 * (a.im - b.im) };
  }
}

export function applyX(psi: Complex[], q: number): void {
  const dim = psi.length;
  const mask = 1 << q;
  for (let i = 0; i < dim; i++) {
    if (i & mask) continue;
    const j = i | mask;
    const tmp = psi[i];
    psi[i] = psi[j];
    psi[j] = tmp;
  }
}

export function applySdg(psi: Complex[], q: number): void {
  const dim = psi.length;
  const mask = 1 << q;
  for (let i = 0; i < dim; i++) {
    if (i & mask) {
      const a = psi[i];
      psi[i] = { re: a.im, im: -a.re }; // * (-i)
    }
  }
}

export function applyCX(psi: Complex[], cQ: number, tQ: number): void {
  const dim = psi.length;
  const cMask = 1 << cQ;
  const tMask = 1 << tQ;
  for (let i = 0; i < dim; i++) {
    if ((i & cMask) && !(i & tMask)) {
      const j = i | tMask;
      const tmp = psi[i];
      psi[i] = psi[j];
      psi[j] = tmp;
    }
  }
}

export function applyPauliBasis(psi: Complex[], bases: Pauli[]): void {
  for (let q = 0; q < bases.length; q++) {
    const b = bases[q];
    if (b === "X") applyH(psi, q);
    else if (b === "Y") {
      applySdg(psi, q);
      applyH(psi, q);
    }
  }
}

export function cloneState(psi: Complex[]): Complex[] {
  return psi.map((z) => ({ re: z.re, im: z.im }));
}

export function sampleComputational(psi: Complex[], rand: () => number): number {
  let r = rand();
  for (let i = 0; i < psi.length; i++) {
    r -= abs2(psi[i]);
    if (r <= 0) return i;
  }
  return psi.length - 1;
}

export function indexToBits(index: number, n: number): string {
  let s = "";
  for (let q = 0; q < n; q++) s += bit(index, q) ? "1" : "0";
  return s;
}

export function prepareTarget(kind: TargetKind, n: number): Complex[] {
  const psi = ketZero(n);
  if (kind === "product") return psi;
  applyH(psi, 0);
  if (kind === "bell" || kind === "ghz") {
    for (let q = 0; q < n - 1; q++) applyCX(psi, q, q + 1);
  }
  return psi;
}

export type TargetKind = "bell" | "ghz" | "product";

export function pauliExpectation(psi: Complex[], pauli: Pauli[]): number {
  // ⟨ψ|P|ψ⟩ for a Pauli string. P|ψ⟩ then inner product.
  const n = pauli.length;
  const dim = psi.length;
  const out = zeros(dim);
  for (let i = 0; i < dim; i++) {
    let amp = psi[i];
    let idx = i;
    for (let q = 0; q < n; q++) {
      const p = pauli[q];
      if (p === "I") continue;
      const b = bit(idx, q);
      if (p === "X") {
        idx = flip(idx, q);
      } else if (p === "Z") {
        if (b) amp = cscale(amp, -1);
      } else if (p === "Y") {
        // Y|0⟩ = i|1⟩, Y|1⟩ = -i|0⟩
        idx = flip(idx, q);
        amp = b ? cmul(amp, c(0, -1)) : cmul(amp, c(0, 1));
      }
    }
    out[idx] = { re: out[idx].re + amp.re, im: out[idx].im + amp.im };
  }
  let re = 0;
  for (let i = 0; i < dim; i++) {
    re += psi[i].re * out[i].re + psi[i].im * out[i].im;
  }
  return re;
}

export function allPauliStrings(n: number): Pauli[][] {
  const letters: Pauli[] = ["I", "X", "Y", "Z"];
  const out: Pauli[][] = [];
  const total = 4 ** n;
  for (let i = 0; i < total; i++) {
    const s: Pauli[] = [];
    let x = i;
    for (let q = 0; q < n; q++) {
      s.push(letters[x & 3]);
      x >>= 2;
    }
    out.push(s);
  }
  return out;
}

export function pauliKey(p: Pauli[]): string {
  return p.join("");
}
