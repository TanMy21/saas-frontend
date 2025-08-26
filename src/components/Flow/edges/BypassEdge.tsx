import { useEffect, useMemo, useState } from "react";

import ClearIcon from "@mui/icons-material/Clear";
import {
  type EdgeProps,
  getBezierPath,
  getSmoothStepPath,
  getStraightPath,
  useReactFlow,
} from "@xyflow/react";

import { useDeleteConditionMutation } from "../../../app/slices/flowApiSlice";

import { readEdgeStyle } from "./edgeStyle";

function getAngleFromPath(path: string): number {
  const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
  pathEl.setAttribute("d", path);

  const len = pathEl.getTotalLength();
  const p1 = pathEl.getPointAtLength(len / 2 - 1);
  const p2 = pathEl.getPointAtLength(len / 2 + 1);

  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;

  return Math.atan2(dy, dx); //in radians
}

const BypassEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
  selected,
}: EdgeProps) => {
  const { setEdges } = useReactFlow();
  const [deleteCondition] = useDeleteConditionMutation();
  const styleChoice = readEdgeStyle({ data } as any, "smoothstep");

  // Build the path & label anchor
  const [edgePath, labelX, labelY] = useMemo(() => {
    switch (styleChoice) {
      case "straight":
        return getStraightPath({ sourceX, sourceY, targetX, targetY });

      case "step":
        // orthogonal with sharp corners
        return getSmoothStepPath({
          sourceX,
          sourceY,
          targetX,
          targetY,
          sourcePosition,
          targetPosition,
          borderRadius: 0,
        });

      case "bezier":
        return getBezierPath({ sourceX, sourceY, targetX, targetY });

      case "smoothstep":
      default:
        return getSmoothStepPath({
          sourceX,
          sourceY,
          targetX,
          targetY,
          sourcePosition,
          targetPosition,
          borderRadius: 16,
        });
    }
  }, [
    styleChoice,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  ]);

  // Compute label rotation
  const [angleDeg, setAngleDeg] = useState(0);
  useEffect(() => {
    if (styleChoice === "bezier" || styleChoice === "straight") {
      const rad = getAngleFromPath(edgePath);
      setAngleDeg((rad * 180) / Math.PI);
    } else {
      setAngleDeg(0); // orthogonal styles
    }
  }, [edgePath, styleChoice]);

  // Delete handler
  const handleDeleteEdge = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (data?.flowConditionID) {
        await deleteCondition(data.flowConditionID).unwrap();
      }
      setEdges((edges) => edges.filter((edge) => edge.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // Label content
  const sourceOrder = (data?.sourceOrder as number) ?? "";
  const targetOrder = (data?.targetOrder as number) ?? "";

  // dynamic sizing based on angle
  const absAngle = Math.abs(angleDeg % 180);
  const angleFactor = Math.sin((absAngle * Math.PI) / 180);
  const dynamicWidth = 100 + angleFactor * 60;
  const dynamicHeight = 25 + angleFactor * 30;
  const offsetX = dynamicWidth / 2;
  const offsetY = dynamicHeight / 2;

  return (
    <>
      {/* Path */}
      <path
        id={id}
        d={edgePath}
        markerEnd={markerEnd}
        className="react-flow__edge-path"
        style={{
          stroke: "#1ABEBE",
          strokeWidth: 2,
          fill: "none",
          strokeDasharray: "6 4",
          opacity: selected ? 1 : 0.95,
        }}
      />

      {/* Label + delete button */}
      <foreignObject
        x={labelX - offsetX}
        y={labelY - offsetY}
        width={dynamicWidth}
        height={dynamicHeight}
        style={{ overflow: "visible", pointerEvents: "all" }}
      >
        <div
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#F6F8FF",
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2px 6px",
            fontSize: 13,
            fontWeight: 600,
            color: "#0F172A",
            gap: 10,
            transform:
              styleChoice === "bezier" || styleChoice === "straight"
                ? `rotate(${angleDeg}deg)`
                : "rotate(0deg)",
            transformOrigin: "center center",
            border: selected ? "1px solid #3b82f6" : "1px solid #E0E7FF",
            boxShadow: selected ? "0 0 0 2px rgba(59,130,246,0.25)" : "none",
            userSelect: "none",
          }}
        >
          <div>{`${sourceOrder} ➝ ${targetOrder}`}</div>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={handleDeleteEdge}
            aria-label="Delete bypass"
            style={{
              all: "unset",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              width: 20,
              height: 20,
              cursor: "pointer",
            }}
            title="Delete"
          >
            <ClearIcon sx={{ fontSize: 16, color: "#D32F2F" }} />
          </button>
        </div>
      </foreignObject>
    </>
  );
};

export default BypassEdge;
