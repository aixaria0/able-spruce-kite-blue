import { useEngine } from "@/lib/store";
import { Card, CardHeader, CardTitle, CardHint } from "@/components/ui/card";
import { formatFixed } from "@/lib/utils";

export function Correlators() {
  const { shadow } = useEngine();
  const entries = shadow ? Object.entries(shadow.correlators) : [];

  return (
    <Card className="p-5">
      <CardHeader>
        <div>
          <CardTitle>Pauli correlators</CardTitle>
          <CardHint className="mt-1">Inverse-channel snapshots · median-of-means</CardHint>
        </div>
      </CardHeader>
      {entries.length === 0 ? (
        <p className="text-sm text-muted">Correlators appear after a shadow round.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {entries.map(([key, est]) => {
            const mag = Math.max(-1, Math.min(1, est.value));
            const pct = ((mag + 1) / 2) * 100;
            return (
              <li key={key}>
                <div className="mb-1 flex items-baseline justify-between font-mono text-xs">
                  <span className="text-muted">{key}</span>
                  <span className="tabular-nums text-fg">
                    {formatFixed(est.value, 3)} ± {formatFixed(est.error, 3)}
                  </span>
                </div>
                <div className="relative h-1.5 rounded-full bg-surface-2">
                  <div className="absolute inset-y-0 left-1/2 w-px bg-border-strong" />
                  <div
                    className="absolute top-0 h-full rounded-full bg-accent"
                    style={{
                      left: mag >= 0 ? "50%" : `${pct}%`,
                      width: `${Math.abs(mag) * 50}%`,
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
