import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardHint, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { CATALOG } from "@/lib/qldpc/codes";
import { runDemo, type DecodeResult } from "@/lib/qldpc/bposd";
import { wt } from "@/lib/qldpc/gf2";

export const Route = createFileRoute("/decoder")({ component: DecoderPage });

function DecoderPage() {
  const [id, setId] = useState(CATALOG[0].id);
  const [weight, setWeight] = useState(1);
  const [p, setP] = useState(0.08);
  const [result, setResult] = useState<DecodeResult | null>(null);
  const code = useMemo(() => CATALOG.find((c) => c.id === id) ?? CATALOG[0], [id]);

  function run() {
    setResult(runDemo(code, weight, p, Date.now()));
  }

  return (
    <Shell>
      <section className="mb-6 max-w-2xl">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted">qLDPC</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          BP-OSD decoder
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Belief propagation on the Tanner graph of a CSS check matrix, then OSD-0 on the most
          reliable independent columns. Inject a Pauli-X error against Hz and watch recovery.
        </p>
      </section>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
        <Card className="p-5">
          <CardHeader>
            <div>
              <CardTitle>Block</CardTitle>
              <CardHint className="mt-1">{code.notes}</CardHint>
            </div>
          </CardHeader>
          <div className="flex flex-col gap-2">
            {CATALOG.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setId(c.id)}
                className={
                  c.id === id
                    ? "rounded-[var(--radius-sm)] bg-fg px-3 py-2 text-left text-sm text-bg"
                    : "rounded-[var(--radius-sm)] px-3 py-2 text-left text-sm text-muted hover:bg-surface-2 hover:text-fg"
                }
              >
                {c.name}
                <span className="mt-0.5 block text-xs opacity-70">n={c.n}</span>
              </button>
            ))}
          </div>
          <div className="mt-5">
            <div className="flex justify-between">
              <Label>Error weight</Label>
              <span className="font-mono text-sm tabular-nums">{weight}</span>
            </div>
            <Slider min={0} max={Math.min(5, code.n)} step={1} value={[weight]} onValueChange={([v]) => setWeight(v)} />
          </div>
          <div className="mt-4">
            <div className="flex justify-between">
              <Label>Channel p</Label>
              <span className="font-mono text-sm tabular-nums">{p.toFixed(2)}</span>
            </div>
            <Slider min={0.01} max={0.2} step={0.01} value={[p]} onValueChange={([v]) => setP(v)} />
          </div>
          <Button className="mt-5 w-full" onClick={run}>
            Inject and decode
          </Button>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="p-5">
            <CardHeader>
              <CardTitle>Result</CardTitle>
              {result ? (
                <Badge tone={result.ok ? "ok" : "bad"}>{result.ok ? result.method : "fail"}</Badge>
              ) : (
                <Badge>idle</Badge>
              )}
            </CardHeader>
            {!result ? (
              <p className="text-sm text-muted">No shot yet. Inject a weight-1 error on the bicycle block first.</p>
            ) : (
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs text-muted">Injected wt</dt>
                  <dd className="font-mono">{result.injectedWt}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Estimate wt</dt>
                  <dd className="font-mono">{wt(result.estimate)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Residual</dt>
                  <dd className="font-mono">{result.residualWt}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">BP iters</dt>
                  <dd className="font-mono">{result.iterations}</dd>
                </div>
              </dl>
            )}
            {result?.injected && (
              <div className="mt-4 font-mono text-[11px] leading-relaxed text-muted break-all">
                <p>e  {result.injected.join("")}</p>
                <p>ê  {result.estimate.join("")}</p>
                <p>s  {result.residual.join("")} (Hê ⊕ syndrome)</p>
              </div>
            )}
          </Card>

          {result && (
            <Card className="p-5">
              <CardTitle>BP residual</CardTitle>
              <ol className="mt-3 flex flex-col gap-1 font-mono text-xs text-muted">
                {result.traces.map((tr) => (
                  <li key={tr.iter}>
                    iter {tr.iter} · residual {tr.residual}
                    {tr.converged ? " · converged" : ""}
                  </li>
                ))}
              </ol>
            </Card>
          )}
        </div>
      </div>
    </Shell>
  );
}
