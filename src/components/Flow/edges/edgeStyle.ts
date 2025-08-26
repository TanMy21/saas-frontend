import { type EdgeProps } from "@xyflow/react";

import { EdgeStyle } from "../../../utils/types";

export function readEdgeStyle(
  props: EdgeProps,
  fallback: EdgeStyle
): EdgeStyle {
  const s = (props.data as any)?.edgeStyle as EdgeStyle | undefined;
  return s ?? fallback;
}
