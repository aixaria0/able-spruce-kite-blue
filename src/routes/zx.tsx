import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardHint, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QUDIT_ZX_LEAN } from "@/lib/zx/lean";
import {
  RULES,
  applyRule,
  bell,
  ghzLike,
  normalize,
  splitPhase,
  type Diagram,
  type RuleId,
} from "@/lib/zx/engine";

export const Route = createFileRoute("/zx")({ component: ZxPage });

function ZxPage() {
  const [Γ, setΓ] = useState<Diagram>(() => splitPhase(3));

  const spiders = Γ.spiders;

  return (
    <Shell>
      <section className="mb-6 max-w-2xl">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Qudit ZX</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Rewrite kernel
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Operational semantics of the Lean fragment: fusion, identity, Hopf, colour-change. Seed a
          diagram, fire a rule, watch the scalar and arities move.
        </p>
      </section>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="flex flex-col gap-4">
          <Card className="p-5">
            <CardHeader>
              <div>
                <CardTitle>Seeds</CardTitle>
                <CardHint className="mt-1">d = {Γ.d}</CardHint>
              </div>
              <Badge>{`scalar ${Γ.scalar}`}</Badge>
            </CardHeader>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={() => setΓ(splitPhase(3))}>
                Fuse pair
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setΓ(bell(3))}>
                Hopf pair
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setΓ(ghzLike(3, 4))}>
                GHZ spider
              </Button>
              <Button size="sm" variant="outline" onClick={() => setΓ(normalize(Γ))}>
                Saturate
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {RULES.map((r) => (
                <Button
                  key={r.id}
                  size="sm"
                  onClick={() => setΓ(applyRule(Γ, r.id as RuleId))}
                >
                  {r.name}
                </Button>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <CardTitle>Diagram</CardTitle>
            <ul className="mt-3 flex flex-col gap-2 font-mono text-sm">
              {spiders.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3">
                  <span>
                    <span className={s.colour === "Z" ? "text-ok" : "text-warn"}>{s.colour}</span>
                    [{s.id}]
                  </span>
                  <span className="text-muted">
                    phase {s.phase} · arity {s.arity}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted">
              wires {Γ.wires.length ? Γ.wires.map((w) => `${w.a}–${w.b}`).join("  ") : "none"}
            </p>
            <ol className="mt-4 flex flex-col gap-1 text-xs text-muted">
              {Γ.log.slice(-8).map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ol>
          </Card>

          <SpiderCanvas Γ={Γ} />
        </div>

        <Card className="p-0 overflow-hidden">
          <div className="border-b border-border px-5 py-3">
            <CardTitle>Lean 4 fragment</CardTitle>
            <CardHint className="mt-1">Axioms the engine implements</CardHint>
          </div>
          <pre className="max-h-[640px] overflow-auto p-5 font-mono text-[11px] leading-relaxed text-accent">
            {QUDIT_ZX_LEAN}
          </pre>
        </Card>
      </div>
    </Shell>
  );
}

function SpiderCanvas({ Γ }: { Γ: Diagram }) {
  const nodes = useMemo(() => {
    return Γ.spiders.map((s, i) => {
      const angle = (2 * Math.PI * i) / Math.max(1, Γ.spiders.length) - Math.PI / 2;
      return { ...s, x: 160 + 90 * Math.cos(angle), y: 110 + 70 * Math.sin(angle) };
    });
  }, [Γ.spiders]);

  return (
    <Card className="p-3">
      <svg viewBox="0 0 320 220" className="h-auto w-full text-fg" role="img" aria-label="ZX diagram">
        {Γ.wires.map((w, i) => {
          const a = nodes.find((n) => n.id === w.a);
          const b = nodes.find((n) => n.id === w.b);
          if (!a || !b) return null;
          const bow = i % 2 === 0 ? 0 : 16;
          return (
            <path
              key={`${w.a}${w.b}${i}`}
              d={`M ${a.x} ${a.y} Q ${(a.x + b.x) / 2} ${(a.y + b.y) / 2 - bow} ${b.x} ${b.y}`}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.35}
            />
          );
        })}
        {nodes.map((n) => (
          <g key={n.id}>
            <circle
              cx={n.x}
              cy={n.y}
              r={16}
              fill={n.colour === "Z" ? "#7d9a86" : "#b49a72"}
            />
            <text
              x={n.x}
              y={n.y + 4}
              textAnchor="middle"
              fontSize="10"
              fill="#0b0d10"
              fontFamily="IBM Plex Mono, monospace"
            >
              {n.phase}
            </text>
          </g>
        ))}
      </svg>
    </Card>
  );
}
