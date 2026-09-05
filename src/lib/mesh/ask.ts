import { createServerFn } from "@tanstack/react-start";
import { systemPrompt, type Voice } from "./kernel";

type Msg = { role: "user" | "assistant"; content: string };

export const askMesh = createServerFn({ method: "POST" })
  .validator((input: { voice: Voice; messages: Msg[]; context?: string }) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const, error: "offline" };

    const messages = [
      {
        role: "system",
        content:
          systemPrompt(data.voice) + (data.context ? `\n\nEngine context:\n${data.context}` : ""),
      },
      ...data.messages.slice(-12),
    ];

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 700,
        temperature: 0.7,
        messages,
      }),
    });

    if (!res.ok) {
      return { ok: false as const, error: `xAI ${res.status}` };
    }
    const body = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = body.choices?.[0]?.message?.content?.trim() ?? "";
    if (!text) return { ok: false as const, error: "empty" };
    return { ok: true as const, text };
  });
