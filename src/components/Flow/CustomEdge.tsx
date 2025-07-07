import {
  BaseEdge,
  getBezierPath,
  getStraightPath,
  type EdgeProps,
} from "@xyflow/react";

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
}: EdgeProps) {
  const SAME_LEVEL_THRESHOLD = 10;
  const CURVATURE = 0.3;
  const isSameLevel = Math.abs(sourceY - targetY) < SAME_LEVEL_THRESHOLD;

  const [edgePath] = isSameLevel
    ? getStraightPath({ sourceX, sourceY, targetX, targetY })
    : getBezierPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
        curvature: CURVATURE,
      });

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        stroke: "#777",
        strokeWidth: 2,
      }}
    />
  );
}
