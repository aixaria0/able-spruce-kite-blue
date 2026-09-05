//#region node_modules/.nitro/vite/services/ssr/assets/bposd-CIybJcBT.js
function zeros(r, c) {
	return Array.from({ length: r }, () => Array(c).fill(0));
}
function clone(A) {
	return A.map((row) => row.slice());
}
function eye(n) {
	const I = zeros(n, n);
	for (let i = 0; i < n; i++) I[i][i] = 1;
	return I;
}
function transpose(A) {
	const r = A.length;
	const c = A[0]?.length ?? 0;
	const T = zeros(c, r);
	for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) T[j][i] = A[i][j];
	return T;
}
function mulVec(A, v) {
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
function circulant(first) {
	const n = first.length;
	const A = zeros(n, n);
	for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) A[i][j] = first[(j - i + n) % n];
	return A;
}
function hstack(A, B) {
	return A.map((row, i) => row.concat(B[i]));
}
function kron(A, B) {
	const ra = A.length;
	const ca = A[0].length;
	const rb = B.length;
	const cb = B[0].length;
	const C = zeros(ra * rb, ca * cb);
	for (let i = 0; i < ra; i++) for (let j = 0; j < ca; j++) {
		if (!A[i][j]) continue;
		for (let p = 0; p < rb; p++) for (let q = 0; q < cb; q++) C[i * rb + p][j * cb + q] = B[p][q];
	}
	return C;
}
function wt(v) {
	return v.reduce((s, x) => s + x, 0);
}
/** Row-reduce [A | b] over GF(2). Returns particular solution or null if inconsistent. */
function solve(A, b) {
	const r = A.length;
	const c = A[0]?.length ?? 0;
	const M = A.map((row, i) => row.concat(b[i] & 1));
	const pivotCol = [];
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
		for (let i = 0; i < r; i++) if (i !== row && M[i][col]) for (let j = col; j <= c; j++) M[i][j] ^= M[row][j];
		pivotCol.push(col);
		row++;
	}
	for (let i = row; i < r; i++) if (M[i][c]) return null;
	const x = Array(c).fill(0);
	for (let i = 0; i < pivotCol.length; i++) x[pivotCol[i]] = M[i][c];
	return x;
}
function hammingParity() {
	return [
		[
			1,
			0,
			1,
			0,
			1,
			0,
			1
		],
		[
			0,
			1,
			1,
			0,
			0,
			1,
			1
		],
		[
			0,
			0,
			0,
			1,
			1,
			1,
			1
		]
	];
}
/** Steane [[7,1,3]] — CSS with Hx = Hz = Hamming. */
function steane() {
	const H = hammingParity();
	return {
		id: "steane",
		name: "Steane [[7,1,3]]",
		n: 7,
		k: 1,
		d: 3,
		Hx: H,
		Hz: H.map((r) => r.slice()),
		notes: "Self-dual CSS. Transversal Clifford. Ground-truth for the decoder."
	};
}
/**
* Bivariate-bicycle style CSS on 12 qubits.
* Hx = [A | B], Hz = [Bᵀ | Aᵀ] with commuting circulants — matches the 12-qubit mesh.
*/
function bicycle12() {
	const A = circulant([
		1,
		1,
		0,
		1,
		0,
		0
	]);
	const B = circulant([
		1,
		0,
		1,
		0,
		0,
		1
	]);
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
		notes: "Circulant bicycle on 12 edges. The live mesh register is this block."
	};
}
/** Hypergraph product of two classical cycle codes. */
function hgpTiny() {
	const Ha = [
		[
			1,
			1,
			0,
			0,
			0,
			1
		],
		[
			0,
			1,
			1,
			0,
			1,
			0
		],
		[
			0,
			0,
			1,
			1,
			0,
			1
		]
	];
	const Hb = [[
		1,
		1,
		0,
		1
	], [
		0,
		1,
		1,
		1
	]];
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
		notes: "Hypergraph product of two small classical LDPC matrices."
	};
}
var CATALOG = [
	bicycle12(),
	steane(),
	hgpTiny()
];
function getCode(id) {
	return CATALOG.find((c) => c.id === id) ?? bicycle12();
}
function tanhClamp(x) {
	if (x > 16) return 1;
	if (x < -16) return -1;
	return Math.tanh(x);
}
function atanhClamp(x) {
	const y = Math.min(.999999, Math.max(-.999999, x));
	return .5 * Math.log((1 + y) / (1 - y));
}
function xorVec(a, b) {
	return a.map((x, i) => x ^ b[i]);
}
function syndromeGap(H, estimate, syndrome) {
	return xorVec(mulVec(H, estimate), syndrome);
}
function tanner(H) {
	const m = H.length;
	const n = H[0].length;
	const checks = Array.from({ length: m }, () => []);
	const vars = Array.from({ length: n }, () => []);
	for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) if (H[i][j]) {
		checks[i].push(j);
		vars[j].push(i);
	}
	return {
		n,
		m,
		checks,
		vars
	};
}
/**
* Min-sum / tanh-rule BP on a binary Tanner graph, then OSD-0.
* Decodes a CSS X-error against Hz (or Z-error against Hx).
* Success = H ê = syndrome.
*/
function bpOsd(H, syndrome, opts = {}) {
	const p = opts.p ?? .05;
	const maxIters = opts.iters ?? 16;
	const T = tanner(H);
	const llrCh = Math.log((1 - p) / Math.max(1e-12, p));
	const channel = opts.channel ?? Array(T.n).fill(llrCh);
	const msgC2V = T.checks.map((nbr) => nbr.map(() => 0));
	const msgV2C = T.vars.map((nbr) => nbr.map(() => 0));
	const traces = [];
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
			for (let i = 0; i < nbr.length; i++) msgV2C[v][i] = total - incoming[i];
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
		estimate = lastLlrs.map((L) => L < 0 ? 1 : 0);
		residual = syndromeGap(H, estimate, syndrome);
		const rwt = wt(residual);
		traces.push({
			iter: iter + 1,
			residual: rwt,
			converged: rwt === 0
		});
		if (rwt === 0) return {
			ok: true,
			method: "bp",
			estimate,
			residual,
			residualWt: 0,
			iterations: iter + 1,
			traces
		};
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
			traces
		};
	}
	return {
		ok: false,
		method: "fail",
		estimate,
		residual,
		residualWt: wt(residual),
		iterations: maxIters,
		traces
	};
}
function osd0(H, s, llrs, hard) {
	const m = H.length;
	const n = H[0].length;
	const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => Math.abs(llrs[b]) - Math.abs(llrs[a]));
	const selected = [];
	const basis = [];
	for (const col of order) {
		const cand = H.map((row) => [row[col]]);
		if (columnIndependent(basis.length ? basis.map((row, i) => row.concat(cand[i][0])) : cand)) {
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
	const sol = solve(clone(H.map((row) => selected.map((j) => row[j]))), target);
	if (!sol) return null;
	const x = frozen.slice();
	for (let k = 0; k < selected.length; k++) x[selected[k]] = sol[k];
	return x;
}
function columnIndependent(A) {
	const m = A.length;
	const k = A[0].length;
	const M = clone(A);
	const used = Array(m).fill(false);
	let rank = 0;
	for (let col = 0; col < k; col++) {
		let piv = -1;
		for (let r = 0; r < m; r++) if (!used[r] && M[r][col]) {
			piv = r;
			break;
		}
		if (piv < 0) return false;
		used[piv] = true;
		rank++;
		for (let r = 0; r < m; r++) if (r !== piv && M[r][col]) for (let c = col; c < k; c++) M[r][c] ^= M[piv][c];
	}
	return rank === k;
}
function injectError(n, weight, seed = Date.now()) {
	const e = Array(n).fill(0);
	const idx = Array.from({ length: n }, (_, i) => i);
	let s = seed >>> 0;
	const rnd = () => {
		s = s * 1664525 + 1013904223 >>> 0;
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
function runDemo(code, weight, p = .08, seed) {
	const e = injectError(code.n, weight, seed);
	const syn = mulVec(code.Hz, e);
	return {
		...bpOsd(code.Hz, syn, {
			p,
			iters: 18
		}),
		injected: e,
		injectedWt: wt(e)
	};
}
//#endregion
export { wt as a, runDemo as i, bicycle12 as n, getCode as r, CATALOG as t };
