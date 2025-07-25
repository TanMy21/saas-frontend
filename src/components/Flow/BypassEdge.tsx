import { useEffect, useState } from "react";

import ClearIcon from "@mui/icons-material/Clear";
import {
  type EdgeProps,
  getBezierPath,
  getStraightPath,
  useReactFlow,
} from "@xyflow/react";

import { useDeleteConditionMutation } from "../../app/slices/flowApiSlice";

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
}: EdgeProps) => {
  const { setEdges } = useReactFlow();
  const [deleteCondition] = useDeleteConditionMutation();
  const [angleDeg, setAngleDeg] = useState(0);
  // Check if nodes are on the same level
  const SAME_LEVEL_THRESHOLD = 10;
  const CURVATURE = 0.3;
  const isSameLevel = Math.abs(sourceY - targetY) < SAME_LEVEL_THRESHOLD;

  // generate straight or curved path based on Y difference
  const [edgePath, labelX, labelY] = isSameLevel
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

  useEffect(() => {
    if (!isSameLevel) {
      const rad = getAngleFromPath(edgePath);
      const deg = (rad * 180) / Math.PI;
      setAngleDeg(deg);
    } else {
      setAngleDeg(0); // reset to horizontal for straight
    }
  }, [edgePath, isSameLevel]);

  const handleDeleteEdge = async () => {
    try {
      if (data?.flowConditionID) {
        await deleteCondition(data?.flowConditionID).unwrap();
      }
      setEdges((edges) => edges.filter((edge) => edge.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const sourceOrder = (data?.sourceOrder as number) ?? "";
  const targetOrder = (data?.targetOrder as number) ?? "";

  const absAngle = Math.abs(angleDeg % 180);
  const angleFactor = Math.sin((absAngle * Math.PI) / 180);

  const dynamicWidth = 100 + angleFactor * 60;
  const dynamicHeight = 25 + angleFactor * 30;
  const offsetX = dynamicWidth / 2;
  const offsetY = dynamicHeight / 2;

  console.log("Edge Data: ", data);

  return (
    <>
      <path
        id={id}
        d={edgePath}
        markerEnd={markerEnd}
        className="react-flow__edge-path"
        style={{
          stroke: "#1ABEBE",
          strokeWidth: 2,
          fill: "none",
        }}
      />

      <foreignObject
        x={labelX - offsetX}
        y={labelY - offsetY}
        width={dynamicWidth}
        height={dynamicHeight}
        style={{
          overflow: "visible",
          pointerEvents: "all",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#F6F8FF",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2px 4px",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#000",
            transform: `rotate(${angleDeg}deg)`,
            transformOrigin: "center center",
            gap: "12px",
          }}
        >
          <div>{`${sourceOrder} ➝ ${targetOrder}`}</div>
          <button
            onClick={handleDeleteEdge}
            style={{
              all: "unset",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              cursor: "pointer",
            }}
          >
            <ClearIcon
              fontSize="small"
              sx={{ fontSize: "16px", color: "#D32F2F" }}
            />
          </button>
        </div>
      </foreignObject>
    </>
  );
};

export default BypassEdge;
