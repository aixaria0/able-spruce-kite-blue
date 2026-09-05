import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as createServerFn, r as getServerFnById, t as TSS_SERVER_FUNCTION } from "./ssr.mjs";
import { i as uid, n as localKernel, t as VOICES } from "./kernel-C__5Ai6K.mjs";
import { o as cn, t as Card } from "./card-BRo59eU1.mjs";
import { t as Button } from "./button-CvnqdzAH.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mesh-chat-gXE5UMyE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var askMesh = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("47b7e1b3197d381c406df18fcbdf61c6b24caaa40f8576c3537a099a2d0eb2a9"));
var KEY = "lattice.mesh.v1";
function persist(messages) {
	if (typeof window === "undefined") return;
	const slim = messages.slice(-40);
	window.localStorage.setItem(KEY, JSON.stringify(slim));
}
var useMesh = create((set, get) => ({
	voice: "collective",
	messages: [],
	pending: false,
	error: null,
	hydrate: () => {
		if (typeof window === "undefined") return;
		try {
			const raw = window.localStorage.getItem(KEY);
			if (!raw) return;
			const parsed = JSON.parse(raw);
			if (Array.isArray(parsed)) set({ messages: parsed.slice(-40) });
		} catch {}
	},
	setVoice: (voice) => set({ voice }),
	clear: () => {
		persist([]);
		set({
			messages: [],
			error: null
		});
	},
	send: async (raw) => {
		const text = raw.trim();
		if (!text || get().pending) return;
		const voice = get().voice;
		const user = {
			id: uid(),
			role: "user",
			voice,
			text,
			t: Date.now()
		};
		const messages = [...get().messages, user];
		set({
			messages,
			pending: true,
			error: null
		});
		persist(messages);
		const hit = localKernel(text, voice);
		if (hit.handled) {
			const reply = {
				id: uid(),
				role: "mesh",
				voice,
				text: hit.text,
				t: Date.now(),
				local: true
			};
			const next = [...messages, reply];
			persist(next);
			set({
				messages: next,
				pending: false
			});
			return;
		}
		const history = messages.filter((m) => m.role === "user" || m.role === "mesh").slice(-12).map((m) => ({
			role: m.role === "user" ? "user" : "assistant",
			content: m.text
		}));
		try {
			const res = await askMesh({ data: {
				voice,
				messages: history,
				context: hit.context
			} });
			if (res.ok) {
				const reply = {
					id: uid(),
					role: "mesh",
					voice,
					text: res.text,
					t: Date.now()
				};
				const next = [...messages, reply];
				persist(next);
				set({
					messages: next,
					pending: false
				});
				return;
			}
			const fallback = localKernel("/help", voice);
			const textOut = fallback.handled ? `${fallback.text}\n\n(Language model offline — local engines still answer /decode, /zx, /ghz.)` : "Language model offline. Use /decode, /zx, or /help.";
			const reply = {
				id: uid(),
				role: "mesh",
				voice,
				text: textOut,
				t: Date.now(),
				local: true
			};
			const next = [...messages, reply];
			persist(next);
			set({
				messages: next,
				pending: false,
				error: res.error
			});
		} catch {
			const reply = {
				id: uid(),
				role: "mesh",
				voice,
				text: "Channel dropped. Local engines: /decode, /zx, /help.",
				t: Date.now(),
				local: true
			};
			const next = [...messages, reply];
			persist(next);
			set({
				messages: next,
				pending: false,
				error: "network"
			});
		}
	}
}));
function MeshChat({ compact = false }) {
	const { voice, messages, pending, setVoice, send, hydrate, clear } = useMesh();
	const [draft, setDraft] = (0, import_react.useState)("");
	const scroller = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		hydrate();
	}, [hydrate]);
	(0, import_react.useEffect)(() => {
		scroller.current?.scrollTo({
			top: scroller.current.scrollHeight,
			behavior: "smooth"
		});
	}, [messages, pending]);
	function onSubmit(e) {
		e.preventDefault();
		const t = draft;
		setDraft("");
		send(t);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: cn("flex flex-col p-0", compact ? "h-[420px]" : "h-[min(70dvh,720px)]"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2 border-b border-border px-3 py-2",
				children: [VOICES.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setVoice(v.id),
					className: cn("h-9 rounded-[var(--radius-sm)] px-3 text-xs", voice === v.id ? "bg-fg text-bg" : "text-muted hover:bg-surface-2 hover:text-fg"),
					children: v.label
				}, v.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: clear,
					className: "ml-auto h-9 px-2 text-xs text-muted hover:text-fg",
					children: "Clear"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: scroller,
				className: "min-h-0 flex-1 overflow-y-auto px-3 py-3",
				children: [messages.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm leading-relaxed text-muted",
					children: [
						"Four entangled desks share one memory. Type in English or Persian. Local engines answer",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-fg",
							children: "/decode"
						}),
						", ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-fg",
							children: "/zx"
						}),
						",",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-fg",
							children: "/ghz"
						}),
						", ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-fg",
							children: "/help"
						}),
						" even when the language model is offline."
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "flex flex-col gap-3",
					children: [messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: cn("max-w-[92%] rounded-[var(--radius-md)] px-3 py-2 text-sm leading-relaxed", m.role === "user" ? "self-end bg-fg text-bg" : "self-start bg-surface-2 text-fg shadow-[var(--shadow-border)]"),
						children: [m.role === "mesh" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mb-1 text-[10px] uppercase tracking-[0.14em] text-muted",
							children: [VOICES.find((v) => v.id === m.voice)?.label, m.local ? " · local" : ""]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
							className: "font-sans whitespace-pre-wrap",
							children: m.text
						})]
					}, m.id)), pending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-xs text-muted",
						children: "Mesh is writing…"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "flex gap-2 border-t border-border p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: draft,
					onChange: (e) => setDraft(e.target.value),
					placeholder: "Talk to the mesh…",
					className: "h-11 min-w-0 flex-1 rounded-[var(--radius-sm)] bg-surface-2 px-3 text-sm text-fg shadow-[var(--shadow-border)] placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: pending || !draft.trim(),
					children: "Send"
				})]
			})
		]
	});
}
//#endregion
export { MeshChat as t };
