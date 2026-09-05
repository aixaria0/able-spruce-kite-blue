import { useEngine } from "@/lib/store";
import { Card, CardHeader, CardTitle, CardHint } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const PHASES = ["prepare", "precommit", "commit", "decided"] as const;

export function HotStuffCluster() {
  const { bft } = useEngine();
  const positions = [
    { x: 50, y: 18 },
    { x: 82, y: 50 },
    { x: 50, y: 82 },
    { x: 18, y: 50 },
  ];

  const tone =
    bft.phase === "decided" ? "ok" : bft.phase === "view-change" ? "warn" : bft.phase === "idle" ? "muted" : "accent";

  return (
    <Card className="p-5">
      <CardHeader>
        <div>
          <CardTitle>HotStuff</CardTitle>
          <CardHint className="mt-1">
            View {bft.view || "—"} · leader N{bft.leader} · quorum 3/4
          </CardHint>
        </div>
        <Badge tone={tone}>{bft.phase}</Badge>
      </CardHeader>

      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_140px] sm:items-center">
        <svg viewBox="0 0 100 100" className="mx-auto h-44 w-44" aria-hidden="true">
          {positions.map((p, i) => {
            const q = positions[(i + 1) % 4];
            return (
              <line
                key={`e-${i}`}
                x1={p.x}
                y1={p.y}
                x2={q.x}
                y2={q.y}
                stroke="var(--color-border-strong)"
                strokeWidth="0.6"
              />
            );
          })}
          {bft.nodes.map((node, i) => {
            const p = positions[i];
            return (
              <g key={node.id}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={node.leader ? 11 : 9}
                  fill={node.decided ? "var(--color-ok)" : "var(--color-surface-2)"}
                  stroke={node.leader ? "var(--color-fg)" : node.byzantine ? "var(--color-bad)" : "var(--color-accent)"}
                  strokeWidth={node.leader ? 1.6 : 1}
                />
                <text
                  x={p.x}
                  y={p.y + 1.2}
                  textAnchor="middle"
                  fontSize="5.5"
                  fontFamily="var(--font-mono)"
                  fill={node.decided ? "var(--color-ok-fg)" : "var(--color-fg)"}
                >
                  {node.label}
                </text>
                {node.voted ? (
                  <circle cx={p.x + 8} cy={p.y - 8} r="1.6" fill="var(--color-accent)" />
                ) : null}
              </g>
            );
          })}
        </svg>

        <ol className="flex flex-row gap-2 sm:flex-col">
          {PHASES.map((ph) => {
            const active = bft.phase === ph || (ph === "decided" && bft.phase === "decided");
            const done =
              (ph === "prepare" && bft.prepareQc) ||
              (ph === "precommit" && bft.precommitQc) ||
              (ph === "commit" && bft.commitQc) ||
              (ph === "decided" && bft.decidedValue);
            return (
              <li
                key={ph}
                className={cn(
                  "flex-1 rounded-[var(--radius-sm)] px-2 py-2 text-[11px] uppercase tracking-wider",
                  active ? "bg-surface-2 text-fg" : done ? "text-ok" : "text-subtle",
                )}
              >
                {ph}
              </li>
            );
          })}
        </ol>
      </div>
    </Card>
  );
}
