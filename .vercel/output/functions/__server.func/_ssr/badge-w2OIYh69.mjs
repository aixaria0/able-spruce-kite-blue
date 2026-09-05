import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { o as cn } from "./card-BRo59eU1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-w2OIYh69.js
var import_jsx_runtime = require_jsx_runtime();
function Badge({ className, tone = "muted", children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide", {
			muted: "text-muted bg-surface-2",
			ok: "text-ok bg-ok/15",
			bad: "text-bad bg-bad/15",
			warn: "text-warn bg-warn/15",
			accent: "text-accent-fg bg-accent"
		}[tone], className),
		children
	});
}
//#endregion
export { Badge as t };
