import type { Node, Edge } from "@xyflow/react";

import { ClusterOptions, LayoutResult } from "../../../utils/types";

export function layoutClustered(
  nodes: Node[],
  edges: Edge[],
  opts: ClusterOptions = {}
): LayoutResult {
  const { getGroupId = (n: Node) => (n.data as any)?.sectionId, padding = 24 } =
    opts;

  // Collect groups
  const groups = new Map<string, Node[]>();
  nodes.forEach((n) => {
    const gid = getGroupId(n);
    if (!gid) return;
    const arr = groups.get(gid) ?? [];
    arr.push(n);
    groups.set(gid, arr);
  });

  // Background nodes as overlays
  const overlays: Node[] = [];
  for (const [gid, groupNodes] of groups.entries()) {
    // Bounding box from child positions/sizes
    const xs = groupNodes.map((n) => n.position?.x ?? 0);
    const ys = groupNodes.map((n) => n.position?.y ?? 0);

    const minX = Math.min(...xs) - padding;
    const minY = Math.min(...ys) - padding;
    const maxX = Math.max(...xs) + padding;
    const maxY = Math.max(...ys) + padding;

    overlays.push({
      id: `cluster-${gid}`,
      position: { x: minX, y: minY },
      data: { label: gid },
      style: {
        width: Math.max(100, maxX - minX),
        height: Math.max(60, maxY - minY),
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
      },
      selectable: false,
      draggable: false,
      pannable: false as any,
      zIndex: 0,
    } as any);
  }

  return { nodes, edges, overlays };
}
