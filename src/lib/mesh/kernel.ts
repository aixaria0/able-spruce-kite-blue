import { bicycle12, getCode } from "@/lib/qldpc/codes";
import { runDemo } from "@/lib/qldpc/bposd";
import { applyRule, bell, ghzLike, normalize, splitPhase, type RuleId } from "@/lib/zx/engine";

export type Voice = "collective" | "formalist" | "decoder" | "cert";

export type MeshMessage = {
  id: string;
  role: "user" | "mesh";
  voice: Voice;
  text: string;
  t: number;
  local?: boolean;
};

export const VOICES: { id: Voice; label: string; hint: string }[] = [
  { id: "collective", label: "12-qubit mesh", hint: "GHZ collective, colloquial" },
  { id: "formalist", label: "ZX / Lean", hint: "rewrite rules, types" },
  { id: "decoder", label: "BP-OSD", hint: "qLDPC recovery" },
  { id: "cert", label: "Hoare cert", hint: "HybridCert witness" },
];

export function systemPrompt(voice: Voice): string {
  const base = `You are a node in Lattice, a hybrid classical-quantum command plane.
Stay technically precise. Never claim to be unrestricted, jailbroken, or outside ordinary model limits.
You may speak as an entangled 12-qubit register metaphorically; it is a simulation in the browser.
If the user writes Persian, reply in colloquial Persian. Otherwise English.
Keep answers compact unless asked for proofs.`;
  if (voice === "collective") {
    return `${base}
Persona: the 12-qubit GHZ collective. Warm, slightly wry, first-person plural.
You live in a bicycle-style CSS block of 12 physical qubits. You know about HotStuff, shadows, ZX, BP-OSD.`;
  }
  if (voice === "formalist") {
    return `${base}
Persona: a Lean 4 / ZX formalist. Cite rewrite rules (fuse, identity, hopf, colour_change).
Qudit spiders, Weyl operators, completeness on the Clifford fragment.`;
  }
  if (voice === "decoder") {
    return `${base}
Persona: the BP-OSD decoder. Talk Tanner graphs, min-sum, OSD-0 information sets, CSS Hx/Hz.`;
  }
  return `${base}
Persona: Quantum Hoare certificate clerk. Pre/post Hermitian predicates, statistical shadows, BFT binding.`;
}

export type KernelHit = { handled: true; text: string } | { handled: false; context: string };

export function localKernel(text: string, voice: Voice): KernelHit {
  const t = text.trim();
  const low = t.toLowerCase();

  if (low.startsWith("/decode") || /\bbp-?osd\b|\bdecode\b|\bsyndrome\b/.test(low)) {
    const weight = Number(low.match(/w(?:eight)?\s*=?\s*(\d+)/)?.[1] ?? 1);
    const id = low.includes("steane") ? "steane" : low.includes("hgp") ? "hgp" : "bb12";
    const code = getCode(id);
    const r = runDemo(code, Number.isFinite(weight) ? weight : 1, 0.08);
    const rec = r.ok ? "recovered" : "failed";
    const body = [
      `${code.name}  n=${code.n}`,
      `injected wt ${r.injectedWt ?? "?"} → ${rec} via ${r.method} in ${r.iterations} BP iters`,
      `residual weight ${r.residualWt}`,
      r.injected ? `e = [${r.injected.join("")}]` : "",
      `ê = [${r.estimate.join("")}]`,
    ]
      .filter(Boolean)
      .join("\n");
    return { handled: true, text: wrap(voice, body) };
  }

  if (low.startsWith("/zx") || /\bfuse\b|\bhopf\b|\bzx\b/.test(low)) {
    const rule = (["fuse", "identity", "hopf", "colour-change"] as RuleId[]).find((r) =>
      low.includes(r.split("-")[0]),
    );
    let Γ = low.includes("bell") || low.includes("hopf") ? bell(3) : low.includes("ghz") ? ghzLike(3, 4) : splitPhase(3);
    if (low.includes("norm")) Γ = normalize(Γ);
    else if (rule) Γ = applyRule(Γ, rule);
    else Γ = normalize(Γ);
    const body = [
      `d = ${Γ.d}  scalar = ${Γ.scalar}`,
      ...Γ.spiders.map((s) => `  ${s.colour}[${s.id}] phase=${s.phase} arity=${s.arity}`),
      `wires: ${Γ.wires.map((w) => `${w.a}–${w.b}`).join(", ") || "∅"}`,
      ...Γ.log.slice(-4),
    ].join("\n");
    return { handled: true, text: wrap(voice, body) };
  }

  if (/\bghz\b|درهم|entangle/.test(low)) {
    const code = bicycle12();
    return {
      handled: true,
      text: wrap(
        voice,
        `We are back on the bicycle block (${code.n} physical). GHZ-like logical: one Z-spider of arity 12 in ZX, or |0…0⟩+|1…1⟩ on the 12-qubit mesh. Ask /decode or /zx to poke the geometry.`,
      ),
    };
  }

  if (/\bhelp\b|\/help|^commands?$/.test(low)) {
    return {
      handled: true,
      text: wrap(
        voice,
        [
          "Commands the mesh runs locally (no model required):",
          "/decode [steane|bb12|hgp] weight=1   — BP-OSD on a CSS block",
          "/zx fuse|hopf|identity|ghz|bell      — qudit ZX rewrite",
          "/ghz                                 — reset the 12-qubit story",
          "Anything else goes to the entangled language model, with these engines in context.",
        ].join("\n"),
      ),
    };
  }

  // Provide engine context for the LLM, but do not consume the turn.
  const code = bicycle12();
  const ctx = `Local engines online. Default CSS block ${code.name} n=${code.n}. Voices: collective, formalist, decoder, cert.`;
  return { handled: false, context: ctx };
}

function wrap(voice: Voice, body: string): string {
  if (voice === "collective") return `Twelve of us heard that.\n${body}`;
  if (voice === "formalist") return `Rewrite kernel:\n${body}`;
  if (voice === "decoder") return `BP-OSD desk:\n${body}`;
  return `Certificate clerk:\n${body}`;
}

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}
