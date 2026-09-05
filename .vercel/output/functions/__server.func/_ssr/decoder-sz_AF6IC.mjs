import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as wt, i as runDemo, t as CATALOG } from "./bposd-CIybJcBT.mjs";
import { a as Shell, i as CardTitle, n as CardHeader, r as CardHint, t as Card } from "./card-BRo59eU1.mjs";
import { t as Button } from "./button-CvnqdzAH.mjs";
import { n as Slider, t as Label } from "./slider-Bf8PaV1O.mjs";
import { t as Badge } from "./badge-w2OIYh69.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/decoder-sz_AF6IC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DecoderPage() {
	const [id, setId] = (0, import_react.useState)(CATALOG[0].id);
	const [weight, setWeight] = (0, import_react.useState)(1);
	const [p, setP] = (0, import_react.useState)(.08);
	const [result, setResult] = (0, import_react.useState)(null);
	const code = (0, import_react.useMemo)(() => CATALOG.find((c) => c.id === id) ?? CATALOG[0], [id]);
	function run() {
		setResult(runDemo(code, weight, p, Date.now()));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mb-6 max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] uppercase tracking-[0.18em] text-muted",
				children: "qLDPC"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl",
				children: "BP-OSD decoder"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed text-muted",
				children: "Belief propagation on the Tanner graph of a CSS check matrix, then OSD-0 on the most reliable independent columns. Inject a Pauli-X error against Hz and watch recovery."
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Block" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHint, {
					className: "mt-1",
					children: code.notes
				})] }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-2",
					children: CATALOG.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setId(c.id),
						className: c.id === id ? "rounded-[var(--radius-sm)] bg-fg px-3 py-2 text-left text-sm text-bg" : "rounded-[var(--radius-sm)] px-3 py-2 text-left text-sm text-muted hover:bg-surface-2 hover:text-fg",
						children: [c.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mt-0.5 block text-xs opacity-70",
							children: ["n=", c.n]
						})]
					}, c.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Error weight" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-sm tabular-nums",
							children: weight
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						min: 0,
						max: Math.min(5, code.n),
						step: 1,
						value: [weight],
						onValueChange: ([v]) => setWeight(v)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Channel p" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-sm tabular-nums",
							children: p.toFixed(2)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						min: .01,
						max: .2,
						step: .01,
						value: [p],
						onValueChange: ([v]) => setP(v)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-5 w-full",
					onClick: run,
					children: "Inject and decode"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Result" }), result ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: result.ok ? "ok" : "bad",
						children: result.ok ? result.method : "fail"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "idle" })] }),
					!result ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "No shot yet. Inject a weight-1 error on the bicycle block first."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "grid grid-cols-2 gap-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-muted",
								children: "Injected wt"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-mono",
								children: result.injectedWt
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-muted",
								children: "Estimate wt"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-mono",
								children: wt(result.estimate)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-muted",
								children: "Residual"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-mono",
								children: result.residualWt
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-muted",
								children: "BP iters"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-mono",
								children: result.iterations
							})] })
						]
					}),
					result?.injected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 font-mono text-[11px] leading-relaxed text-muted break-all",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["e  ", result.injected.join("")] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["ê  ", result.estimate.join("")] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								"s  ",
								result.residual.join(""),
								" (Hê ⊕ syndrome)"
							] })
						]
					})
				]
			}), result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "BP residual" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-3 flex flex-col gap-1 font-mono text-xs text-muted",
					children: result.traces.map((tr) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						"iter ",
						tr.iter,
						" · residual ",
						tr.residual,
						tr.converged ? " · converged" : ""
					] }, tr.iter))
				})]
			})]
		})]
	})] });
}
//#endregion
export { DecoderPage as component };
