import {
  BaseEdge,
  EdgeLabelRenderer,
  getStraightPath,
  getSmoothStepPath,
  getBezierPath,
  type EdgeProps,
} from "@xyflow/react";

import { readEdgeStyle } from "./edgeStyle";

export default function RegularEdge(props: EdgeProps) {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style,
    markerEnd,
    label,
    selected,
  } = props;

  const edgeStyle = readEdgeStyle(props, "step");

  const compute = () => {
    switch (edgeStyle) {
      case "straight":
        return getStraightPath({ sourceX, sourceY, targetX, targetY });
      case "smoothstep":
        return getSmoothStepPath({
          sourceX,
          sourceY,
          targetX,
          targetY,
          sourcePosition,
          targetPosition,
          borderRadius: 8,
        });
      case "bezier":
        return getBezierPath({ sourceX, sourceY, targetX, targetY });
      case "step":
      default:
        return getSmoothStepPath({
          sourceX,
          sourceY,
          targetX,
          targetY,
          sourcePosition,
          targetPosition,
          borderRadius: 0,
        });
    }
  };

  const [path, labelX, labelY] = compute();

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        style={{ strokeWidth: 2, ...style }}
        markerEnd={markerEnd}
      />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              background: "#111827",
              color: "#fff",
              padding: "2px 6px",
              fontSize: 11,
              borderRadius: 6,
              boxShadow: selected ? "0 0 0 2px #3b82f6" : undefined,
              pointerEvents: "all",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
