import { l as sleep } from "./card-BRo59eU1.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-CoW4u97h.js
function c(re, im = 0) {
	return {
		re,
		im
	};
}
function cmul(a, b) {
	return {
		re: a.re * b.re - a.im * b.im,
		im: a.re * b.im + a.im * b.re
	};
}
function cscale(a, s) {
	return {
		re: a.re * s,
		im: a.im * s
	};
}
function abs2(a) {
	return a.re * a.re + a.im * a.im;
}
function zeros(n) {
	const out = new Array(n);
	for (let i = 0; i < n; i++) out[i] = {
		re: 0,
		im: 0
	};
	return out;
}
function bit(index, q) {
	return index >> q & 1;
}
function flip(index, q) {
	return index ^ 1 << q;
}
function sha256Hex(input) {
	let h1 = 2166136261;
	let h2 = 2166136261 ^ input.length;
	for (let i = 0; i < input.length; i++) {
		const ch = input.charCodeAt(i);
		h1 ^= ch;
		h1 = Math.imul(h1, 16777619);
		h2 = Math.imul(h2 ^ ch << i % 13, 2246822507);
	}
	const a = (h1 >>> 0).toString(16).padStart(8, "0");
	const b = (h2 >>> 0).toString(16).padStart(8, "0");
	const c = ((h1 ^ h2) >>> 0).toString(16).padStart(8, "0");
	const d = (Math.imul(h1, h2) >>> 0).toString(16).padStart(8, "0");
	return `${a}${b}${c}${d}${a.split("").reverse().join("")}${b}${c}${d}`.slice(0, 64);
}
function mulberry32(seed) {
	let t = seed >>> 0;
	return function next() {
		t += 1831565813;
		let r = Math.imul(t ^ t >>> 15, 1 | t);
		r ^= r + Math.imul(r ^ r >>> 7, 61 | r);
		return ((r ^ r >>> 14) >>> 0) / 4294967296;
	};
}
function defaultConfig() {
	return {
		nQubits: 2,
		shots: 256,
		noise: .04,
		target: "bell",
		byzantine: false,
		useMps: false,
		fidelityThreshold: .65
	};
}
function programLabel(cfg) {
	if (cfg.target === "product") return `product |0⟩^${cfg.nQubits}`;
	if (cfg.nQubits === 2) return "Bell |Φ+⟩";
	return `GHZ-${cfg.nQubits}`;
}
function buildCert(shadow, cfg, bft) {
	const programHash = sha256Hex(`${programLabel(cfg)} shadows=${shadow.shots} noise=${cfg.noise}`);
	const witnessOk = shadow.witness.value < 0;
	const fidOk = shadow.fidelity.value >= cfg.fidelityThreshold;
	const accepted = bft.committed && fidOk && witnessOk;
	const correlators = {};
	for (const [k, v] of Object.entries(shadow.correlators)) correlators[k] = {
		value: v.value,
		error: v.error
	};
	const cert = {
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
		correlators
	};
	cert.binding = sha256Hex(JSON.stringify({
		...cert,
		binding: ""
	}));
	return cert;
}
function certToJson(cert) {
	return JSON.stringify({
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
		bft: {
			view: cert.view,
			leader: cert.leader,
			quorum: cert.quorum
		},
		mps: {
			used: cert.usedMps,
			bond_dim: cert.bondDim
		},
		correlators: cert.correlators,
		binding: cert.binding
	}, null, 2);
}
function quorumOf(n) {
	return 2 * Math.floor((n - 1) / 3) + 1;
}
function makeCluster(cfg) {
	const n = cfg.n;
	return {
		view: 0,
		leader: 0,
		phase: "idle",
		nodes: Array.from({ length: n }, (_, id) => ({
			id,
			label: `N${id}`,
			leader: id === 0,
			voted: false,
			locked: false,
			decided: false,
			byzantine: cfg.byzantineId === id,
			lastVote: null
		})),
		prepareQc: null,
		precommitQc: null,
		commitQc: null,
		decidedValue: null,
		log: ["Cluster idle. Four replicas, f = 1, quorum = 3."]
	};
}
function collectVotes(nodes, view, value, byzantineId) {
	const votes = [];
	for (const node of nodes) {
		if (node.byzantine || node.id === byzantineId) {
			node.voted = false;
			node.lastVote = null;
			continue;
		}
		node.voted = true;
		node.lastVote = value;
		votes.push(node.id);
	}
	return votes;
}
function stepPropose(state, value, cfg) {
	const view = state.view + 1;
	const leader = view % cfg.n;
	const nodes = state.nodes.map((n) => ({
		...n,
		leader: n.id === leader,
		voted: false,
		decided: false,
		lastVote: null
	}));
	return {
		...state,
		view,
		leader,
		phase: "prepare",
		nodes,
		prepareQc: null,
		precommitQc: null,
		commitQc: null,
		decidedValue: null,
		log: [...state.log, `View ${view}: leader N${leader} proposes ${value.slice(0, 12)}…`]
	};
}
function stepPrepare(state, value, cfg) {
	const nodes = state.nodes.map((n) => ({ ...n }));
	const votes = collectVotes(nodes, state.view, value, cfg.byzantineId);
	const q = quorumOf(cfg.n);
	const ok = votes.length >= q && !cfg.failFirstView;
	const qc = ok ? {
		view: state.view,
		phase: "prepare",
		value,
		votes
	} : null;
	return {
		...state,
		nodes,
		phase: ok ? "precommit" : "view-change",
		prepareQc: qc,
		log: [...state.log, ok ? `Prepare QC formed (${votes.length}/${cfg.n}).` : `Prepare failed (${votes.length}/${cfg.n}) — view change.`]
	};
}
function stepPrecommit(state, value, cfg) {
	const nodes = state.nodes.map((n) => ({
		...n,
		locked: !n.byzantine
	}));
	const votes = nodes.filter((n) => !n.byzantine).map((n) => n.id);
	const q = quorumOf(cfg.n);
	const ok = votes.length >= q;
	return {
		...state,
		nodes,
		phase: ok ? "commit" : "view-change",
		precommitQc: ok ? {
			view: state.view,
			phase: "precommit",
			value,
			votes
		} : null,
		log: [...state.log, ok ? `Pre-commit QC + lock (${votes.length}/${cfg.n}).` : `Pre-commit failed — view change.`]
	};
}
function stepCommit(state, value, cfg) {
	const nodes = state.nodes.map((n) => ({
		...n,
		decided: !n.byzantine
	}));
	const votes = nodes.filter((n) => !n.byzantine).map((n) => n.id);
	const q = quorumOf(cfg.n);
	const ok = votes.length >= q;
	return {
		...state,
		nodes,
		phase: ok ? "decided" : "view-change",
		commitQc: ok ? {
			view: state.view,
			phase: "commit",
			value,
			votes
		} : null,
		decidedValue: ok ? value : null,
		log: [...state.log, ok ? `COMMITTED in view ${state.view}.` : `Commit QC failed — view change.`]
	};
}
function stepViewChange(state, cfg) {
	const nodes = state.nodes.map((n) => ({
		...n,
		voted: false,
		locked: false,
		decided: false,
		lastVote: null,
		leader: false
	}));
	return {
		...state,
		nodes,
		phase: "idle",
		log: [...state.log, `View-change from view ${state.view}. Rotating leader.`]
	};
}
var INV_SQRT2 = 1 / Math.sqrt(2);
function dimOf(n) {
	return 1 << n;
}
function ketZero(n) {
	const psi = zeros(dimOf(n));
	psi[0] = c(1, 0);
	return psi;
}
function applyH(psi, q) {
	const dim = psi.length;
	const mask = 1 << q;
	for (let i = 0; i < dim; i++) {
		if (i & mask) continue;
		const j = i | mask;
		const a = psi[i];
		const b = psi[j];
		psi[i] = {
			re: INV_SQRT2 * (a.re + b.re),
			im: INV_SQRT2 * (a.im + b.im)
		};
		psi[j] = {
			re: INV_SQRT2 * (a.re - b.re),
			im: INV_SQRT2 * (a.im - b.im)
		};
	}
}
function applySdg(psi, q) {
	const dim = psi.length;
	const mask = 1 << q;
	for (let i = 0; i < dim; i++) if (i & mask) {
		const a = psi[i];
		psi[i] = {
			re: a.im,
			im: -a.re
		};
	}
}
function applyCX(psi, cQ, tQ) {
	const dim = psi.length;
	const cMask = 1 << cQ;
	const tMask = 1 << tQ;
	for (let i = 0; i < dim; i++) if (i & cMask && !(i & tMask)) {
		const j = i | tMask;
		const tmp = psi[i];
		psi[i] = psi[j];
		psi[j] = tmp;
	}
}
function applyPauliBasis(psi, bases) {
	for (let q = 0; q < bases.length; q++) {
		const b = bases[q];
		if (b === "X") applyH(psi, q);
		else if (b === "Y") {
			applySdg(psi, q);
			applyH(psi, q);
		}
	}
}
function cloneState(psi) {
	return psi.map((z) => ({
		re: z.re,
		im: z.im
	}));
}
function sampleComputational(psi, rand) {
	let r = rand();
	for (let i = 0; i < psi.length; i++) {
		r -= abs2(psi[i]);
		if (r <= 0) return i;
	}
	return psi.length - 1;
}
function indexToBits(index, n) {
	let s = "";
	for (let q = 0; q < n; q++) s += bit(index, q) ? "1" : "0";
	return s;
}
function prepareTarget(kind, n) {
	const psi = ketZero(n);
	if (kind === "product") return psi;
	applyH(psi, 0);
	if (kind === "bell" || kind === "ghz") for (let q = 0; q < n - 1; q++) applyCX(psi, q, q + 1);
	return psi;
}
function pauliExpectation(psi, pauli) {
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
			if (p === "X") idx = flip(idx, q);
			else if (p === "Z") {
				if (b) amp = cscale(amp, -1);
			} else if (p === "Y") {
				idx = flip(idx, q);
				amp = b ? cmul(amp, c(0, -1)) : cmul(amp, c(0, 1));
			}
		}
		out[idx] = {
			re: out[idx].re + amp.re,
			im: out[idx].im + amp.im
		};
	}
	let re = 0;
	for (let i = 0; i < dim; i++) re += psi[i].re * out[i].re + psi[i].im * out[i].im;
	return re;
}
function allPauliStrings(n) {
	const letters = [
		"I",
		"X",
		"Y",
		"Z"
	];
	const out = [];
	const total = 4 ** n;
	for (let i = 0; i < total; i++) {
		const s = [];
		let x = i;
		for (let q = 0; q < n; q++) {
			s.push(letters[x & 3]);
			x >>= 2;
		}
		out.push(s);
	}
	return out;
}
function pauliKey(p) {
	return p.join("");
}
var PAULI_XYZ = [
	"X",
	"Y",
	"Z"
];
function inverseFactor(pauli) {
	let k = 0;
	for (const ch of pauli) if (ch !== "I") k++;
	return 3 ** k;
}
function snapshotContribution(bits, measured, observable) {
	let val = 1;
	for (let i = 0; i < observable.length; i++) {
		const o = observable[i];
		if (o === "I") continue;
		if (measured[i] !== o) return 0;
		val *= bits[i] === "0" ? 1 : -1;
	}
	return val * inverseFactor(observable);
}
function medianOfMeans(values, nBatches = 8) {
	if (values.length === 0) return {
		value: 0,
		error: 1,
		samples: 0
	};
	const nBatchesClamped = Math.max(1, Math.min(nBatches, Math.floor(values.length / 2) || 1));
	const batchSize = Math.max(1, Math.floor(values.length / nBatchesClamped));
	const means = [];
	for (let i = 0; i < nBatchesClamped; i++) {
		const start = i * batchSize;
		const end = i === nBatchesClamped - 1 ? values.length : start + batchSize;
		if (end <= start) continue;
		let s = 0;
		for (let j = start; j < end; j++) s += values[j];
		means.push(s / (end - start));
	}
	if (means.length === 0) return {
		value: values.reduce((a, b) => a + b, 0) / values.length,
		error: 1,
		samples: values.length
	};
	means.sort((a, b) => a - b);
	const med = means[Math.floor(means.length / 2)];
	const absDev = means.map((m) => Math.abs(m - med)).sort((a, b) => a - b);
	return {
		value: med,
		error: 1.4826 * (absDev[Math.floor(absDev.length / 2)] + 1e-12) / Math.sqrt(means.length),
		samples: values.length
	};
}
function estimatePauli(snapshots, observable) {
	const vals = [];
	for (const s of snapshots) vals.push(snapshotContribution(s.bits, s.pauli, observable));
	return medianOfMeans(vals);
}
function fidelityFromPaulis(snapshots, targetPaulis, n) {
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
		samples: snapshots.length
	};
}
function bellWitness(snapshots) {
	const xx = estimatePauli(snapshots, "XX");
	const yy = estimatePauli(snapshots, "YY");
	const zz = estimatePauli(snapshots, "ZZ");
	return {
		value: .5 - .25 * (1 + xx.value - yy.value + zz.value),
		error: .25 * Math.sqrt(xx.error ** 2 + yy.error ** 2 + zz.error ** 2),
		samples: snapshots.length
	};
}
function ghzWitness(snapshots, n) {
	const xx = estimatePauli(snapshots, "X".repeat(n));
	const zzKeys = [];
	for (let i = 0; i < n - 1; i++) {
		let s = "";
		for (let q = 0; q < n; q++) s += q === i || q === i + 1 ? "Z" : "I";
		zzKeys.push(s);
	}
	const zzs = zzKeys.map((k) => estimatePauli(snapshots, k));
	const zMean = zzs.reduce((a, b) => a + b.value, 0) / Math.max(1, zzs.length);
	return {
		value: .5 - .25 * (1 + xx.value + zMean),
		error: .25 * Math.sqrt(xx.error ** 2 + .05 ** 2),
		samples: snapshots.length
	};
}
function relevantPaulis(kind, n) {
	const psi = prepareTarget(kind, n);
	if (n <= 3) return allPauliStrings(n).map((p) => ({
		key: pauliKey(p),
		chi: pauliExpectation(psi, p)
	}));
	const keys = [];
	keys.push(Array(n).fill("I"));
	keys.push(Array(n).fill("X"));
	keys.push(Array(n).fill("Z"));
	for (let i = 0; i < n - 1; i++) {
		const s = Array(n).fill("I");
		s[i] = "Z";
		s[i + 1] = "Z";
		keys.push(s);
	}
	if (n === 2) keys.push(["Y", "Y"]);
	return keys.map((p) => ({
		key: pauliKey(p),
		chi: pauliExpectation(psi, p)
	}));
}
function schmidtDiscarded(kind, n, maxBond) {
	if (kind === "product") return {
		bondDim: 1,
		discarded: 0
	};
	const rank = 2;
	const kept = Math.min(rank, Math.max(1, maxBond));
	return {
		bondDim: kept,
		discarded: kept >= rank ? 0 : .5
	};
}
function runClassicalShadows(opts) {
	const n = Math.max(2, Math.min(6, opts.nQubits));
	const shots = Math.max(32, Math.min(2e3, Math.floor(opts.shots)));
	const noise = Math.max(0, Math.min(.6, opts.noise));
	const prepared = n === 2 && opts.target === "ghz" ? "bell" : opts.target;
	const certified = n === 2 ? "bell" : "ghz";
	const rand = mulberry32(opts.seed ?? Date.now() ^ shots * 997);
	const psi = prepareTarget(prepared, n);
	const snapshots = [];
	for (let s = 0; s < shots; s++) {
		const bases = [];
		for (let q = 0; q < n; q++) bases.push(PAULI_XYZ[Math.floor(rand() * 3)]);
		let bits;
		if (rand() < noise) {
			bits = "";
			for (let q = 0; q < n; q++) bits += rand() < .5 ? "0" : "1";
		} else {
			const copy = cloneState(psi);
			applyPauliBasis(copy, bases);
			bits = indexToBits(sampleComputational(copy, rand), n);
		}
		snapshots.push({
			bits,
			pauli: bases.join("")
		});
	}
	const fidelity = fidelityFromPaulis(snapshots, relevantPaulis(certified, n), n);
	const dim = 2 ** n;
	const overlap = prepared === "product" ? .5 : 1;
	const trueFidelity = (1 - noise) * overlap + noise / dim;
	const trueWitness = .5 - trueFidelity;
	const witness = n === 2 ? bellWitness(snapshots) : ghzWitness(snapshots, n);
	const correlators = {};
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
		discardedWeight: mps.discarded
	};
}
var LEDGER_KEY = "lattice.certs.v1";
function pushLog(log, text, tone = "info") {
	return [...log, {
		t: Date.now(),
		text,
		tone
	}].slice(-80);
}
function loadLedger() {
	if (typeof window === "undefined") return [];
	try {
		const raw = window.localStorage.getItem(LEDGER_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed.slice(0, 40) : [];
	} catch {
		return [];
	}
}
function saveLedger(certs) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(LEDGER_KEY, JSON.stringify(certs.slice(0, 40)));
}
var useEngine = create((set, get) => ({
	config: defaultConfig(),
	bft: makeCluster({
		n: 4,
		byzantineId: null
	}),
	shadow: null,
	cert: null,
	running: false,
	progress: 0,
	phaseLabel: "Idle",
	log: [{
		t: Date.now(),
		text: "Lattice idle. Local trapped-ion simulator online.",
		tone: "info"
	}],
	ledger: [],
	history: [],
	setConfig: (patch) => set((s) => ({ config: {
		...s.config,
		...patch
	} })),
	hydrate: () => set({ ledger: loadLedger() }),
	reset: () => set({
		bft: makeCluster({
			n: 4,
			byzantineId: get().config.byzantine ? 3 : null
		}),
		shadow: null,
		cert: null,
		running: false,
		progress: 0,
		phaseLabel: "Idle"
	}),
	launch: async () => {
		if (get().running) return;
		const cfg = get().config;
		const bftCfg = {
			n: 4,
			byzantineId: cfg.byzantine ? 3 : null
		};
		set({
			running: true,
			progress: 4,
			phaseLabel: "Propose",
			cert: null,
			shadow: null,
			bft: makeCluster(bftCfg),
			log: pushLog(get().log, `Round armed · ${cfg.nQubits}q · ${cfg.shots} shots · p=${cfg.noise.toFixed(2)}`)
		});
		const value = sha256Hex(`round-${Date.now()}-${cfg.target}-${cfg.nQubits}`);
		await sleep(280);
		let bft = stepPropose(get().bft, value, bftCfg);
		set({
			bft,
			progress: 18,
			phaseLabel: "Prepare",
			log: pushLog(get().log, bft.log[bft.log.length - 1])
		});
		await sleep(320);
		bft = stepPrepare(bft, value, bftCfg);
		set({
			bft,
			progress: 34,
			phaseLabel: bft.phase === "view-change" ? "View-change" : "Shadows",
			log: pushLog(get().log, bft.log[bft.log.length - 1], bft.phase === "view-change" ? "warn" : "info")
		});
		if (bft.phase === "view-change") {
			await sleep(260);
			bft = stepViewChange(bft, bftCfg);
			bft = stepPropose(bft, value, { ...bftCfg });
			bft = stepPrepare(bft, value, {
				...bftCfg,
				failFirstView: false
			});
			set({
				bft,
				progress: 42,
				phaseLabel: "Shadows",
				log: pushLog(get().log, "Leader rotated. Prepare QC recovered.")
			});
		}
		await sleep(180);
		set({
			phaseLabel: "Classical shadows",
			progress: 48,
			log: pushLog(get().log, "Sampling Pauli snapshots on the ion-noise backend.")
		});
		await sleep(40);
		const shadow = runClassicalShadows({
			nQubits: cfg.nQubits,
			shots: cfg.shots,
			noise: cfg.noise,
			target: cfg.target,
			useMps: cfg.useMps || cfg.nQubits >= 6
		});
		set({
			shadow,
			progress: 70,
			phaseLabel: "Pre-commit",
			log: pushLog(get().log, `Shadow F = ${shadow.fidelity.value.toFixed(3)} ± ${shadow.fidelity.error.toFixed(3)} · ⟨W⟩ = ${shadow.witness.value.toFixed(3)}`)
		});
		await sleep(300);
		bft = stepPrecommit(bft, value, bftCfg);
		set({
			bft,
			progress: 82,
			phaseLabel: "Commit",
			log: pushLog(get().log, bft.log[bft.log.length - 1])
		});
		await sleep(280);
		bft = stepCommit(bft, value, bftCfg);
		const committed = bft.phase === "decided";
		const cert = buildCert(shadow, cfg, {
			view: bft.view,
			leader: bft.leader,
			committed
		});
		const ledger = [cert, ...get().ledger].slice(0, 40);
		saveLedger(ledger);
		const history = [...get().history, {
			t: cert.timestamp,
			fidelity: cert.fidelity,
			witness: cert.witness,
			accepted: cert.accepted
		}].slice(-24);
		set({
			bft,
			cert,
			ledger,
			history,
			running: false,
			progress: 100,
			phaseLabel: cert.accepted ? "Accepted" : "Rejected",
			log: pushLog(get().log, cert.accepted ? `HybridCert ACCEPT · bound ${cert.binding.slice(0, 12)}…` : `HybridCert REJECT · BFT ${committed ? "ok" : "fail"} · F ${cert.fidelity.toFixed(2)}`, cert.accepted ? "ok" : "bad")
		});
	}
}));
//#endregion
export { useEngine as n, certToJson as t };
