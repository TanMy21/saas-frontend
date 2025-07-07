import { type Node, type Edge, Position } from "@xyflow/react";

const X_SPACING = 280;
const Y_SPACING = 200;

export function layoutNodesWithBypasses(nodes: Node[], edges: Edge[]): Node[] {
  const nodeMap = new Map<string, Node>();
  const nodeOrderMap = new Map<number, Node>();

  nodes.forEach((node) => {
    const order = (node.data as any).order;
    nodeMap.set(node.id, node);
    nodeOrderMap.set(order, node);
  });

  const bypassTargetsBySource = new Map<string, Set<string>>();
  edges.forEach((edge) => {
    if (edge.type === "bypass-edge") {
      if (!bypassTargetsBySource.has(edge.source)) {
        bypassTargetsBySource.set(edge.source, new Set());
      }
      bypassTargetsBySource.get(edge.source)!.add(edge.target);
    }
  });

  // Track node levels
  const nodeLevels = new Map<string, number>();
  nodes.forEach((node) => nodeLevels.set(node.id, 0));

  // Push bypassed nodes down
  edges.forEach((edge) => {
    if (edge.type !== "bypass-edge") return;

    const source = nodeMap.get(edge.source);
    const target = nodeMap.get(edge.target);
    if (!source || !target) return;

    const sourceOrder = (source.data as any).order;
    const targetOrder = (target.data as any).order;

    for (let i = sourceOrder + 1; i < targetOrder; i++) {
      const skipped = nodeOrderMap.get(i);
      if (!skipped) continue;

      const currentLevel = nodeLevels.get(skipped.id) ?? 0;
      const newLevel = currentLevel + 1;
      nodeLevels.set(skipped.id, newLevel);
    }
  });

  // Final node positions
  const layoutedNodes = nodes.map((node) => {
    const order = (node.data as any).order;
    const level = nodeLevels.get(node.id) ?? 0;

    return {
      ...node,
      position: {
        x: order * X_SPACING,
        y: level * Y_SPACING,
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    };
  });

  return layoutedNodes;
}
