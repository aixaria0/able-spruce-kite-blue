import { createFileRoute } from "@tanstack/react-router";
import { MeshChat } from "@/components/mesh-chat";
import { Shell } from "@/components/shell";

export const Route = createFileRoute("/mesh")({ component: MeshPage });

function MeshPage() {
  return (
    <Shell>
      <section className="mb-6 max-w-2xl">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Entangled desks</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Mesh</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          One conversation, four skills: the 12-qubit collective, the ZX/Lean formalist, the BP-OSD
          decoder, and the Hoare clerk. Memory stays on this device. Commands run in the browser;
          open language goes through the lattice model when it is available.
        </p>
      </section>
      <MeshChat />
    </Shell>
  );
}
