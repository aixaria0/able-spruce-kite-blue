/** GF(2) dense linear algebra for small qLDPC blocks (n ≤ 64). */

export type Mat = number[][];

export function zeros(r: number, c: number): Mat {
  return Array.from({ length: r }, () => Array(c).fill(0));
}

export function clone(A: Mat): Mat {
  return A.map((row) => row.slice());
}

export function eye(n: number): Mat {
  const I = zeros(n, n);
  for (let i = 0; i < n; i++) I[i][i] = 1;
  return I;
}

export function transpose(A: Mat): Mat {
  const r = A.length;
  const c = A[0]?.length ?? 0;
  const T = zeros(c, r);
  for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) T[j][i] = A[i][j];
  return T;
}

export function mulVec(A: Mat, v: number[]): number[] {
  const r = A.length;
  const n = A[0]?.length ?? 0;
  const out = Array(r).fill(0);
  for (let i = 0; i < r; i++) {
    let s = 0;
    for (let j = 0; j < n; j++) s ^= A[i][j] & v[j];
    out[i] = s;
  }
  return out;
}

export function circulant(first: number[]): Mat {
  const n = first.length;
  const A = zeros(n, n);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) A[i][j] = first[(j - i + n) % n];
  }
  return A;
}

export function hstack(A: Mat, B: Mat): Mat {
  return A.map((row, i) => row.concat(B[i]));
}

export function kron(A: Mat, B: Mat): Mat {
  const ra = A.length;
  const ca = A[0].length;
  const rb = B.length;
  const cb = B[0].length;
  const C = zeros(ra * rb, ca * cb);
  for (let i = 0; i < ra; i++) {
    for (let j = 0; j < ca; j++) {
      if (!A[i][j]) continue;
      for (let p = 0; p < rb; p++) {
        for (let q = 0; q < cb; q++) C[i * rb + p][j * cb + q] = B[p][q];
      }
    }
  }
  return C;
}

export function wt(v: number[]): number {
  return v.reduce((s, x) => s + x, 0);
}

export function eqVec(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

/** Row-reduce [A | b] over GF(2). Returns particular solution or null if inconsistent. */
export function solve(A: Mat, b: number[]): number[] | null {
  const r = A.length;
  const c = A[0]?.length ?? 0;
  const M = A.map((row, i) => row.concat(b[i] & 1));
  const pivotCol: number[] = [];
  let row = 0;
  for (let col = 0; col < c && row < r; col++) {
    let piv = row;
    while (piv < r && M[piv][col] === 0) piv++;
    if (piv === r) continue;
    if (piv !== row) {
      const tmp = M[row];
      M[row] = M[piv];
      M[piv] = tmp;
    }
    for (let i = 0; i < r; i++) {
      if (i !== row && M[i][col]) {
        for (let j = col; j <= c; j++) M[i][j] ^= M[row][j];
      }
    }
    pivotCol.push(col);
    row++;
  }
  for (let i = row; i < r; i++) if (M[i][c]) return null;
  const x = Array(c).fill(0);
  for (let i = 0; i < pivotCol.length; i++) x[pivotCol[i]] = M[i][c];
  return x;
}
