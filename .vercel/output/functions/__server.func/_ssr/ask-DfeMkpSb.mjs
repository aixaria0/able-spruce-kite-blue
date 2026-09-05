import { n as createServerFn, t as TSS_SERVER_FUNCTION } from "./ssr.mjs";
import { r as systemPrompt } from "./kernel-C__5Ai6K.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ask-DfeMkpSb.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var askMesh_createServerFn_handler = createServerRpc({
	id: "47b7e1b3197d381c406df18fcbdf61c6b24caaa40f8576c3537a099a2d0eb2a9",
	name: "askMesh",
	filename: "src/lib/mesh/ask.ts"
}, (opts) => askMesh.__executeServer(opts));
var askMesh = createServerFn({ method: "POST" }).validator((input) => input).handler(askMesh_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "offline"
	};
	const messages = [{
		role: "system",
		content: systemPrompt(data.voice) + (data.context ? `\n\nEngine context:\n${data.context}` : "")
	}, ...data.messages.slice(-12)];
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			max_tokens: 700,
			temperature: .7,
			messages
		})
	});
	if (!res.ok) return {
		ok: false,
		error: `xAI ${res.status}`
	};
	const text = (await res.json()).choices?.[0]?.message?.content?.trim() ?? "";
	if (!text) return {
		ok: false,
		error: "empty"
	};
	return {
		ok: true,
		text
	};
});
//#endregion
export { askMesh_createServerFn_handler };
