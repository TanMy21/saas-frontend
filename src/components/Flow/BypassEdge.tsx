import { type EdgeProps, useReactFlow } from "@xyflow/react";
import { MdDeleteForever } from "react-icons/md";

const BypassEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  markerEnd,
  style = {},
}: EdgeProps) => {
  const { setEdges } = useReactFlow();

  const curveDirection = Math.random() > 0.5 ? 1 : -1;
  const offset = data?.bypass ? 300 * curveDirection : 0;

  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2 + offset / 2;

  const apexY = curveDirection === 1 ? midY - 40 : midY + 40;

  const apexLeftX = midX - 50;
  const apexRightX = midX + 50;

  const edgePath = `
  M${sourceX},${sourceY} 
  L${apexLeftX},${apexY} 
  L${apexRightX},${apexY} 
  L${targetX},${targetY}
`;

  const handleDeleteEdge = () => {
    setEdges((eds) => eds.filter((edge) => edge.id !== id));
  };

  const labelX = midX - 20;
  const labelY = apexY - (curveDirection === 1 ? -1 : 1);

  const sourceOrder = (data?.sourceOrder as number) ?? "";
  const targetOrder = (data?.targetOrder as number) ?? "";

  return (
    <>
      <path
        id={id}
        d={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: data?.bypass ? "#1ABEBE" : "#555",
          strokeWidth: data?.bypass ? 2 : 1.5,
          ...style,
        }}
        className="react-flow__edge-path"
      />
      <foreignObject x={labelX} y={labelY - 20} width={60} height={40}>
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#E7E5E5",
            color: "#000",
            borderRadius: "8px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          {`${sourceOrder + 1} - ${targetOrder + 1}`}
        </div>
      </foreignObject>

      <foreignObject
        x={labelX - 25}
        y={labelY - 12}
        width={20}
        height={20}
        style={{ cursor: "pointer" }}
      >
        <div
          onClick={handleDeleteEdge}
          style={{
            width: "100%",
            height: "110%",
            backgroundColor: "#E7E5E5",
            color: "#f00",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "32px",
          }}
        >
          <MdDeleteForever />
        </div>
      </foreignObject>
    </>
  );
};

export default BypassEdge;
