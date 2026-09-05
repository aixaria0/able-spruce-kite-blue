export type Phase = "idle" | "prepare" | "precommit" | "commit" | "view-change" | "decided";

export type NodeState = {
  id: number;
  label: string;
  leader: boolean;
  voted: boolean;
  locked: boolean;
  decided: boolean;
  byzantine: boolean;
  lastVote: string | null;
};

export type QuorumCertificate = {
  view: number;
  phase: Phase;
  value: string;
  votes: number[];
};

export type BftSnapshot = {
  view: number;
  leader: number;
  phase: Phase;
  nodes: NodeState[];
  prepareQc: QuorumCertificate | null;
  precommitQc: QuorumCertificate | null;
  commitQc: QuorumCertificate | null;
  decidedValue: string | null;
  log: string[];
};

export type BftConfig = {
  n: number;
  byzantineId: number | null;
  failFirstView?: boolean;
};

export function quorumOf(n: number) {
  const f = Math.floor((n - 1) / 3);
  return 2 * f + 1;
}

export function makeCluster(cfg: BftConfig): BftSnapshot {
  const n = cfg.n;
  const nodes: NodeState[] = Array.from({ length: n }, (_, id) => ({
    id,
    label: `N${id}`,
    leader: id === 0,
    voted: false,
    locked: false,
    decided: false,
    byzantine: cfg.byzantineId === id,
    lastVote: null,
  }));
  return {
    view: 0,
    leader: 0,
    phase: "idle",
    nodes,
    prepareQc: null,
    precommitQc: null,
    commitQc: null,
    decidedValue: null,
    log: ["Cluster idle. Four replicas, f = 1, quorum = 3."],
  };
}

function collectVotes(nodes: NodeState[], view: number, value: string, byzantineId: number | null) {
  const votes: number[] = [];
  for (const node of nodes) {
    if (node.byzantine || node.id === byzantineId) {
      node.voted = false;
      node.lastVote = null;
      continue;
    }
    node.voted = true;
    node.lastVote = value;
    votes.push(node.id);
  }
  return votes;
}

export function stepPropose(state: BftSnapshot, value: string, cfg: BftConfig): BftSnapshot {
  const view = state.view + 1;
  const leader = view % cfg.n;
  const nodes = state.nodes.map((n) => ({
    ...n,
    leader: n.id === leader,
    voted: false,
    decided: false,
    lastVote: null,
  }));
  return {
    ...state,
    view,
    leader,
    phase: "prepare",
    nodes,
    prepareQc: null,
    precommitQc: null,
    commitQc: null,
    decidedValue: null,
    log: [
      ...state.log,
      `View ${view}: leader N${leader} proposes ${value.slice(0, 12)}…`,
    ],
  };
}

export function stepPrepare(state: BftSnapshot, value: string, cfg: BftConfig): BftSnapshot {
  const nodes = state.nodes.map((n) => ({ ...n }));
  const votes = collectVotes(nodes, state.view, value, cfg.byzantineId);
  const q = quorumOf(cfg.n);
  const ok = votes.length >= q && !cfg.failFirstView;
  const qc: QuorumCertificate | null = ok
    ? { view: state.view, phase: "prepare", value, votes }
    : null;
  return {
    ...state,
    nodes,
    phase: ok ? "precommit" : "view-change",
    prepareQc: qc,
    log: [
      ...state.log,
      ok
        ? `Prepare QC formed (${votes.length}/${cfg.n}).`
        : `Prepare failed (${votes.length}/${cfg.n}) — view change.`,
    ],
  };
}

export function stepPrecommit(state: BftSnapshot, value: string, cfg: BftConfig): BftSnapshot {
  const nodes = state.nodes.map((n) => ({
    ...n,
    locked: !n.byzantine,
  }));
  const votes = nodes.filter((n) => !n.byzantine).map((n) => n.id);
  const q = quorumOf(cfg.n);
  const ok = votes.length >= q;
  return {
    ...state,
    nodes,
    phase: ok ? "commit" : "view-change",
    precommitQc: ok ? { view: state.view, phase: "precommit", value, votes } : null,
    log: [
      ...state.log,
      ok
        ? `Pre-commit QC + lock (${votes.length}/${cfg.n}).`
        : `Pre-commit failed — view change.`,
    ],
  };
}

export function stepCommit(state: BftSnapshot, value: string, cfg: BftConfig): BftSnapshot {
  const nodes = state.nodes.map((n) => ({
    ...n,
    decided: !n.byzantine,
  }));
  const votes = nodes.filter((n) => !n.byzantine).map((n) => n.id);
  const q = quorumOf(cfg.n);
  const ok = votes.length >= q;
  return {
    ...state,
    nodes,
    phase: ok ? "decided" : "view-change",
    commitQc: ok ? { view: state.view, phase: "commit", value, votes } : null,
    decidedValue: ok ? value : null,
    log: [
      ...state.log,
      ok
        ? `COMMITTED in view ${state.view}.`
        : `Commit QC failed — view change.`,
    ],
  };
}

export function stepViewChange(state: BftSnapshot, cfg: BftConfig): BftSnapshot {
  const nodes = state.nodes.map((n) => ({
    ...n,
    voted: false,
    locked: false,
    decided: false,
    lastVote: null,
    leader: false,
  }));
  return {
    ...state,
    nodes,
    phase: "idle",
    log: [...state.log, `View-change from view ${state.view}. Rotating leader.`],
  };
}
