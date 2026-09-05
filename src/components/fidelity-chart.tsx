import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardHeader, CardTitle, CardHint } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEngine } from "@/lib/store";

export function FidelityChart() {
  const { history, running, progress } = useEngine();
  const data = history.map((h, i) => ({
    i: i + 1,
    F: Number(h.fidelity.toFixed(3)),
    W: Number(h.witness.toFixed(3)),
  }));

  return (
    <Card className="p-5">
      <CardHeader>
        <div>
          <CardTitle>Round history</CardTitle>
          <CardHint className="mt-1">Shadow fidelity across accepted and rejected certs</CardHint>
        </div>
      </CardHeader>
      {running ? <Progress value={progress} className="mb-4" /> : null}
      {data.length === 0 ? (
        <p className="py-8 text-sm text-muted">History fills as you run rounds.</p>
      ) : (
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid stroke="color-mix(in oklab, var(--color-fg) 8%, transparent)" vertical={false} />
              <XAxis dataKey="i" tick={{ fill: "var(--color-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 1]} tick={{ fill: "var(--color-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "var(--color-surface)",
                  border: "1px solid color-mix(in oklab, var(--color-fg) 12%, transparent)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Area type="monotone" dataKey="F" stroke="var(--color-accent)" fill="color-mix(in oklab, var(--color-accent) 18%, transparent)" strokeWidth={1.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
