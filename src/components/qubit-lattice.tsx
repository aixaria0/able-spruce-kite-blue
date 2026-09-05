import { useEngine } from "@/lib/store";
import { Card, CardHeader, CardTitle, CardHint } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function QubitLattice() {
  const { config, running, shadow, phaseLabel } = useEngine();
  const n = config.nQubits;
  const entangled = config.target !== "product";

  return (
    <Card className="p-5">
      <CardHeader>
        <div>
          <CardTitle>Register</CardTitle>
          <CardHint className="mt-1">
            {config.target === "product"
              ? `Product |0⟩^${n}`
              : n === 2
                ? "Bell |Φ+⟩  ·  CX 0→1"
                : `GHZ-${n}  ·  H + linear CX`}
          </CardHint>
        </div>
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted">{phaseLabel}</span>
      </CardHeader>
      <div className="relative flex h-36 items-center justify-center sm:h-40">
        <svg viewBox="0 0 320 120" className="h-full w-full" aria-hidden="true">
          {Array.from({ length: n - 1 }).map((_, i) => {
            const x1 = 28 + (i * 264) / Math.max(1, n - 1);
            const x2 = 28 + ((i + 1) * 264) / Math.max(1, n - 1);
            return (
              <line
                key={i}
                x1={x1}
                y1={60}
                x2={x2}
                y2={60}
                stroke={entangled ? "var(--color-accent)" : "var(--color-subtle)"}
                strokeWidth={entangled ? 1.6 : 0.8}
                strokeDasharray={entangled ? "0" : "4 4"}
                opacity={entangled ? 0.85 : 0.4}
              />
            );
          })}
          {running && entangled ? (
            <circle r="3.5" fill="var(--color-fg)">
              <animateMotion dur="1.6s" repeatCount="indefinite" path={`M 28 60 L ${28 + 264} 60`} />
            </circle>
          ) : null}
          {Array.from({ length: n }).map((_, i) => {
            const x = 28 + (i * 264) / Math.max(1, n - 1);
            return (
              <g key={i}>
                <circle
                  cx={x}
                  cy={60}
                  r={running ? 13 : 11}
                  fill="var(--color-surface-2)"
                  stroke="var(--color-fg)"
                  strokeWidth="1.2"
                  className={cn(running && "origin-center")}
                />
                <text
                  x={x}
                  y={64}
                  textAnchor="middle"
                  fill="var(--color-fg)"
                  fontSize="10"
                  fontFamily="var(--font-mono)"
                >
                  {i}
                </text>
                <text
                  x={x}
                  y={96}
                  textAnchor="middle"
                  fill="var(--color-muted)"
                  fontSize="9"
                  fontFamily="var(--font-mono)"
                >
                  q{i}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      {shadow ? (
        <p className="mt-1 font-mono text-[11px] text-muted">
          {shadow.shots} snapshots
          {shadow.usedMps ? ` · MPS χ=${shadow.bondDim}` : " · dense Pauli inverse channel"}
        </p>
      ) : (
        <p className="mt-1 text-xs text-subtle">Launch a round to sample classical shadows.</p>
      )}
    </Card>
  );
}
