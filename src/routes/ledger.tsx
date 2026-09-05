import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { certToJson } from "@/lib/cert/hoare";
import { useEngine } from "@/lib/store";
import { formatFixed, shortHash } from "@/lib/utils";

export const Route = createFileRoute("/ledger")({ component: Ledger });

function Ledger() {
  const { ledger, hydrate } = useEngine();
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <Shell>
      <section className="mb-6 max-w-2xl">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Immutable on this device</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Certificate ledger
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          HybridCerts stay in local storage. Copy any JSON payload — program hash, shadow
          statistics, and the HotStuff binding.
        </p>
      </section>

      {ledger.length === 0 ? (
        <Card className="p-8">
          <p className="text-sm text-muted">Empty. Run a round on the control plane to mint the first certificate.</p>
        </Card>
      ) : (
        <ul className="flex flex-col gap-3">
          {ledger.map((c) => (
            <li key={c.binding}>
              <Card className="p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge tone={c.accepted ? "ok" : "bad"}>{c.accepted ? "ACCEPT" : "REJECT"}</Badge>
                      <span className="font-mono text-xs text-muted">
                        {new Date(c.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-fg">{c.precondition}</p>
                    <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] text-muted">
                      <div>
                        F {formatFixed(c.fidelity, 3)} ± {formatFixed(c.fidelityError, 3)}
                      </div>
                      <div>W {formatFixed(c.witness, 3)}</div>
                      <div>
                        {c.nQubits}q · {c.shots} shots
                      </div>
                      <div>view {c.view}</div>
                      <div>{shortHash(c.binding, 14)}</div>
                    </dl>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => void navigator.clipboard.writeText(certToJson(c))}
                  >
                    Copy JSON
                  </Button>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </Shell>
  );
}
