import { useState } from "react";
import { Check, Copy, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardHint } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { certToJson } from "@/lib/cert/hoare";
import { useEngine } from "@/lib/store";
import { formatFixed, shortHash } from "@/lib/utils";

export function CertificatePanel() {
  const { cert, shadow } = useEngine();
  const [copied, setCopied] = useState(false);

  async function copyJson() {
    if (!cert) return;
    try {
      await navigator.clipboard.writeText(certToJson(cert));
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Card className="flex h-full flex-col p-5">
      <CardHeader>
        <div>
          <CardTitle>QuantumHoareCert</CardTitle>
          <CardHint className="mt-1">Bound to the HotStuff digest</CardHint>
        </div>
        {cert ? (
          <Badge tone={cert.accepted ? "ok" : "bad"}>{cert.accepted ? "ACCEPT" : "REJECT"}</Badge>
        ) : (
          <Badge>idle</Badge>
        )}
      </CardHeader>

      {cert ? (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Fidelity" value={formatFixed(cert.fidelity, 3)} sub={`± ${formatFixed(cert.fidelityError, 3)}`} />
            <Stat label="Witness" value={formatFixed(cert.witness, 3)} sub={`± ${formatFixed(cert.witnessError, 3)}`} />
            <Stat label="True F" value={formatFixed(cert.trueFidelity, 3)} sub="depolarizing analytic" />
            <Stat label="Shots" value={String(cert.shots)} sub={`${cert.nQubits} qubits`} />
          </div>
          <dl className="mt-4 space-y-1.5 font-mono text-[11px] text-muted">
            <Row k="program" v={shortHash(cert.programHash, 16)} />
            <Row k="binding" v={shortHash(cert.binding, 16)} />
            <Row k="view" v={`${cert.view} · leader N${cert.leader}`} />
            <Row k="backend" v={cert.backend} />
          </dl>
          <Button variant="secondary" className="mt-4 w-full" onClick={() => void copyJson()}>
            {copied ? <Check /> : <Copy />}
            {copied ? "Copied" : "Copy JSON"}
          </Button>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-start justify-center gap-2 py-8 text-sm text-muted">
          <X className="size-4 text-subtle" />
          <p>No certificate yet. Launch a round to mint a HybridCert.</p>
          {shadow ? <p className="text-xs text-subtle">Shadows ready — waiting on BFT commit.</p> : null}
        </div>
      )}
    </Card>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-[var(--radius-md)] bg-surface-2 p-3">
      <div className="text-[11px] uppercase tracking-[0.14em] text-muted">{label}</div>
      <div className="mt-1 font-mono text-xl tabular-nums text-fg">{value}</div>
      <div className="text-[11px] text-subtle">{sub}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt>{k}</dt>
      <dd className="truncate text-fg">{v}</dd>
    </div>
  );
}
