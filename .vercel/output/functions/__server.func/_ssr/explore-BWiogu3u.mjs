import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as Shell, i as CardTitle, n as CardHeader, o as cn, r as CardHint, s as formatFixed, t as Card } from "./card-BRo59eU1.mjs";
import { n as Slider, t as Label } from "./slider-Bf8PaV1O.mjs";
import { t as Badge } from "./badge-w2OIYh69.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/explore-BWiogu3u.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Tabs = Root2;
function TabsList({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
		className: cn("inline-flex h-11 items-center gap-1 rounded-[var(--radius-md)] bg-surface-2 p-1", className),
		...props
	});
}
function TabsTrigger({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
		className: cn("inline-flex h-9 items-center justify-center rounded-[var(--radius-sm)] px-3 text-xs font-medium text-muted transition-colors data-[state=active]:bg-surface data-[state=active]:text-fg data-[state=active]:shadow-[var(--shadow-border)]", className),
		...props
	});
}
function TabsContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
		className: cn("outline-none", className),
		...props
	});
}
function surfaceCode(distance) {
	const d = Math.max(3, Math.min(15, distance | 1));
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
		hardware: "Superconducting"
	};
}
function colorCode(distance) {
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
		hardware: "Trapped ion"
	};
}
function hypergraphProduct(a, b) {
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
		hardware: "Future qLDPC"
	};
}
function bicycleCode() {
	return {
		id: "bicycle",
		name: "Bivariate bicycle",
		params: "[[144, 12, 12]]",
		n: 144,
		k: 12,
		d: 12,
		rate: 12 / 144,
		notes: "IBM Gross-code family. Twelve logical qubits at distance 12 — the near-term qLDPC flagship.",
		hardware: "Superconducting (research)"
	};
}
function distillT(pIn) {
	const p = Math.max(1e-6, Math.min(.2, pIn));
	const pOut = 35 * p ** 3;
	const yieldRate = 1 / 15;
	const roundsToTarget = (target) => {
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
		roundsTo1e12: roundsToTarget(1e-12)
	};
}
function mpsSpectrum(kind, n) {
	const points = [];
	for (let cut = 1; cut < n; cut++) if (kind === "product") points.push({
		cut,
		chi: 1,
		discarded: 0,
		entropy: 0
	});
	else if (kind === "ghz") points.push({
		cut,
		chi: 2,
		discarded: 0,
		entropy: 1
	});
	else {
		const chiMax = 2 ** Math.min(cut, n - cut);
		const chi = Math.min(chiMax, 16);
		const entropy = Math.min(cut, n - cut);
		const discarded = chi < chiMax ? .15 + .05 * cut : 0;
		points.push({
			cut,
			chi,
			discarded,
			entropy
		});
	}
	return points;
}
function Explore() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mb-6 max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] uppercase tracking-[0.18em] text-muted",
				children: "Codes & compression"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl",
				children: "Logical layer"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed text-muted",
				children: "qLDPC constructions, 15-to-1 magic-state distillation, and MPS bond-dimension behaviour — plus the live BP-OSD and ZX kernels on their own desks."
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
		defaultValue: "qldpc",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
				className: "mb-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "qldpc",
						children: "qLDPC"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "magic",
						children: "Magic states"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "mps",
						children: "MPS"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "qldpc",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QldpcPanel, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "magic",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MagicPanel, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "mps",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MpsPanel, {})
			})
		]
	})] });
}
function QldpcPanel() {
	const [d, setD] = (0, import_react.useState)(5);
	const [a, setA] = (0, import_react.useState)(6);
	const [b, setB] = (0, import_react.useState)(4);
	const codes = (0, import_react.useMemo)(() => [
		surfaceCode(d),
		colorCode(d),
		hypergraphProduct(a, b),
		bicycleCode()
	], [
		d,
		a,
		b
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Parameters" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHint, {
				className: "mt-1",
				children: "Distance and classical-code sizes"
			})] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Surface / color distance" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-sm tabular-nums",
							children: d
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						min: 3,
						max: 13,
						step: 2,
						value: [d],
						onValueChange: ([v]) => setD(v)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "HGP classical n₁" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-sm tabular-nums",
							children: a
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						min: 3,
						max: 12,
						step: 1,
						value: [a],
						onValueChange: ([v]) => setA(v)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "HGP classical n₂" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-sm tabular-nums",
							children: b
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						min: 2,
						max: 10,
						step: 1,
						value: [b],
						onValueChange: ([v]) => setB(v)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TannerSketch, {
						a,
						b
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 sm:grid-cols-2",
			children: codes.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-sm font-semibold",
							children: c.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: c.hardware })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-mono text-lg tabular-nums text-fg",
						children: c.params
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-3 grid grid-cols-3 gap-2 font-mono text-[11px] text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "n" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "text-fg",
								children: c.n
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "k" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "text-fg",
								children: c.k
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "rate" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "text-fg",
								children: formatFixed(c.rate, 3)
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs leading-relaxed text-muted",
						children: c.notes
					})
				]
			}, c.id))
		})]
	});
}
function TannerSketch({ a, b }) {
	const vars = Math.min(8, a);
	const checks = Math.min(6, b);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tanner fragment" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 280 90",
			className: "mt-2 h-24 w-full",
			"aria-hidden": "true",
			children: [Array.from({ length: vars }).map((_, i) => {
				const x = 16 + i * 248 / Math.max(1, vars - 1);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: x,
					cy: 22,
					r: "5",
					fill: "var(--color-fg)"
				}, `v${i}`);
			}), Array.from({ length: checks }).map((_, j) => {
				const x = 28 + j * 224 / Math.max(1, checks - 1);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: x - 6,
						y: 58,
						width: "12",
						height: "12",
						fill: "var(--color-accent)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: 16 + j * 2 % vars * 248 / Math.max(1, vars - 1),
						y1: 22,
						x2: x,
						y2: 64,
						stroke: "var(--color-border-strong)",
						strokeWidth: "0.8"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: 16 + (j * 2 + 1) % vars * 248 / Math.max(1, vars - 1),
						y1: 22,
						x2: x,
						y2: 64,
						stroke: "var(--color-border-strong)",
						strokeWidth: "0.8"
					})
				] }, `c${j}`);
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] text-subtle",
			children: "Circles: qubits · squares: parity checks"
		})
	] });
}
function MagicPanel() {
	const [p, setP] = (0, import_react.useState)(.02);
	const d = distillT(p);
	const barIn = Math.min(100, d.pIn * 400);
	const barOut = Math.min(100, d.pOut * 4e3);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "15-to-1 Bravyi–Kitaev" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHint, {
					className: "mt-1",
					children: "One cleaner T from fifteen noisy copies"
				})] }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Input infidelity p" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-sm tabular-nums",
						children: formatFixed(p, 4)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
					min: .001,
					max: .08,
					step: .001,
					value: [p],
					onValueChange: ([v]) => setP(v)
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[var(--radius-md)] bg-surface-2 p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] uppercase tracking-[0.14em] text-muted",
								children: "p in"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 font-mono text-xl tabular-nums",
								children: formatFixed(d.pIn, 4)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 h-1 rounded-full bg-bg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full bg-warn",
									style: { width: `${barIn}%` }
								})
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[var(--radius-md)] bg-surface-2 p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] uppercase tracking-[0.14em] text-muted",
								children: "p out ≈ 35 p³"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 font-mono text-xl tabular-nums",
								children: d.pOut.toExponential(2)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 h-1 rounded-full bg-bg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full bg-ok",
									style: { width: `${barOut}%` }
								})
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-4 grid grid-cols-3 gap-3 font-mono text-xs text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Yield" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "text-fg",
							children: "1/15"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Rounds to 10⁻⁶" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "text-fg",
							children: d.roundsTo1e6
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Rounds to 10⁻¹²" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "text-fg",
							children: d.roundsTo1e12
						})] })
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Why it matters here" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHint, {
					className: "mt-1",
					children: "Non-Clifford fuel for a logical certificate"
				})] }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-muted",
					children: "Surface and qLDPC codes give cheap Clifford gates. A QuantumHoare post-condition that mentions a T gate needs distilled magic states. Each distillation round cubes the error and spends fifteen physical T injections — the classical BFT layer can treat the output infidelity as the statistical slack in the Hoare bound."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-4 space-y-2 text-sm text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Transversal Cliffords stay in the code space." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "T is injected via a noisy magic state, then distilled." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "A HybridCert can carry both the logical syndrome and p_out." })
					]
				})
			]
		})]
	});
}
function MpsPanel() {
	const [n, setN] = (0, import_react.useState)(6);
	const [kind, setKind] = (0, import_react.useState)("ghz");
	const spec = mpsSpectrum(kind, n);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Variational compression" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHint, {
				className: "mt-1",
				children: "Schmidt rank across each cut"
			})] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-3 gap-1 rounded-[var(--radius-md)] bg-surface-2 p-1",
						children: [
							"ghz",
							"product",
							"volume"
						].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setKind(k),
							className: `h-9 rounded-[var(--radius-sm)] text-xs font-medium ${kind === k ? "bg-surface text-fg shadow-[var(--shadow-border)]" : "text-muted"}`,
							children: k === "ghz" ? "GHZ" : k === "product" ? "Product" : "Volume-law"
						}, k))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Sites" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-sm tabular-nums",
							children: n
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						min: 4,
						max: 10,
						step: 1,
						value: [n],
						onValueChange: ([v]) => setN(v)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm leading-relaxed text-muted",
						children: [
							"Sweep one tensor at a time in mixed canonical form. Two-site updates avoid local minima; SVD truncation is cheaper but looser at the same χ. GHZ stays exact at χ = 2. Volume-law states demand χ ~ 2^",
							n / 2,
							"."
						]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Bond spectrum" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHint, {
				className: "mt-1",
				children: "χ and discarded weight per cut"
			})] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-end gap-2",
				style: { height: 180 },
				children: spec.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-1 flex-col items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-full rounded-sm bg-accent",
							style: {
								height: `${Math.max(8, p.chi / 16 * 140)}px`,
								opacity: .35 + .65 * (1 - p.discarded)
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-[10px] text-muted",
							children: ["c", p.cut]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-[10px] tabular-nums text-fg",
							children: ["χ ", p.chi]
						})
					]
				}, p.cut))
			})]
		})]
	});
}
//#endregion
export { Explore as component };
