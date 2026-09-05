import { useState } from "react";
import { Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardHint, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { parseIntent, PRESETS } from "@/lib/intent";
import { useEngine } from "@/lib/store";
import type { TargetKind } from "@/lib/quantum/statevector";
import { cn } from "@/lib/utils";

const TARGETS: { id: TargetKind; label: string }[] = [
  { id: "bell", label: "Bell" },
  { id: "ghz", label: "GHZ" },
  { id: "product", label: "Product" },
];

export function ControlPanel() {
  const { config, setConfig, launch, running, reset } = useEngine();
  const [cmd, setCmd] = useState("");
  const [hint, setHint] = useState("Try: “GHZ 4 qubits, heavy noise, run”");

  function applyCommand() {
    const parsed = parseIntent(cmd, config);
    setConfig(parsed.config);
    setHint(parsed.note);
    if (parsed.run) void launch();
  }

  return (
    <Card className="flex flex-col gap-4 p-5">
      <CardHeader className="mb-0">
        <div>
          <CardTitle>Directive</CardTitle>
          <CardHint className="mt-1">Local ion-trap noise. No cloud token.</CardHint>
        </div>
      </CardHeader>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          applyCommand();
        }}
        className="flex flex-col gap-2"
      >
        <Label htmlFor="cmd">Command</Label>
        <Input
          id="cmd"
          value={cmd}
          onChange={(e) => setCmd(e.target.value)}
          placeholder="entangle 4 qubits with light noise"
          autoComplete="off"
        />
        <p className="text-xs text-subtle">{hint}</p>
      </form>

      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setConfig(p.config)}
            className="h-9 rounded-full px-3 text-xs text-muted shadow-[var(--shadow-border)] transition-colors hover:text-fg"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div>
        <Label>Target</Label>
        <div className="mt-2 grid grid-cols-3 gap-1 rounded-[var(--radius-md)] bg-surface-2 p-1">
          {TARGETS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() =>
                setConfig({
                  target: t.id,
                  nQubits: t.id === "bell" ? 2 : Math.max(config.nQubits, t.id === "ghz" ? 3 : 2),
                })
              }
              className={cn(
                "h-9 rounded-[var(--radius-sm)] text-xs font-medium transition-colors",
                config.target === t.id ? "bg-surface text-fg shadow-[var(--shadow-border)]" : "text-muted",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label>Qubits</Label>
          <span className="font-mono text-sm tabular-nums text-fg">{config.nQubits}</span>
        </div>
        <Slider
          min={2}
          max={6}
          step={1}
          value={[config.nQubits]}
          onValueChange={([v]) =>
            setConfig({
              nQubits: v,
              target: v === 2 && config.target === "ghz" ? "bell" : v > 2 && config.target === "bell" ? "ghz" : config.target,
              useMps: v >= 6 ? true : config.useMps,
            })
          }
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label>Shots</Label>
          <span className="font-mono text-sm tabular-nums text-fg">{config.shots}</span>
        </div>
        <Slider
          min={64}
          max={800}
          step={32}
          value={[config.shots]}
          onValueChange={([v]) => setConfig({ shots: v })}
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label>Depolarizing p</Label>
          <span className="font-mono text-sm tabular-nums text-fg">{config.noise.toFixed(2)}</span>
        </div>
        <Slider
          min={0}
          max={0.5}
          step={0.01}
          value={[config.noise]}
          onValueChange={([v]) => setConfig({ noise: v })}
        />
      </div>

      <div className="flex items-center justify-between gap-3 py-1">
        <div>
          <Label>Byzantine replica</Label>
          <p className="mt-1 text-xs text-subtle">N3 withholds votes. Quorum still 3.</p>
        </div>
        <Switch
          checked={config.byzantine}
          onCheckedChange={(v) => setConfig({ byzantine: v })}
          aria-label="Byzantine replica"
        />
      </div>

      <div className="flex items-center justify-between gap-3 py-1">
        <div>
          <Label>MPS path</Label>
          <p className="mt-1 text-xs text-subtle">On at 6 qubits. Bond dimension 8.</p>
        </div>
        <Switch
          checked={config.useMps || config.nQubits >= 6}
          onCheckedChange={(v) => setConfig({ useMps: v })}
          aria-label="MPS path"
        />
      </div>

      <div className="mt-1 flex gap-2">
        <Button className="flex-1" onClick={() => void launch()} disabled={running}>
          <Play />
          {running ? "Running" : "Launch round"}
        </Button>
        <Button variant="secondary" size="icon" onClick={reset} aria-label="Reset" disabled={running}>
          <Square />
        </Button>
      </div>
    </Card>
  );
}
