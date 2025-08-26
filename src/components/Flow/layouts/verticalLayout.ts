import { type Node, type Edge, Position } from "@xyflow/react";

import { LayoutResult, NodeData } from "../../../utils/types";

const COL_SPACING = 260; // horizontal gap between lanes (columns)
const ROW_SPACING = 180; // vertical gap between orders (rows)

export function layoutVertical(nodes: Node[], edges: Edge[]): LayoutResult {
  // Map order for each node
  const orderById = new Map<string, number>();
  const idByOrder = new Map<number, string>();
  nodes.forEach((n) => {
    const order = (n.data as unknown as NodeData).order ?? 0;
    orderById.set(n.id, order);
    idByOrder.set(order, n.id);
  });

  // Bypass intervals over order
  type Interval = { start: number; end: number };
  const intervals: Interval[] = [];
  for (const e of edges) {
    if (e.type !== "bypass-edge") continue;
    const s = orderById.get(e.source) ?? null;
    const t = orderById.get(e.target) ?? null;
    if (s == null || t == null) continue;
    if (Math.abs(t - s) <= 1) continue;
    const start = Math.min(s, t);
    const end = Math.max(s, t);
    intervals.push({ start, end });
  }

  // Sweep-line to get overlap depth per order -> column lane
  type Event = { pos: number; delta: number };
  const events: Event[] = [];
  intervals.forEach(({ start, end }) => {
    events.push({ pos: start + 0.5, delta: +1 });
    events.push({ pos: end - 0.5, delta: -1 });
  });
  events.sort((a, b) => a.pos - b.pos || a.delta - b.delta);

  const orders = [...idByOrder.keys()].sort((a, b) => a - b);
  let active = 0;
  let ei = 0;

  const laneById = new Map<string, number>();
  for (const ord of orders) {
    while (ei < events.length && events[ei].pos <= ord) {
      active += events[ei].delta;
      ei++;
    }
    const id = idByOrder.get(ord)!;
    laneById.set(id, Math.max(0, active));
  }

  // Position Nodes: y=order*rowSpacing, x=lane*colSpacing
  const laid = nodes.map((node) => {
    const row = (node.data as unknown as NodeData).order ?? 0;
    const col = laneById.get(node.id) ?? 0;
    return {
      ...node,
      position: { x: col * COL_SPACING, y: row * ROW_SPACING },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    };
  });

  return { nodes: laid, edges };
}
