import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Shell, c as shortHash, i as CardTitle, n as CardHeader, o as cn, r as CardHint, s as formatFixed, t as Card } from "./card-BRo59eU1.mjs";
import { t as Button } from "./button-CvnqdzAH.mjs";
import { n as Slider, t as Label } from "./slider-Bf8PaV1O.mjs";
import { t as Badge } from "./badge-w2OIYh69.mjs";
import { n as useEngine, t as certToJson } from "./store-CoW4u97h.mjs";
import { t as MeshChat } from "./mesh-chat-gXE5UMyE.mjs";
import { a as Copy, i as Play, o as Check, r as Square, t as X } from "../_libs/lucide-react.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
import { a as CartesianGrid, i as Area, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CPVifo-R.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-11 w-full rounded-[var(--radius-sm)] bg-surface-2 px-3 text-sm text-fg shadow-[var(--shadow-border)] placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60", className),
		...props
	});
}
function Switch({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
		className: cn("peer inline-flex h-6 w-11 shrink-0 items-center rounded-full bg-surface-2 shadow-[var(--shadow-border)] transition-colors data-[state=checked]:bg-accent", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: "pointer-events-none block size-5 translate-x-0.5 rounded-full bg-fg transition-transform data-[state=checked]:translate-x-[22px] data-[state=checked]:bg-accent-fg" })
	});
}
function parseIntent(raw, base) {
	const text = raw.toLowerCase().trim();
	const config = {};
	let run = /run|launch|execute|go|start/.test(text);
	const notes = [];
	const qubitMatch = text.match(/(\d+)\s*q(?:ubit)?s?/);
	if (qubitMatch) {
		const n = Math.max(2, Math.min(6, Number(qubitMatch[1])));
		config.nQubits = n;
		notes.push(`${n} qubits`);
	} else if (/all twelve|12/.test(text) && /entangle|ghz|inham|درهم/.test(text)) {
		config.nQubits = 6;
		notes.push("capped at 6 physical qubits for exact shadows");
	}
	const shotMatch = text.match(/(\d+)\s*shots?/);
	if (shotMatch) {
		config.shots = Math.max(32, Math.min(2e3, Number(shotMatch[1])));
		notes.push(`${config.shots} shots`);
	}
	if (/product|computational|\|0/.test(text)) {
		config.target = "product";
		notes.push("product |0…0⟩");
	} else if (/ghz/.test(text) || /entangle|inham|درهم/.test(text)) {
		const n = config.nQubits ?? base.nQubits;
		config.target = n === 2 ? "bell" : "ghz";
		notes.push(n === 2 ? "Bell pair" : "GHZ");
	} else if (/bell|phi|φ/.test(text)) {
		config.target = "bell";
		config.nQubits = 2;
		notes.push("Bell |Φ+⟩");
	}
	if (/heavy|kill|severe|شدید|سنگین|زیاد/.test(text)) {
		config.noise = .28;
		notes.push("heavy depolarizing noise");
	} else if (/light|low|کم|ریز/.test(text)) {
		config.noise = .02;
		notes.push("light ion-like noise");
	} else if (/clean|no noise|zero noise|perfect/.test(text)) {
		config.noise = 0;
		notes.push("noiseless");
	} else if (/noise|نویز|خراب/.test(text)) {
		config.noise = .1;
		notes.push("moderate noise");
	}
	if (/byzantine|faulty|evil|liar/.test(text)) {
		config.byzantine = true;
		notes.push("one Byzantine replica");
	} else if (/honest|no byz/.test(text)) config.byzantine = false;
	if (/mps|tensor|bond/.test(text)) {
		config.useMps = true;
		config.nQubits = Math.max(config.nQubits ?? base.nQubits, 6);
		notes.push("MPS path");
	}
	if (!run && notes.length > 0 && /please|now|do it/.test(text)) run = true;
	if (notes.length === 0 && text.length > 0) notes.push("no keywords matched — using current controls");
	return {
		config,
		run,
		note: notes.join(" · ") || "ready"
	};
}
var PRESETS = [
	{
		id: "clean-bell",
		label: "Clean Bell",
		hint: "Should accept",
		config: {
			nQubits: 2,
			target: "bell",
			noise: .02,
			shots: 256,
			byzantine: false,
			useMps: false
		}
	},
	{
		id: "noisy-ghz",
		label: "Noisy GHZ-4",
		hint: "Borderline",
		config: {
			nQubits: 4,
			target: "ghz",
			noise: .18,
			shots: 400,
			byzantine: false,
			useMps: false
		}
	},
	{
		id: "product",
		label: "Product state",
		hint: "Should reject",
		config: {
			nQubits: 2,
			target: "product",
			noise: .02,
			shots: 256,
			byzantine: false
		}
	},
	{
		id: "byz",
		label: "Byzantine quorum",
		hint: "f = 1 still commits",
		config: {
			nQubits: 2,
			target: "bell",
			noise: .03,
			shots: 256,
			byzantine: true
		}
	},
	{
		id: "heavy",
		label: "Guillotine",
		hint: "Noise kills the cert",
		config: {
			nQubits: 3,
			target: "ghz",
			noise: .42,
			shots: 320,
			byzantine: false
		}
	}
];
var TARGETS = [
	{
		id: "bell",
		label: "Bell"
	},
	{
		id: "ghz",
		label: "GHZ"
	},
	{
		id: "product",
		label: "Product"
	}
];
function ControlPanel() {
	const { config, setConfig, launch, running, reset } = useEngine();
	const [cmd, setCmd] = (0, import_react.useState)("");
	const [hint, setHint] = (0, import_react.useState)("Try: “GHZ 4 qubits, heavy noise, run”");
	function applyCommand() {
		const parsed = parseIntent(cmd, config);
		setConfig(parsed.config);
		setHint(parsed.note);
		if (parsed.run) launch();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "flex flex-col gap-4 p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
				className: "mb-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Directive" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHint, {
					className: "mt-1",
					children: "Local ion-trap noise. No cloud token."
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => {
					e.preventDefault();
					applyCommand();
				},
				className: "flex flex-col gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "cmd",
						children: "Command"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "cmd",
						value: cmd,
						onChange: (e) => setCmd(e.target.value),
						placeholder: "entangle 4 qubits with light noise",
						autoComplete: "off"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-subtle",
						children: hint
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1.5",
				children: PRESETS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setConfig(p.config),
					className: "h-9 rounded-full px-3 text-xs text-muted shadow-[var(--shadow-border)] transition-colors hover:text-fg",
					children: p.label
				}, p.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Target" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 grid grid-cols-3 gap-1 rounded-[var(--radius-md)] bg-surface-2 p-1",
				children: TARGETS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setConfig({
						target: t.id,
						nQubits: t.id === "bell" ? 2 : Math.max(config.nQubits, t.id === "ghz" ? 3 : 2)
					}),
					className: cn("h-9 rounded-[var(--radius-sm)] text-xs font-medium transition-colors", config.target === t.id ? "bg-surface text-fg shadow-[var(--shadow-border)]" : "text-muted"),
					children: t.label
				}, t.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Qubits" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-sm tabular-nums text-fg",
					children: config.nQubits
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
				min: 2,
				max: 6,
				step: 1,
				value: [config.nQubits],
				onValueChange: ([v]) => setConfig({
					nQubits: v,
					target: v === 2 && config.target === "ghz" ? "bell" : v > 2 && config.target === "bell" ? "ghz" : config.target,
					useMps: v >= 6 ? true : config.useMps
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Shots" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-sm tabular-nums text-fg",
					children: config.shots
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
				min: 64,
				max: 800,
				step: 32,
				value: [config.shots],
				onValueChange: ([v]) => setConfig({ shots: v })
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Depolarizing p" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-sm tabular-nums text-fg",
					children: config.noise.toFixed(2)
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
				min: 0,
				max: .5,
				step: .01,
				value: [config.noise],
				onValueChange: ([v]) => setConfig({ noise: v })
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 py-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Byzantine replica" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-subtle",
					children: "N3 withholds votes. Quorum still 3."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: config.byzantine,
					onCheckedChange: (v) => setConfig({ byzantine: v }),
					"aria-label": "Byzantine replica"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 py-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "MPS path" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-subtle",
					children: "On at 6 qubits. Bond dimension 8."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: config.useMps || config.nQubits >= 6,
					onCheckedChange: (v) => setConfig({ useMps: v }),
					"aria-label": "MPS path"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "flex-1",
					onClick: () => void launch(),
					disabled: running,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {}), running ? "Running" : "Launch round"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					size: "icon",
					onClick: reset,
					"aria-label": "Reset",
					disabled: running,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, {})
				})]
			})
		]
	});
}
function QubitLattice() {
	const { config, running, shadow, phaseLabel } = useEngine();
	const n = config.nQubits;
	const entangled = config.target !== "product";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Register" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHint, {
				className: "mt-1",
				children: config.target === "product" ? `Product |0⟩^${n}` : n === 2 ? "Bell |Φ+⟩  ·  CX 0→1" : `GHZ-${n}  ·  H + linear CX`
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-[11px] uppercase tracking-wider text-muted",
				children: phaseLabel
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative flex h-36 items-center justify-center sm:h-40",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					viewBox: "0 0 320 120",
					className: "h-full w-full",
					"aria-hidden": "true",
					children: [
						Array.from({ length: n - 1 }).map((_, i) => {
							const x1 = 28 + i * 264 / Math.max(1, n - 1);
							const x2 = 28 + (i + 1) * 264 / Math.max(1, n - 1);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
								x1,
								y1: 60,
								x2,
								y2: 60,
								stroke: entangled ? "var(--color-accent)" : "var(--color-subtle)",
								strokeWidth: entangled ? 1.6 : .8,
								strokeDasharray: entangled ? "0" : "4 4",
								opacity: entangled ? .85 : .4
							}, i);
						}),
						running && entangled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							r: "3.5",
							fill: "var(--color-fg)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("animateMotion", {
								dur: "1.6s",
								repeatCount: "indefinite",
								path: `M 28 60 L 292 60`
							})
						}) : null,
						Array.from({ length: n }).map((_, i) => {
							const x = 28 + i * 264 / Math.max(1, n - 1);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
									cx: x,
									cy: 60,
									r: running ? 13 : 11,
									fill: "var(--color-surface-2)",
									stroke: "var(--color-fg)",
									strokeWidth: "1.2",
									className: cn(running && "origin-center")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
									x,
									y: 64,
									textAnchor: "middle",
									fill: "var(--color-fg)",
									fontSize: "10",
									fontFamily: "var(--font-mono)",
									children: i
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
									x,
									y: 96,
									textAnchor: "middle",
									fill: "var(--color-muted)",
									fontSize: "9",
									fontFamily: "var(--font-mono)",
									children: ["q", i]
								})
							] }, i);
						})
					]
				})
			}),
			shadow ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 font-mono text-[11px] text-muted",
				children: [
					shadow.shots,
					" snapshots",
					shadow.usedMps ? ` · MPS χ=${shadow.bondDim}` : " · dense Pauli inverse channel"
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-subtle",
				children: "Launch a round to sample classical shadows."
			})
		]
	});
}
var PHASES = [
	"prepare",
	"precommit",
	"commit",
	"decided"
];
function HotStuffCluster() {
	const { bft } = useEngine();
	const positions = [
		{
			x: 50,
			y: 18
		},
		{
			x: 82,
			y: 50
		},
		{
			x: 50,
			y: 82
		},
		{
			x: 18,
			y: 50
		}
	];
	const tone = bft.phase === "decided" ? "ok" : bft.phase === "view-change" ? "warn" : bft.phase === "idle" ? "muted" : "accent";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "HotStuff" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHint, {
			className: "mt-1",
			children: [
				"View ",
				bft.view || "—",
				" · leader N",
				bft.leader,
				" · quorum 3/4"
			]
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			tone,
			children: bft.phase
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-[minmax(0,1fr)_140px] sm:items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: "0 0 100 100",
				className: "mx-auto h-44 w-44",
				"aria-hidden": "true",
				children: [positions.map((p, i) => {
					const q = positions[(i + 1) % 4];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: p.x,
						y1: p.y,
						x2: q.x,
						y2: q.y,
						stroke: "var(--color-border-strong)",
						strokeWidth: "0.6"
					}, `e-${i}`);
				}), bft.nodes.map((node, i) => {
					const p = positions[i];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: p.x,
							cy: p.y,
							r: node.leader ? 11 : 9,
							fill: node.decided ? "var(--color-ok)" : "var(--color-surface-2)",
							stroke: node.leader ? "var(--color-fg)" : node.byzantine ? "var(--color-bad)" : "var(--color-accent)",
							strokeWidth: node.leader ? 1.6 : 1
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							x: p.x,
							y: p.y + 1.2,
							textAnchor: "middle",
							fontSize: "5.5",
							fontFamily: "var(--font-mono)",
							fill: node.decided ? "var(--color-ok-fg)" : "var(--color-fg)",
							children: node.label
						}),
						node.voted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: p.x + 8,
							cy: p.y - 8,
							r: "1.6",
							fill: "var(--color-accent)"
						}) : null
					] }, node.id);
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "flex flex-row gap-2 sm:flex-col",
				children: PHASES.map((ph) => {
					const active = bft.phase === ph || ph === "decided" && bft.phase === "decided";
					const done = ph === "prepare" && bft.prepareQc || ph === "precommit" && bft.precommitQc || ph === "commit" && bft.commitQc || ph === "decided" && bft.decidedValue;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: cn("flex-1 rounded-[var(--radius-sm)] px-2 py-2 text-[11px] uppercase tracking-wider", active ? "bg-surface-2 text-fg" : done ? "text-ok" : "text-subtle"),
						children: ph
					}, ph);
				})
			})]
		})]
	});
}
function Correlators() {
	const { shadow } = useEngine();
	const entries = shadow ? Object.entries(shadow.correlators) : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Pauli correlators" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHint, {
			className: "mt-1",
			children: "Inverse-channel snapshots · median-of-means"
		})] }) }), entries.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Correlators appear after a shadow round."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex flex-col gap-3",
			children: entries.map(([key, est]) => {
				const mag = Math.max(-1, Math.min(1, est.value));
				const pct = (mag + 1) / 2 * 100;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-1 flex items-baseline justify-between font-mono text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted",
						children: key
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "tabular-nums text-fg",
						children: [
							formatFixed(est.value, 3),
							" ± ",
							formatFixed(est.error, 3)
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative h-1.5 rounded-full bg-surface-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-y-0 left-1/2 w-px bg-border-strong" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute top-0 h-full rounded-full bg-accent",
						style: {
							left: mag >= 0 ? "50%" : `${pct}%`,
							width: `${Math.abs(mag) * 50}%`
						}
					})]
				})] }, key);
			})
		})]
	});
}
function CertificatePanel() {
	const { cert, shadow } = useEngine();
	const [copied, setCopied] = (0, import_react.useState)(false);
	async function copyJson() {
		if (!cert) return;
		try {
			await navigator.clipboard.writeText(certToJson(cert));
			setCopied(true);
			setTimeout(() => setCopied(false), 1400);
		} catch {
			setCopied(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "flex h-full flex-col p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "QuantumHoareCert" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHint, {
			className: "mt-1",
			children: "Bound to the HotStuff digest"
		})] }), cert ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			tone: cert.accepted ? "ok" : "bad",
			children: cert.accepted ? "ACCEPT" : "REJECT"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "idle" })] }), cert ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Fidelity",
						value: formatFixed(cert.fidelity, 3),
						sub: `± ${formatFixed(cert.fidelityError, 3)}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Witness",
						value: formatFixed(cert.witness, 3),
						sub: `± ${formatFixed(cert.witnessError, 3)}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "True F",
						value: formatFixed(cert.trueFidelity, 3),
						sub: "depolarizing analytic"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Shots",
						value: String(cert.shots),
						sub: `${cert.nQubits} qubits`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-4 space-y-1.5 font-mono text-[11px] text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "program",
						v: shortHash(cert.programHash, 16)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "binding",
						v: shortHash(cert.binding, 16)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "view",
						v: `${cert.view} · leader N${cert.leader}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "backend",
						v: cert.backend
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "secondary",
				className: "mt-4 w-full",
				onClick: () => void copyJson(),
				children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {}), copied ? "Copied" : "Copy JSON"]
			})
		] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col items-start justify-center gap-2 py-8 text-sm text-muted",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4 text-subtle" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "No certificate yet. Launch a round to mint a HybridCert." }),
				shadow ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-subtle",
					children: "Shadows ready — waiting on BFT commit."
				}) : null
			]
		})]
	});
}
function Stat({ label, value, sub }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[var(--radius-md)] bg-surface-2 p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[11px] uppercase tracking-[0.14em] text-muted",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 font-mono text-xl tabular-nums text-fg",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[11px] text-subtle",
				children: sub
			})
		]
	});
}
function Row({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: k }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "truncate text-fg",
			children: v
		})]
	});
}
function EventLog() {
	const { log } = useEngine();
	const [live, setLive] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setLive(true), []);
	const lines = [...log].reverse().slice(0, 18);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
			className: "mb-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Monitor" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "flex max-h-56 flex-col gap-1.5 overflow-auto pr-1",
			children: lines.map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: cn("font-mono text-[11px] leading-relaxed", line.tone === "ok" && "text-ok", line.tone === "bad" && "text-bad", line.tone === "warn" && "text-warn", line.tone === "info" && "text-muted"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-subtle",
						children: live ? new Date(line.t).toLocaleTimeString() : "--:--:--"
					}),
					" ",
					line.text
				]
			}, `${line.t}-${i}`))
		})]
	});
}
function Progress({ value, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("h-1 w-full overflow-hidden rounded-full bg-surface-2", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-full bg-accent transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
			style: { width: `${Math.max(0, Math.min(100, value))}%` }
		})
	});
}
function FidelityChart() {
	const { history, running, progress } = useEngine();
	const data = history.map((h, i) => ({
		i: i + 1,
		F: Number(h.fidelity.toFixed(3)),
		W: Number(h.witness.toFixed(3))
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Round history" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHint, {
				className: "mt-1",
				children: "Shadow fidelity across accepted and rejected certs"
			})] }) }),
			running ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
				value: progress,
				className: "mb-4"
			}) : null,
			data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-8 text-sm text-muted",
				children: "History fills as you run rounds."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-44",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
						data,
						margin: {
							top: 8,
							right: 8,
							left: -18,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "color-mix(in oklab, var(--color-fg) 8%, transparent)",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "i",
								tick: {
									fill: "var(--color-muted)",
									fontSize: 11
								},
								axisLine: false,
								tickLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								domain: [0, 1],
								tick: {
									fill: "var(--color-muted)",
									fontSize: 11
								},
								axisLine: false,
								tickLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								background: "var(--color-surface)",
								border: "1px solid color-mix(in oklab, var(--color-fg) 12%, transparent)",
								borderRadius: 8,
								fontSize: 12
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
								type: "monotone",
								dataKey: "F",
								stroke: "var(--color-accent)",
								fill: "color-mix(in oklab, var(--color-accent) 18%, transparent)",
								strokeWidth: 1.6
							})
						]
					})
				})
			})
		]
	});
}
function Home() {
	const hydrate = useEngine((s) => s.hydrate);
	(0, import_react.useEffect)(() => {
		hydrate();
	}, [hydrate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mb-6 max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] uppercase tracking-[0.18em] text-muted",
				children: "Hybrid classical–quantum"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl",
				children: "Lattice mesh"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-xl text-sm leading-relaxed text-muted",
				children: "Talk to four entangled desks, fire a HotStuff + shadow round, rewrite qudit ZX, or recover a CSS error with BP-OSD — all in this browser."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-2 text-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/mesh",
						className: "rounded-[var(--radius-sm)] bg-surface-2 px-3 py-2 text-fg",
						children: "Open mesh chat"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/zx",
						className: "rounded-[var(--radius-sm)] px-3 py-2 text-muted hover:text-fg",
						children: "ZX kernel"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/decoder",
						className: "rounded-[var(--radius-sm)] px-3 py-2 text-muted hover:text-fg",
						children: "BP-OSD"
					})
				]
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 xl:grid-cols-[minmax(0,340px)_minmax(0,1fr)_minmax(0,360px)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlPanel, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QubitLattice, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HotStuffCluster, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Correlators, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FidelityChart, {})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CertificatePanel, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventLog, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshChat, { compact: true })
				]
			})
		]
	})] });
}
//#endregion
export { Home as component };
