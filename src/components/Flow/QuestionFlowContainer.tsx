import { useEffect, useState } from "react";

import { Box, CircularProgress } from "@mui/material";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  type Edge,
  type Node,
  type OnConnect,
  type NodeMouseHandler,
  type EdgeChange,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useGetAllConditionsForSurveyQuery } from "../../app/slices/flowApiSlice";
import {
  ICustomEdge,
  Condition,
  EdgeFormData,
  QuestionFlowProps,
  NodeData,
} from "../../utils/types";
import FlowConditionModal from "../Modals/FlowConditionModal";

import BypassEdge from "./BypassEdge";
import CustomEdge from "./CustomEdge";
import { layoutNodesWithBypasses } from "./customLayout";
import QuestionNode from "./QuestionNode";

const nodeTypes = { questionNode: QuestionNode };

const edgeTypes = {
  "custom-edge": CustomEdge,
  "bypass-edge": BypassEdge,
};

const QuestionFlowContainer = ({ Elements, surveyID }: QuestionFlowProps) => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, _onEdgesChange] = useEdgesState<ICustomEdge>([]);
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

  const { data: questionConditions, isLoading } =
    useGetAllConditionsForSurveyQuery(surveyID);

  const handleNodeClick: NodeMouseHandler = (_event, node) => {
    setSelectedNode(node);
    setOpenConditions(true);
    setConditions([]);
    setErrors(() => ({}));
    setIsValidArray(() => []);

    setEdgeFormData((prev) => ({
      ...prev,
      sourceQuestionID: String(node.data?.questionID as string) || "",
      sourceQuestionOrder: Number((node.data?.order as number) ?? -1),
      sourceQuestionText: String(node.data?.question as string) || "",
      sourceQuestionIcon: String(node.data?.element as string) || "",
    }));
  };

  const onConnect: OnConnect = (connection) => {
    setEdges((eds) => {
      const sourceNode = nodes.find((n) => n.id === connection.source);
      const targetNode = nodes.find((n) => n.id === connection.target);

      if (!sourceNode || !targetNode) return eds;

      const sourceOrder = (sourceNode?.data as unknown as NodeData)?.order ?? 0;
      const targetOrder = (targetNode?.data as unknown as NodeData)?.order ?? 0;
      const isBypass = targetOrder - sourceOrder > 1;

      const exists = eds.some(
        (edge) =>
          edge.source === connection.source && edge.target === connection.target
      );

      if (!exists && sourceNode && targetNode) {
        const newEdge: Edge = {
          id: `bypass-${connection.source}-${connection.target}`,
          ...connection,
          type: "bypass-edge",
          data: {
            bypass: isBypass,
            sourceOrder: sourceOrder,
            targetOrder: targetOrder,
            flowConditionID: "",
          },
        };

        // update conditions
        setConditions((prev) => [
          ...prev,
          {
            flowConditionID: "",
            relatedQuestionID: sourceNode.id,
            goto_questionID: targetNode.id,
            conditionType: "",
            conditionValue: null,
          },
        ]);

        const updatedEdges = [...eds, newEdge];
        const updatedNodes = layoutNodesWithBypasses(nodes, updatedEdges);
        setNodes(updatedNodes); // re-layout nodes
        return updatedEdges;
      }

      return eds;
    });

    const sourceNode = nodes.find((n) => n.id === connection.source);
    if (sourceNode) {
      setSelectedNode(sourceNode);

      setEdgeFormData((prev) => ({
        ...prev,
        sourceQuestionID: String(sourceNode.data?.questionID),
        sourceQuestionOrder: Number(sourceNode.data?.order),
        sourceQuestionText: String(sourceNode.data?.question),
        sourceQuestionIcon: String(sourceNode.data?.element),
        source: Number(sourceNode.id),
        target: Number(connection.target),
      }));
    }

    setErrors({});
    setIsValidArray([]);

    setOpenConditions(true);
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
    if (!Elements || !Array.isArray(Elements)) return;

    const filtered = Elements.filter(
      (q) =>
        ![
          "WELCOME_SCREEN",
          "END_SCREEN",
          "EMAIL_CONTACT",
          "INSTRUCTIONS",
        ].includes(q.type)
    );

    const sorted = [...filtered].sort((a, b) => a.order! - b.order!);

    const generatedNodes: Node[] = sorted.map((q) => ({
      id: q.questionID,
      data: {
        label: q.order,
        questionID: q.questionID,
        question: q.text,
        order: q.order,
        element: q.type,
      },
      type: "questionNode",
      position: { x: 0, y: 0 },
    }));

    const defaultEdges: Edge[] = sorted.slice(0, -1).map((q, i) => ({
      id: `e${q.questionID}-${sorted[i + 1].questionID}`,
      source: q.questionID,
      target: sorted[i + 1].questionID,
      type: "custom-edge",
      data: { bypass: false },
      immutable: true,
    }));

    const bypassEdges: Edge[] = (questionConditions ?? []).map(
      (condition: Condition) => ({
        id: `bypass-${condition.relatedQuestionID}-${condition.goto_questionID}`,
        source: condition.relatedQuestionID,
        target: condition.goto_questionID,
        type: "bypass-edge",
        data: {
          bypass: true,
          sourceOrder:
            sorted.find((q) => q.questionID === condition.relatedQuestionID)
              ?.order ?? 0,
          targetOrder:
            sorted.find((q) => q.questionID === condition.goto_questionID)
              ?.order ?? 0,
          flowConditionID: condition.flowConditionID,
        },
      })
    );

    const allEdges = [...defaultEdges, ...bypassEdges];
    const layouted = layoutNodesWithBypasses(generatedNodes, allEdges);

    setNodes(layouted);
    setEdges(allEdges);
  }, [Elements, questionConditions]);

  useEffect(() => {
    setTimeout(() => {
      fitView({ padding: 0.2 });
    }, 0);
  }, [nodes]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          margin: "0% auto",
          justifyContent: "center",
          alignItems: "center",
          width: "80%",
          height: "96%",
          // border: "3px solid red",
        }}
      >
        <CircularProgress size={120} />;
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        margin: "1% auto",
        width: "98%",
        height: "92%",
        padding: 2,
        backgroundColor: "#F6F8FF",
        borderRadius: "12px",
        boxShadow: "inset 0 4px 8px rgba(0, 0, 0, 0.06)",
        border: "1px solid #E0E4FF",
        // background: "linear-gradient(145deg, #f0f3ff, #dfe3f2)",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
        }}
      >
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
        setEdges={setEdges}
        isValidArray={isValidArray}
        setIsValidArray={setIsValidArray}
        conditions={conditions}
        setConditions={setConditions}
        Elements={Elements}
      />
    </Box>
  );
};

export default QuestionFlowContainer;
