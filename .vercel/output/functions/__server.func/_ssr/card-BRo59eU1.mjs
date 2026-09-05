import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { d as useRouterState, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/card-BRo59eU1.js
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function formatFixed(n, digits = 4) {
	if (!Number.isFinite(n)) return "—";
	return n.toFixed(digits);
}
function shortHash(hex, n = 12) {
	if (hex.length <= n) return hex;
	return `${hex.slice(0, n)}…`;
}
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
var NAV = [
	{
		to: "/",
		label: "Control"
	},
	{
		to: "/mesh",
		label: "Mesh"
	},
	{
		to: "/zx",
		label: "ZX"
	},
	{
		to: "/decoder",
		label: "Decoder"
	},
	{
		to: "/explore",
		label: "Codes"
	},
	{
		to: "/ledger",
		label: "Ledger"
	}
];
function Shell({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "sticky top-0 z-20 border-b border-border bg-bg/85 backdrop-blur-md",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-4 py-3 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex min-h-11 items-baseline gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-lg font-semibold tracking-[0.18em] text-fg",
						children: "LATTICE"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden text-[11px] uppercase tracking-[0.16em] text-muted lg:inline",
						children: "Entangled mesh"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex items-center gap-0.5 overflow-x-auto",
					children: NAV.map((item) => {
						const active = pathname === item.to;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: item.to,
							className: cn("inline-flex h-11 shrink-0 items-center rounded-[var(--radius-sm)] px-2.5 text-sm transition-colors sm:px-3", active ? "bg-surface-2 text-fg" : "text-muted hover:text-fg"),
							children: item.label
						}, item.to);
					})
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8",
			children
		})]
	});
}
function Card({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("rounded-[var(--radius-xl)] bg-surface p-4 shadow-[var(--shadow-border)]", className),
		...props
	});
}
function CardHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("mb-3 flex items-start justify-between gap-3", className),
		...props
	});
}
function CardTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: cn("font-display text-sm font-semibold tracking-tight text-fg", className),
		...props
	});
}
function CardHint({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: cn("text-xs text-muted", className),
		...props
	});
}
//#endregion
export { Shell as a, shortHash as c, CardTitle as i, sleep as l, CardHeader as n, cn as o, CardHint as r, formatFixed as s, Card as t };
