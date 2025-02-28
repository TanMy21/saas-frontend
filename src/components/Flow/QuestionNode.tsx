import { Box, Typography } from "@mui/material";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { PiFlowArrowBold } from "react-icons/pi";

import { elementIcons } from "../../utils/elementsConfig";
import { ElementType, IconMapping } from "../../utils/types";
type StingNode = Node<
  { label: string; question: string; element: ElementType },
  "string"
>;

const QuestionNode = ({ data, isConnectable }: NodeProps<StingNode>) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "120px",
        width: "164px",
        backgroundColor: "#FFFFFF",
        border: "4px solid #eee",
        borderRadius: "8px",
        position: "relative",
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{ visibility: "hidden" }}
      />
      <Box
        sx={{
          display: "flex",
          float: "left",
          padding: "2%",
          width: "92%",
          height: "32px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "2%",
            margin: "2%",
            padding: "4%",
            width: "32%",
            height: "72%",
            backgroundColor: "#E1E1E1",
            borderRadius: "8px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "50%",
              height: "96%",
              fontSize: "20px",
            }}
          >
            {elementIcons[data.element as unknown as keyof IconMapping]}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "50%",
              height: "96%",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            {data.label}
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          padding: "4%",
          marginTop: "4%",
          width: "92%",
          height: "64px",
          fontSize: "8px",
        }}
      >
        <Typography fontSize={"12px"} textAlign={"left"}>
          {data.question}
        </Typography>
      </Box>
      <Box
        sx={{
          position: "absolute",
          right: "-1px",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            backgroundColor: "#6366F1",
            zIndex: 1,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            right: "-6px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "12px",
            height: "12px",
            backgroundColor: "#6366F1",
            borderRadius: "50%",
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "12px",
            zIndex: 2,
          }}
        >
          <PiFlowArrowBold size={12} />
        </Box>
      </Box>
    </Box>
  );
};

export default QuestionNode;
