import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useEngine } from "@/lib/store";
import { cn } from "@/lib/utils";

export function EventLog() {
  const { log } = useEngine();
  const [live, setLive] = useState(false);
  useEffect(() => setLive(true), []);
  const lines = [...log].reverse().slice(0, 18);

  return (
    <Card className="p-5">
      <CardHeader className="mb-2">
        <CardTitle>Monitor</CardTitle>
      </CardHeader>
      <ol className="flex max-h-56 flex-col gap-1.5 overflow-auto pr-1">
        {lines.map((line, i) => (
          <li
            key={`${line.t}-${i}`}
            className={cn(
              "font-mono text-[11px] leading-relaxed",
              line.tone === "ok" && "text-ok",
              line.tone === "bad" && "text-bad",
              line.tone === "warn" && "text-warn",
              line.tone === "info" && "text-muted",
            )}
          >
            <span className="text-subtle">{live ? new Date(line.t).toLocaleTimeString() : "--:--:--"}</span>{" "}
            {line.text}
          </li>
        ))}
      </ol>
    </Card>
  );
}
