import type { Node, Edge } from "@xyflow/react";

import { LayoutResult, NodeData } from "../../../utils/types";

import { layoutVertical } from "./verticalLayout";

export function layoutSwimlanes(nodes: Node[], edges: Edge[]): LayoutResult {
  // Base vertical placement
  const { nodes: baseNodes } = layoutVertical(nodes, edges);

  // Next  adjacency from custom-edge
  const nexts = new Map<string, string[]>();
  edges.forEach((e) => {
    if (e.type === "custom-edge") {
      const arr = nexts.get(e.source) ?? [];
      arr.push(e.target);
      nexts.set(e.source, arr);
    }
  });

  // Get current lane from base position
  const COL_SPACING = 260;
  const laneById = new Map<string, number>();
  baseNodes.forEach((n) => {
    const lane = Math.round((n.position?.x ?? 0) / COL_SPACING);
    laneById.set(n.id, lane);
  });

  // Topological order
  const ordered = [...baseNodes].sort(
    (a, b) =>
      ((a.data as unknown as NodeData).order ?? 0) -
      ((b.data as unknown as NodeData).order ?? 0)
  );

  for (const node of ordered) {
    const lane = laneById.get(node.id) ?? 0;
    for (const child of nexts.get(node.id) ?? []) {
      const childLane = laneById.get(child) ?? 0;
      laneById.set(child, Math.max(childLane, lane));
    }
  }

  // Reposition nodes
  const ROW_SPACING = 180;
  const laid = baseNodes.map((n) => {
    const row = (n.data as unknown as NodeData).order ?? 0;
    const lane = laneById.get(n.id) ?? 0;
    return {
      ...n,
      position: { x: lane * COL_SPACING, y: row * ROW_SPACING },
    };
  });

  return { nodes: laid, edges };
}
