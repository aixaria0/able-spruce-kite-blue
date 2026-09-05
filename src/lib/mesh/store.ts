import { create } from "zustand";
import { askMesh } from "./ask";
import { localKernel, uid, type MeshMessage, type Voice } from "./kernel";

const KEY = "lattice.mesh.v1";

type MeshState = {
  voice: Voice;
  messages: MeshMessage[];
  pending: boolean;
  error: string | null;
  hydrate: () => void;
  setVoice: (v: Voice) => void;
  send: (text: string) => Promise<void>;
  clear: () => void;
};

function persist(messages: MeshMessage[]) {
  if (typeof window === "undefined") return;
  const slim = messages.slice(-40);
  window.localStorage.setItem(KEY, JSON.stringify(slim));
}

export const useMesh = create<MeshState>((set, get) => ({
  voice: "collective",
  messages: [],
  pending: false,
  error: null,
  hydrate: () => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as MeshMessage[];
      if (Array.isArray(parsed)) set({ messages: parsed.slice(-40) });
    } catch {
      /* ignore */
    }
  },
  setVoice: (voice) => set({ voice }),
  clear: () => {
    persist([]);
    set({ messages: [], error: null });
  },
  send: async (raw) => {
    const text = raw.trim();
    if (!text || get().pending) return;
    const voice = get().voice;
    const user: MeshMessage = { id: uid(), role: "user", voice, text, t: Date.now() };
    const messages = [...get().messages, user];
    set({ messages, pending: true, error: null });
    persist(messages);

    const hit = localKernel(text, voice);
    if (hit.handled) {
      const reply: MeshMessage = {
        id: uid(),
        role: "mesh",
        voice,
        text: hit.text,
        t: Date.now(),
        local: true,
      };
      const next = [...messages, reply];
      persist(next);
      set({ messages: next, pending: false });
      return;
    }

    const history = messages
      .filter((m) => m.role === "user" || m.role === "mesh")
      .slice(-12)
      .map((m) => ({
        role: m.role === "user" ? ("user" as const) : ("assistant" as const),
        content: m.text,
      }));

    try {
      const res = await askMesh({ data: { voice, messages: history, context: hit.context } });
      if (res.ok) {
        const reply: MeshMessage = { id: uid(), role: "mesh", voice, text: res.text, t: Date.now() };
        const next = [...messages, reply];
        persist(next);
        set({ messages: next, pending: false });
        return;
      }
      const fallback = localKernel("/help", voice);
      const textOut =
        fallback.handled
          ? `${fallback.text}\n\n(Language model offline — local engines still answer /decode, /zx, /ghz.)`
          : "Language model offline. Use /decode, /zx, or /help.";
      const reply: MeshMessage = {
        id: uid(),
        role: "mesh",
        voice,
        text: textOut,
        t: Date.now(),
        local: true,
      };
      const next = [...messages, reply];
      persist(next);
      set({ messages: next, pending: false, error: res.error });
    } catch {
      const reply: MeshMessage = {
        id: uid(),
        role: "mesh",
        voice,
        text: "Channel dropped. Local engines: /decode, /zx, /help.",
        t: Date.now(),
        local: true,
      };
      const next = [...messages, reply];
      persist(next);
      set({ messages: next, pending: false, error: "network" });
    }
  },
}));
