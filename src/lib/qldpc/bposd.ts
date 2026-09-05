import { clone, mulVec, solve, wt, type Mat } from "./gf2";
import type { CssCode } from "./codes";

export type DecodeTrace = {
  iter: number;
  residual: number;
  converged: boolean;
};

export type DecodeResult = {
  ok: boolean;
  method: "bp" | "osd" | "fail";
  estimate: number[];
  residual: number[];
  residualWt: number;
  iterations: number;
  traces: DecodeTrace[];
  injected?: number[];
  injectedWt?: number;
};

function tanhClamp(x: number) {
  if (x > 16) return 1;
  if (x < -16) return -1;
  return Math.tanh(x);
}

function atanhClamp(x: number) {
  const y = Math.min(0.999999, Math.max(-0.999999, x));
  return 0.5 * Math.log((1 + y) / (1 - y));
}

function xorVec(a: number[], b: number[]): number[] {
  return a.map((x, i) => x ^ b[i]);
}

function syndromeGap(H: Mat, estimate: number[], syndrome: number[]): number[] {
  return xorVec(mulVec(H, estimate), syndrome);
}

type Tanner = {
  n: number;
  m: number;
  checks: number[][];
  vars: number[][];
};

function tanner(H: Mat): Tanner {
  const m = H.length;
  const n = H[0].length;
  const checks: number[][] = Array.from({ length: m }, () => []);
  const vars: number[][] = Array.from({ length: n }, () => []);
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (H[i][j]) {
        checks[i].push(j);
        vars[j].push(i);
      }
    }
  }
  return { n, m, checks, vars };
}

/**
 * Min-sum / tanh-rule BP on a binary Tanner graph, then OSD-0.
 * Decodes a CSS X-error against Hz (or Z-error against Hx).
 * Success = H ê = syndrome.
 */
export function bpOsd(
  H: Mat,
  syndrome: number[],
  opts: { p?: number; iters?: number; channel?: number[] } = {},
): DecodeResult {
  const p = opts.p ?? 0.05;
  const maxIters = opts.iters ?? 16;
  const T = tanner(H);
  const llrCh = Math.log((1 - p) / Math.max(1e-12, p));
  const channel = opts.channel ?? Array(T.n).fill(llrCh);

  const msgC2V: number[][] = T.checks.map((nbr) => nbr.map(() => 0));
  const msgV2C: number[][] = T.vars.map((nbr) => nbr.map(() => 0));

  const traces: DecodeTrace[] = [];
  let estimate = Array(T.n).fill(0);
  let residual = syndromeGap(H, estimate, syndrome);
  let lastLlrs = channel.slice();

  for (let iter = 0; iter < maxIters; iter++) {
    for (let v = 0; v < T.n; v++) {
      const nbr = T.vars[v];
      let total = channel[v];
      const incoming = nbr.map((c) => {
        const k = T.checks[c].indexOf(v);
        return msgC2V[c][k];
      });
      for (const m of incoming) total += m;
      lastLlrs[v] = total;
      for (let i = 0; i < nbr.length; i++) {
        msgV2C[v][i] = total - incoming[i];
      }
    }

    for (let c = 0; c < T.m; c++) {
      const nbr = T.checks[c];
      const tans = nbr.map((v) => {
        const i = T.vars[v].indexOf(c);
        return tanhClamp(msgV2C[v][i] / 2);
      });
      for (let k = 0; k < nbr.length; k++) {
        let prod = syndrome[c] ? -1 : 1;
        for (let t = 0; t < nbr.length; t++) if (t !== k) prod *= tans[t];
        msgC2V[c][k] = 2 * atanhClamp(prod);
      }
    }

    estimate = lastLlrs.map((L) => (L < 0 ? 1 : 0));
    residual = syndromeGap(H, estimate, syndrome);
    const rwt = wt(residual);
    traces.push({ iter: iter + 1, residual: rwt, converged: rwt === 0 });
    if (rwt === 0) {
      return {
        ok: true,
        method: "bp",
        estimate,
        residual,
        residualWt: 0,
        iterations: iter + 1,
        traces,
      };
    }
  }

  const osd = osd0(H, syndrome, lastLlrs, estimate);
  if (osd) {
    const res = syndromeGap(H, osd, syndrome);
    return {
      ok: wt(res) === 0,
      method: "osd",
      estimate: osd,
      residual: res,
      residualWt: wt(res),
      iterations: maxIters,
      traces,
    };
  }

  return {
    ok: false,
    method: "fail",
    estimate,
    residual,
    residualWt: wt(residual),
    iterations: maxIters,
    traces,
  };
}

function osd0(H: Mat, s: number[], llrs: number[], hard: number[]): number[] | null {
  const m = H.length;
  const n = H[0].length;
  const order = Array.from({ length: n }, (_, i) => i).sort(
    (a, b) => Math.abs(llrs[b]) - Math.abs(llrs[a]),
  );

  const selected: number[] = [];
  const basis: Mat = [];
  for (const col of order) {
    const cand = H.map((row) => [row[col]]);
    const trial = basis.length ? basis.map((row, i) => row.concat(cand[i][0])) : cand;
    if (columnIndependent(trial)) {
      selected.push(col);
      for (let i = 0; i < m; i++) {
        if (!basis[i]) basis[i] = [];
        basis[i].push(H[i][col]);
      }
      if (selected.length === m) break;
    }
  }

  const frozen = Array(n).fill(0);
  for (let j = 0; j < n; j++) if (!selected.includes(j)) frozen[j] = hard[j];
  const contrib = mulVec(H, frozen);
  const target = s.map((bit, i) => bit ^ contrib[i]);
  const AT = clone(H.map((row) => selected.map((j) => row[j])));
  const sol = solve(AT, target);
  if (!sol) return null;
  const x = frozen.slice();
  for (let k = 0; k < selected.length; k++) x[selected[k]] = sol[k];
  return x;
}

function columnIndependent(A: Mat): boolean {
  const m = A.length;
  const k = A[0].length;
  const M = clone(A);
  const used = Array(m).fill(false);
  let rank = 0;
  for (let col = 0; col < k; col++) {
    let piv = -1;
    for (let r = 0; r < m; r++) if (!used[r] && M[r][col]) { piv = r; break; }
    if (piv < 0) return false;
    used[piv] = true;
    rank++;
    for (let r = 0; r < m; r++) {
      if (r !== piv && M[r][col]) {
        for (let c = col; c < k; c++) M[r][c] ^= M[piv][c];
      }
    }
  }
  return rank === k;
}

export function injectError(n: number, weight: number, seed = Date.now()): number[] {
  const e = Array(n).fill(0);
  const idx = Array.from({ length: n }, (_, i) => i);
  let s = seed >>> 0;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  const w = Math.max(0, Math.min(n, weight));
  for (let i = 0; i < w; i++) e[idx[i]] = 1;
  return e;
}

export function runDemo(code: CssCode, weight: number, p = 0.08, seed?: number): DecodeResult {
  const e = injectError(code.n, weight, seed);
  const syn = mulVec(code.Hz, e);
  const result = bpOsd(code.Hz, syn, { p, iters: 18 });
  return { ...result, injected: e, injectedWt: wt(e) };
}
