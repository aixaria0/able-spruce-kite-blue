//#region node_modules/.nitro/vite/services/ssr/assets/engine-SK60aYzK.js
function otherEnd(w, id) {
	if (w.a === id) return w.b;
	if (w.b === id) return w.a;
	return null;
}
function ghzLike(d = 2, n = 4) {
	const spiders = [{
		id: "h",
		colour: "Z",
		phase: 0,
		arity: 1
	}, ...Array.from({ length: n }, (_, i) => ({
		id: `z${i}`,
		colour: "Z",
		phase: 0,
		arity: i === 0 ? 2 : 1
	}))];
	spiders[0].arity = 1;
	spiders[1].arity = n;
	spiders.slice(1).map((s) => ({
		a: "h",
		b: s.id
	}));
	return {
		d,
		spiders: [{
			id: "ghz",
			colour: "Z",
			phase: 0,
			arity: n
		}],
		wires: [],
		scalar: 1,
		log: [`Seeded a phase-0 Z-spider of arity ${n} (GHZ family over ℤ/${d}).`]
	};
}
function bell(d = 2) {
	return {
		d,
		spiders: [{
			id: "z",
			colour: "Z",
			phase: 0,
			arity: 2
		}, {
			id: "x",
			colour: "X",
			phase: 0,
			arity: 2
		}],
		wires: [{
			a: "z",
			b: "x"
		}, {
			a: "z",
			b: "x"
		}],
		scalar: 1,
		log: ["Bell-like: Z and X spiders joined by two wires (Hopf candidate)."]
	};
}
function splitPhase(d = 3) {
	return {
		d,
		spiders: [{
			id: "a",
			colour: "Z",
			phase: 1,
			arity: 2
		}, {
			id: "b",
			colour: "Z",
			phase: 2,
			arity: 2
		}],
		wires: [{
			a: "a",
			b: "b"
		}],
		scalar: 1,
		log: [`Two Z-spiders, phases 1 and 2 (mod ${d}) — fusion candidate.`]
	};
}
function bumpArity(s, delta) {
	return {
		...s,
		arity: Math.max(0, s.arity + delta)
	};
}
function applyRule(Γ, rule) {
	const d = Γ.d;
	if (rule === "fuse") {
		const w = Γ.wires.find((wire) => {
			const A = Γ.spiders.find((s) => s.id === wire.a);
			const B = Γ.spiders.find((s) => s.id === wire.b);
			return A && B && A.colour === B.colour && A.id !== B.id;
		});
		if (!w) return {
			...Γ,
			log: [...Γ.log, "fuse: no same-colour adjacent pair"]
		};
		const A = Γ.spiders.find((s) => s.id === w.a);
		const B = Γ.spiders.find((s) => s.id === w.b);
		const phase = (A.phase + B.phase) % d;
		const merged = {
			id: A.id,
			colour: A.colour,
			phase,
			arity: A.arity + B.arity - 2
		};
		const spiders = Γ.spiders.filter((s) => s.id !== A.id && s.id !== B.id).concat(merged).map((s) => s);
		const wires = Γ.wires.filter((x) => x !== w).map((x) => ({
			a: x.a === B.id ? A.id : x.a,
			b: x.b === B.id ? A.id : x.b
		})).filter((x) => x.a !== x.b);
		return {
			...Γ,
			spiders,
			wires,
			log: [...Γ.log, `fuse: ${A.id}+${B.id} → ${A.id}  phase ${A.phase}+${B.phase} ≡ ${phase} (mod ${d})`]
		};
	}
	if (rule === "identity") {
		const s = Γ.spiders.find((sp) => sp.phase === 0 && sp.arity === 2);
		if (!s) return {
			...Γ,
			log: [...Γ.log, "identity: no phase-0 arity-2 spider"]
		};
		const ends = Γ.wires.filter((w) => w.a === s.id || w.b === s.id).map((w) => otherEnd(w, s.id)).filter(Boolean);
		let wires = Γ.wires.filter((w) => w.a !== s.id && w.b !== s.id);
		if (ends.length === 2) wires = [...wires, {
			a: ends[0],
			b: ends[1]
		}];
		return {
			...Γ,
			spiders: Γ.spiders.filter((sp) => sp.id !== s.id),
			wires,
			log: [...Γ.log, `identity: removed ${s.id} (straight wire)`]
		};
	}
	if (rule === "hopf") {
		const counts = /* @__PURE__ */ new Map();
		for (const w of Γ.wires) {
			const key = [w.a, w.b].sort().join("|");
			counts.set(key, (counts.get(key) ?? 0) + 1);
		}
		for (const [key, n] of counts) {
			if (n < 2) continue;
			const [a, b] = key.split("|");
			const A = Γ.spiders.find((s) => s.id === a);
			const B = Γ.spiders.find((s) => s.id === b);
			if (!A || !B || A.colour === B.colour) continue;
			let dropped = 0;
			const wires = Γ.wires.filter((w) => {
				if ([w.a, w.b].sort().join("|") === key && dropped < 2) {
					dropped++;
					return false;
				}
				return true;
			});
			const spiders = Γ.spiders.map((s) => s.id === a || s.id === b ? bumpArity(s, -2) : s);
			return {
				...Γ,
				spiders,
				wires,
				scalar: Γ.scalar * d,
				log: [...Γ.log, `hopf: cancelled two ${A.colour}–${B.colour} wires, scalar × ${d}`]
			};
		}
		return {
			...Γ,
			log: [...Γ.log, "hopf: no opposite-colour double wire"]
		};
	}
	if (rule === "colour-change") {
		const s = Γ.spiders.find((sp) => sp.colour === "Z");
		if (!s) return {
			...Γ,
			log: [...Γ.log, "colour-change: no Z-spider"]
		};
		return {
			...Γ,
			spiders: Γ.spiders.map((sp) => sp.id === s.id ? {
				...sp,
				colour: "X"
			} : sp),
			log: [...Γ.log, `colour-change: ${s.id}  Z --F--> X  (phase ${s.phase})`]
		};
	}
	return Γ;
}
function normalize(Γ, steps = 12) {
	let cur = Γ;
	for (let i = 0; i < steps; i++) {
		const before = JSON.stringify({
			s: cur.spiders,
			w: cur.wires,
			k: cur.scalar
		});
		cur = applyRule(cur, "fuse");
		cur = applyRule(cur, "hopf");
		cur = applyRule(cur, "identity");
		if (JSON.stringify({
			s: cur.spiders,
			w: cur.wires,
			k: cur.scalar
		}) === before) break;
	}
	return {
		...cur,
		log: [...cur.log, "normalize: saturated"]
	};
}
var RULES = [
	{
		id: "fuse",
		name: "Spider fusion",
		lean: "fuse"
	},
	{
		id: "identity",
		name: "Identity",
		lean: "identity_rule"
	},
	{
		id: "hopf",
		name: "Hopf law",
		lean: "hopf"
	},
	{
		id: "colour-change",
		name: "Colour change",
		lean: "colour_change"
	}
];
//#endregion
export { normalize as a, ghzLike as i, applyRule as n, splitPhase as o, bell as r, RULES as t };
