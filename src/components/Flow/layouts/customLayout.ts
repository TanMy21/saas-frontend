import { type Node, type Edge, Position } from "@xyflow/react";

import { BypassInterval, NodeData } from "../../../utils/types";

const HORIZONTAL_SPACING = 280;
const VERTICAL_SPACING = 200;

export function layoutNodesWithBypasses(nodes: Node[], edges: Edge[]): Node[] {
  const nodeById = new Map<string, Node>();
  const orderById = new Map<string, number>();
  const idByOrder = new Map<number, string>();

  // Index orders
  nodes.forEach((n) => {
    const order = (n.data as unknown as NodeData).order ?? 0;
    nodeById.set(n.id, n);
    orderById.set(n.id, order);
    idByOrder.set(order, n.id);
  });

  // Bypass intervals
  const intervals: BypassInterval[] = [];
  edges.forEach((e) => {
    if (e.type !== "bypass-edge") return;
    const s = orderById.get(e.source);
    const t = orderById.get(e.target);
    if (s == null || t == null) return;
    if (t - s <= 1) return; // no bypassing
    // normalize start < end
    const start = Math.min(s, t);
    const end = Math.max(s, t);
    intervals.push({ start, end });
  });

  //  Sweep-line events to compute overlap depth between orders
  //  Each interval contributes +1 from (start, end) for nodes strictly inside
  type Event = { pos: number; delta: number };
  const events: Event[] = [];
  for (const it of intervals) {
    // open just after start endpoints stay on base lane
    events.push({ pos: it.start + 0.5, delta: +1 });
    // close just before end
    events.push({ pos: it.end - 0.5, delta: -1 });
  }
  events.sort((a, b) => a.pos - b.pos || a.delta - b.delta);

  // Walk orders left→right
  const orders = [...idByOrder.keys()].sort((a, b) => a - b);

  let active = 0;
  let ei = 0;

  const levelById = new Map<string, number>();
  for (const ord of orders) {
    // apply events to whose position < (ord + 0.1)
    while (ei < events.length && events[ei].pos <= ord) {
      active += events[ei].delta;
      ei++;
    }
    const id = idByOrder.get(ord)!;
    levelById.set(id, Math.max(0, active)); // lane 0 base, 1..k lowered as needed
  }

  // Position nodes from their order (x) and computed lane (y)
  const layouted = nodes.map((node) => {
    const order = (node.data as unknown as NodeData).order ?? 0;
    const level = levelById.get(node.id) ?? 0;

    return {
      ...node,
      position: {
        x: order * HORIZONTAL_SPACING,
        y: level * VERTICAL_SPACING,
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    };
  });

  return layouted;
}
