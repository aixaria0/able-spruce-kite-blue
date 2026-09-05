import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as Shell, c as shortHash, s as formatFixed, t as Card } from "./card-BRo59eU1.mjs";
import { t as Button } from "./button-CvnqdzAH.mjs";
import { t as Badge } from "./badge-w2OIYh69.mjs";
import { n as useEngine, t as certToJson } from "./store-CoW4u97h.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ledger-CdoVi_cd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Ledger() {
	const { ledger, hydrate } = useEngine();
	(0, import_react.useEffect)(() => {
		hydrate();
	}, [hydrate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mb-6 max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] uppercase tracking-[0.18em] text-muted",
				children: "Immutable on this device"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl",
				children: "Certificate ledger"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed text-muted",
				children: "HybridCerts stay in local storage. Copy any JSON payload — program hash, shadow statistics, and the HotStuff binding."
			})
		]
	}), ledger.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "p-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Empty. Run a round on the control plane to mint the first certificate."
		})
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "flex flex-col gap-3",
		children: ledger.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "p-4 sm:p-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: c.accepted ? "ok" : "bad",
							children: c.accepted ? "ACCEPT" : "REJECT"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-xs text-muted",
							children: new Date(c.timestamp).toLocaleString()
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-fg",
						children: c.precondition
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								"F ",
								formatFixed(c.fidelity, 3),
								" ± ",
								formatFixed(c.fidelityError, 3)
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["W ", formatFixed(c.witness, 3)] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								c.nQubits,
								"q · ",
								c.shots,
								" shots"
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["view ", c.view] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: shortHash(c.binding, 14) })
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					size: "sm",
					onClick: () => void navigator.clipboard.writeText(certToJson(c)),
					children: "Copy JSON"
				})]
			})
		}) }, c.binding))
	})] });
}
//#endregion
export { Ledger as component };
