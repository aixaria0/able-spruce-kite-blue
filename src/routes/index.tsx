import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { ControlPanel } from "@/components/control-panel";
import { QubitLattice } from "@/components/qubit-lattice";
import { HotStuffCluster } from "@/components/hotstuff-cluster";
import { Correlators } from "@/components/correlators";
import { CertificatePanel } from "@/components/certificate-panel";
import { EventLog } from "@/components/event-log";
import { FidelityChart } from "@/components/fidelity-chart";
import { MeshChat } from "@/components/mesh-chat";
import { useEngine } from "@/lib/store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const hydrate = useEngine((s) => s.hydrate);
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <Shell>
      <section className="mb-6 max-w-2xl">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Hybrid classical–quantum</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
          Lattice mesh
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Talk to four entangled desks, fire a HotStuff + shadow round, rewrite qudit ZX, or recover
          a CSS error with BP-OSD — all in this browser.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <Link to="/mesh" className="rounded-[var(--radius-sm)] bg-surface-2 px-3 py-2 text-fg">
            Open mesh chat
          </Link>
          <Link to="/zx" className="rounded-[var(--radius-sm)] px-3 py-2 text-muted hover:text-fg">
            ZX kernel
          </Link>
          <Link to="/decoder" className="rounded-[var(--radius-sm)] px-3 py-2 text-muted hover:text-fg">
            BP-OSD
          </Link>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,340px)_minmax(0,1fr)_minmax(0,360px)]">
        <ControlPanel />
        <div className="flex flex-col gap-4">
          <QubitLattice />
          <HotStuffCluster />
          <div className="grid gap-4 sm:grid-cols-2">
            <Correlators />
            <FidelityChart />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <CertificatePanel />
          <EventLog />
          <MeshChat compact />
        </div>
      </div>
    </Shell>
  );
}
