import { useEffect, useState } from "react";

import { Box } from "@mui/material";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  type Edge,
  type Node,
  type OnConnect,
  type NodeMouseHandler,
  type EdgeChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import {
  ICustomEdge,
  Condition,
  EdgeFormData,
  QuestionFlowProps,
} from "../../utils/types";
import FlowConditionModal from "../Modals/FlowConditionModal";

import BypassEdge from "./BypassEdge";
import CustomEdge from "./CustomEdge";
import QuestionNode from "./QuestionNode";

const nodeTypes = { questionNode: QuestionNode };

const edgeTypes = {
  "custom-edge": CustomEdge,
  "bypass-edge": BypassEdge,
};

const QuestionFlowContainer = ({ Elements }: QuestionFlowProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<ICustomEdge>([]);
  // const [conditionBlocks, setConditionBlocks] = useState<number[]>([1]);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [openConditions, setOpenConditions] = useState(false);
  const [errors, setErrors] = useState<Record<number, string[]>>({});
  const [isValidArray, setIsValidArray] = useState<boolean[]>([]);
  const [edgeFormData, setEdgeFormData] = useState<EdgeFormData>({
    sourceQuestionID: "",
    sourceQuestionOrder: -1,
    sourceQuestionText: "",
    sourceQuestionIcon: "",
    source: 0,
    target: 0,
  });

  // const addConditionBlock = () => {
  //   setConditionBlocks([...conditionBlocks, conditionBlocks.length + 1]);
  // };

  const handleNodeClick: NodeMouseHandler = (_event, node) => {
    setSelectedNode(node);
    setOpenConditions(true);
    setConditions([]);
    setErrors(() => ({}));
    setIsValidArray(() => []);

    setEdgeFormData((prev) => ({
      ...prev,
      sourceQuestionID: String(node.data?.questionID as string) || "",
      sourceQuestionOrder: Number(node.data?.order as number) ?? -1,
      sourceQuestionText: String(node.data?.question as string) || "",
      sourceQuestionIcon: String(node.data?.element as string) || "",
    }));
  };

  const onConnect: OnConnect = (connection) => {
    setEdges((eds) => {
      const sourceNode = nodes.find((node) => node.id === connection.source);
      const sourceIndex = nodes.findIndex(
        (node) => node.id === connection.source
      );

      const targetIndex = nodes.findIndex(
        (node) => node.id === connection.target
      );

      const isBypass = targetIndex - sourceIndex > 1;

      if (sourceIndex !== -1 && targetIndex !== -1) {
        setEdgeFormData({
          source: sourceIndex,
          target: targetIndex,
          sourceQuestionID: (sourceNode?.data?.questionID as string) || "",
          sourceQuestionOrder: sourceNode?.data?.order as number,
          sourceQuestionText: (sourceNode?.data?.question as string) || "",
          sourceQuestionIcon: (sourceNode?.data?.element as string) || "",
        });

        setOpenConditions(true);
      }

      const exists = eds.some(
        (edge) =>
          edge.source === connection.source && edge.target === connection.target
      );

      if (!exists) {
        return addEdge(
          {
            ...connection,
            type: "bypass-edge",
            data: {
              bypass: isBypass,
              sourceOrder: Number(sourceIndex),
              targetOrder: Number(targetIndex),
            },
          },
          eds
        );
      }

      return eds;
    });
  };

  const handleEdgesChange = (changes: EdgeChange[]) => {
    const updatedEdges = edges.filter((edge) => {
      const change = changes.find((c) => {
        if ("id" in c) {
          return c.id === edge.id;
        }
        return false;
      });

      if (change?.type === "remove" && edge.immutable) {
        return true;
      }
      return !change || change.type !== "remove";
    });
    setEdges(updatedEdges);
  };

  useEffect(() => {
    if (!Elements || !Array.isArray(Elements)) {
      return;
    }

    const filteredQuestions = Elements.filter(
      (question: any) =>
        question.type !== "WELCOME_SCREEN" && question.type !== "END_SCREEN"
    );

    const sortedQuestions = filteredQuestions.sort(
      (a: any, b: any) => a.order - b.order
    );

    const generatedNodes: Node[] = sortedQuestions.map(
      (question: any, index: number) => ({
        id: question.questionID,
        data: {
          label: question.order,
          questionID: question.questionID,
          question: question.text,
          order: question.order,
          element: question.type,
        },
        type: "questionNode",
        position: { x: index * 300, y: 300 },
      })
    );

    const generatedEdges: Edge[] = sortedQuestions
      .slice(0, -1)
      .map((question: any, index: number) => ({
        id: `e${question.questionID}-${sortedQuestions[index + 1].questionID}`,
        source: question.questionID,
        target: sortedQuestions[index + 1].questionID,
        type: "custom-edge",
        immutable: true,
        data: { bypass: false },
      }));

    setNodes(generatedNodes);
    setEdges(generatedEdges);
  }, [Elements]);

  return (
    <Box
      sx={{
        display: "flex",
        marginTop: "1%",
        width: "80%",
        height: "96%",
        border: "3px solid red",
      }}
    >
      <Box sx={{ width: "100%", height: "100%" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={handleEdgesChange}
          onNodeClick={handleNodeClick}
          onConnect={onConnect}
        >
          <Controls orientation="horizontal" />
          <Background variant={BackgroundVariant.Cross} gap={12} size={1} />
        </ReactFlow>
      </Box>
      <FlowConditionModal
        nodes={nodes}
        edges={edges}
        openConditions={openConditions}
        setOpenConditions={setOpenConditions}
        selectedNode={selectedNode}
        setSelectedNode={setSelectedNode}
        edgeFormData={edgeFormData}
        errors={errors}
        setErrors={setErrors}
        isValidArray={isValidArray}
        setIsValidArray={setIsValidArray}
        // conditionBlocks={conditionBlocks}
        // addConditionBlock={addConditionBlock}
        conditions={conditions}
        setConditions={setConditions}
        Elements={Elements}
      />
    </Box>
  );
};

export default QuestionFlowContainer;
