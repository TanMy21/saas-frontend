import type { Node, Edge } from "@xyflow/react";

import { ClusterOptions, LayoutMode, LayoutResult } from "../../../utils/types";

import { layoutClustered } from "./clusteredLayout";
import { layoutSugiyama } from "./sugiyamaLayout";
import { layoutSwimlanes } from "./swimLanesLayout";
import { layoutVertical } from "./verticalLayout";

export function applyLayout(
  mode: LayoutMode,
  nodes: Node[],
  edges: Edge[],
  opts?: { clusters?: ClusterOptions }
): LayoutResult {
  switch (mode) {
    case "vertical":
      return layoutVertical(nodes, edges);
    case "swimlanes":
      return layoutSwimlanes(nodes, edges);
    case "clustered": {
      const base = layoutSugiyama(nodes, edges);
      const withClusters = layoutClustered(
        base.nodes,
        base.edges,
        opts?.clusters
      );
      return { ...withClusters };
    }
    case "sugiyama":
    default:
      return layoutSugiyama(nodes, edges);
  }
}
