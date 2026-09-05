import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Control" },
  { to: "/mesh", label: "Mesh" },
  { to: "/zx", label: "ZX" },
  { to: "/decoder", label: "Decoder" },
  { to: "/explore", label: "Codes" },
  { to: "/ledger", label: "Ledger" },
];

export function Shell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-20 border-b border-border bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="flex min-h-11 items-baseline gap-3">
            <span className="font-display text-lg font-semibold tracking-[0.18em] text-fg">
              LATTICE
            </span>
            <span className="hidden text-[11px] uppercase tracking-[0.16em] text-muted lg:inline">
              Entangled mesh
            </span>
          </Link>
          <nav className="flex items-center gap-0.5 overflow-x-auto">
            {NAV.map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "inline-flex h-11 shrink-0 items-center rounded-[var(--radius-sm)] px-2.5 text-sm transition-colors sm:px-3",
                    active ? "bg-surface-2 text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">{children}</div>
    </div>
  );
}
