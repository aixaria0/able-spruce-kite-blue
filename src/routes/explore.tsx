import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { Card, CardHeader, CardTitle, CardHint } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  bicycleCode,
  colorCode,
  distillT,
  hypergraphProduct,
  mpsSpectrum,
  surfaceCode,
} from "@/lib/qec";
import { formatFixed } from "@/lib/utils";

export const Route = createFileRoute("/explore")({ component: Explore });

function Explore() {
  return (
    <Shell>
      <section className="mb-6 max-w-2xl">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Codes & compression</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Logical layer
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          qLDPC constructions, 15-to-1 magic-state distillation, and MPS bond-dimension
          behaviour — plus the live BP-OSD and ZX kernels on their own desks.
        </p>
      </section>
      <Tabs defaultValue="qldpc">
        <TabsList className="mb-5">
          <TabsTrigger value="qldpc">qLDPC</TabsTrigger>
          <TabsTrigger value="magic">Magic states</TabsTrigger>
          <TabsTrigger value="mps">MPS</TabsTrigger>
        </TabsList>
        <TabsContent value="qldpc">
          <QldpcPanel />
        </TabsContent>
        <TabsContent value="magic">
          <MagicPanel />
        </TabsContent>
        <TabsContent value="mps">
          <MpsPanel />
        </TabsContent>
      </Tabs>
    </Shell>
  );
}

function QldpcPanel() {
  const [d, setD] = useState(5);
  const [a, setA] = useState(6);
  const [b, setB] = useState(4);
  const codes = useMemo(
    () => [surfaceCode(d), colorCode(d), hypergraphProduct(a, b), bicycleCode()],
    [d, a, b],
  );

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <Card className="p-5">
        <CardHeader>
          <div>
            <CardTitle>Parameters</CardTitle>
            <CardHint className="mt-1">Distance and classical-code sizes</CardHint>
          </div>
        </CardHeader>
        <div className="flex flex-col gap-5">
          <div>
            <div className="flex justify-between">
              <Label>Surface / color distance</Label>
              <span className="font-mono text-sm tabular-nums">{d}</span>
            </div>
            <Slider min={3} max={13} step={2} value={[d]} onValueChange={([v]) => setD(v)} />
          </div>
          <div>
            <div className="flex justify-between">
              <Label>HGP classical n₁</Label>
              <span className="font-mono text-sm tabular-nums">{a}</span>
            </div>
            <Slider min={3} max={12} step={1} value={[a]} onValueChange={([v]) => setA(v)} />
          </div>
          <div>
            <div className="flex justify-between">
              <Label>HGP classical n₂</Label>
              <span className="font-mono text-sm tabular-nums">{b}</span>
            </div>
            <Slider min={2} max={10} step={1} value={[b]} onValueChange={([v]) => setB(v)} />
          </div>
          <TannerSketch a={a} b={b} />
        </div>
      </Card>
      <div className="grid gap-3 sm:grid-cols-2">
        {codes.map((c) => (
          <Card key={c.id} className="p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display text-sm font-semibold">{c.name}</h3>
              <Badge>{c.hardware}</Badge>
            </div>
            <p className="mt-2 font-mono text-lg tabular-nums text-fg">{c.params}</p>
            <dl className="mt-3 grid grid-cols-3 gap-2 font-mono text-[11px] text-muted">
              <div>
                <dt>n</dt>
                <dd className="text-fg">{c.n}</dd>
              </div>
              <div>
                <dt>k</dt>
                <dd className="text-fg">{c.k}</dd>
              </div>
              <div>
                <dt>rate</dt>
                <dd className="text-fg">{formatFixed(c.rate, 3)}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs leading-relaxed text-muted">{c.notes}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TannerSketch({ a, b }: { a: number; b: number }) {
  const vars = Math.min(8, a);
  const checks = Math.min(6, b);
  return (
    <div>
      <Label>Tanner fragment</Label>
      <svg viewBox="0 0 280 90" className="mt-2 h-24 w-full" aria-hidden="true">
        {Array.from({ length: vars }).map((_, i) => {
          const x = 16 + (i * 248) / Math.max(1, vars - 1);
          return <circle key={`v${i}`} cx={x} cy={22} r="5" fill="var(--color-fg)" />;
        })}
        {Array.from({ length: checks }).map((_, j) => {
          const x = 28 + (j * 224) / Math.max(1, checks - 1);
          return (
            <g key={`c${j}`}>
              <rect x={x - 6} y={58} width="12" height="12" fill="var(--color-accent)" />
              <line
                x1={16 + (((j * 2) % vars) * 248) / Math.max(1, vars - 1)}
                y1={22}
                x2={x}
                y2={64}
                stroke="var(--color-border-strong)"
                strokeWidth="0.8"
              />
              <line
                x1={16 + ((((j * 2 + 1) % vars) * 248) / Math.max(1, vars - 1))}
                y1={22}
                x2={x}
                y2={64}
                stroke="var(--color-border-strong)"
                strokeWidth="0.8"
              />
            </g>
          );
        })}
      </svg>
      <p className="text-[11px] text-subtle">Circles: qubits · squares: parity checks</p>
    </div>
  );
}

function MagicPanel() {
  const [p, setP] = useState(0.02);
  const d = distillT(p);
  const barIn = Math.min(100, d.pIn * 400);
  const barOut = Math.min(100, d.pOut * 4000);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="p-5">
        <CardHeader>
          <div>
            <CardTitle>15-to-1 Bravyi–Kitaev</CardTitle>
            <CardHint className="mt-1">One cleaner T from fifteen noisy copies</CardHint>
          </div>
        </CardHeader>
        <div>
          <div className="flex justify-between">
            <Label>Input infidelity p</Label>
            <span className="font-mono text-sm tabular-nums">{formatFixed(p, 4)}</span>
          </div>
          <Slider min={0.001} max={0.08} step={0.001} value={[p]} onValueChange={([v]) => setP(v)} />
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-[var(--radius-md)] bg-surface-2 p-3">
            <div className="text-[11px] uppercase tracking-[0.14em] text-muted">p in</div>
            <div className="mt-1 font-mono text-xl tabular-nums">{formatFixed(d.pIn, 4)}</div>
            <div className="mt-2 h-1 rounded-full bg-bg">
              <div className="h-full rounded-full bg-warn" style={{ width: `${barIn}%` }} />
            </div>
          </div>
          <div className="rounded-[var(--radius-md)] bg-surface-2 p-3">
            <div className="text-[11px] uppercase tracking-[0.14em] text-muted">p out ≈ 35 p³</div>
            <div className="mt-1 font-mono text-xl tabular-nums">{d.pOut.toExponential(2)}</div>
            <div className="mt-2 h-1 rounded-full bg-bg">
              <div className="h-full rounded-full bg-ok" style={{ width: `${barOut}%` }} />
            </div>
          </div>
        </div>
        <dl className="mt-4 grid grid-cols-3 gap-3 font-mono text-xs text-muted">
          <div>
            <dt>Yield</dt>
            <dd className="text-fg">1/15</dd>
          </div>
          <div>
            <dt>Rounds to 10⁻⁶</dt>
            <dd className="text-fg">{d.roundsTo1e6}</dd>
          </div>
          <div>
            <dt>Rounds to 10⁻¹²</dt>
            <dd className="text-fg">{d.roundsTo1e12}</dd>
          </div>
        </dl>
      </Card>
      <Card className="p-5">
        <CardHeader>
          <div>
            <CardTitle>Why it matters here</CardTitle>
            <CardHint className="mt-1">Non-Clifford fuel for a logical certificate</CardHint>
          </div>
        </CardHeader>
        <p className="text-sm leading-relaxed text-muted">
          Surface and qLDPC codes give cheap Clifford gates. A QuantumHoare post-condition that
          mentions a T gate needs distilled magic states. Each distillation round cubes the error
          and spends fifteen physical T injections — the classical BFT layer can treat the output
          infidelity as the statistical slack in the Hoare bound.
        </p>
        <ul className="mt-4 space-y-2 text-sm text-muted">
          <li>Transversal Cliffords stay in the code space.</li>
          <li>T is injected via a noisy magic state, then distilled.</li>
          <li>A HybridCert can carry both the logical syndrome and p_out.</li>
        </ul>
      </Card>
    </div>
  );
}

function MpsPanel() {
  const [n, setN] = useState(6);
  const [kind, setKind] = useState<"ghz" | "product" | "volume">("ghz");
  const spec = mpsSpectrum(kind, n);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
      <Card className="p-5">
        <CardHeader>
          <div>
            <CardTitle>Variational compression</CardTitle>
            <CardHint className="mt-1">Schmidt rank across each cut</CardHint>
          </div>
        </CardHeader>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-1 rounded-[var(--radius-md)] bg-surface-2 p-1">
            {(["ghz", "product", "volume"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKind(k)}
                className={`h-9 rounded-[var(--radius-sm)] text-xs font-medium ${
                  kind === k ? "bg-surface text-fg shadow-[var(--shadow-border)]" : "text-muted"
                }`}
              >
                {k === "ghz" ? "GHZ" : k === "product" ? "Product" : "Volume-law"}
              </button>
            ))}
          </div>
          <div>
            <div className="flex justify-between">
              <Label>Sites</Label>
              <span className="font-mono text-sm tabular-nums">{n}</span>
            </div>
            <Slider min={4} max={10} step={1} value={[n]} onValueChange={([v]) => setN(v)} />
          </div>
          <p className="text-sm leading-relaxed text-muted">
            Sweep one tensor at a time in mixed canonical form. Two-site updates avoid local
            minima; SVD truncation is cheaper but looser at the same χ. GHZ stays exact at χ = 2.
            Volume-law states demand χ ~ 2^{n/2}.
          </p>
        </div>
      </Card>
      <Card className="p-5">
        <CardHeader>
          <div>
            <CardTitle>Bond spectrum</CardTitle>
            <CardHint className="mt-1">χ and discarded weight per cut</CardHint>
          </div>
        </CardHeader>
        <div className="flex items-end gap-2" style={{ height: 180 }}>
          {spec.map((p) => (
            <div key={p.cut} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-sm bg-accent"
                style={{ height: `${Math.max(8, (p.chi / 16) * 140)}px`, opacity: 0.35 + 0.65 * (1 - p.discarded) }}
              />
              <span className="font-mono text-[10px] text-muted">c{p.cut}</span>
              <span className="font-mono text-[10px] tabular-nums text-fg">χ {p.chi}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
