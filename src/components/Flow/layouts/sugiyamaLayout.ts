import type { Node, Edge } from "@xyflow/react";

import { LayoutResult } from "../../../utils/types";

import { layoutNodesWithBypasses } from "./customLayout";

export function layoutSugiyama(nodes: Node[], edges: Edge[]): LayoutResult {
  return { nodes: layoutNodesWithBypasses(nodes, edges), edges };
}
