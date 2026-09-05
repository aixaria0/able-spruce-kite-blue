import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { VOICES } from "@/lib/mesh/kernel";
import { useMesh } from "@/lib/mesh/store";

export function MeshChat({ compact = false }: { compact?: boolean }) {
  const { voice, messages, pending, setVoice, send, hydrate, clear } = useMesh();
  const [draft, setDraft] = useState("");
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const t = draft;
    setDraft("");
    void send(t);
  }

  return (
    <Card className={cn("flex flex-col p-0", compact ? "h-[420px]" : "h-[min(70dvh,720px)]")}>
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2">
        {VOICES.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setVoice(v.id)}
            className={cn(
              "h-9 rounded-[var(--radius-sm)] px-3 text-xs",
              voice === v.id ? "bg-fg text-bg" : "text-muted hover:bg-surface-2 hover:text-fg",
            )}
          >
            {v.label}
          </button>
        ))}
        <button type="button" onClick={clear} className="ml-auto h-9 px-2 text-xs text-muted hover:text-fg">
          Clear
        </button>
      </div>
      <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
        {messages.length === 0 && (
          <p className="text-sm leading-relaxed text-muted">
            Four entangled desks share one memory. Type in English or Persian. Local engines answer{" "}
            <span className="font-mono text-fg">/decode</span>, <span className="font-mono text-fg">/zx</span>,{" "}
            <span className="font-mono text-fg">/ghz</span>, <span className="font-mono text-fg">/help</span> even
            when the language model is offline.
          </p>
        )}
        <ul className="flex flex-col gap-3">
          {messages.map((m) => (
            <li
              key={m.id}
              className={cn(
                "max-w-[92%] rounded-[var(--radius-md)] px-3 py-2 text-sm leading-relaxed",
                m.role === "user"
                  ? "self-end bg-fg text-bg"
                  : "self-start bg-surface-2 text-fg shadow-[var(--shadow-border)]",
              )}
            >
              {m.role === "mesh" && (
                <p className="mb-1 text-[10px] uppercase tracking-[0.14em] text-muted">
                  {VOICES.find((v) => v.id === m.voice)?.label}
                  {m.local ? " · local" : ""}
                </p>
              )}
              <pre className="font-sans whitespace-pre-wrap">{m.text}</pre>
            </li>
          ))}
          {pending && <li className="text-xs text-muted">Mesh is writing…</li>}
        </ul>
      </div>
      <form onSubmit={onSubmit} className="flex gap-2 border-t border-border p-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Talk to the mesh…"
          className="h-11 min-w-0 flex-1 rounded-[var(--radius-sm)] bg-surface-2 px-3 text-sm text-fg shadow-[var(--shadow-border)] placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
        />
        <Button type="submit" disabled={pending || !draft.trim()}>
          Send
        </Button>
      </form>
    </Card>
  );
}
