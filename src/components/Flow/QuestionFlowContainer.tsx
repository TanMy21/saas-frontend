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
import { isConditionlessType } from "../../utils/utils";
import FlowConditionModal from "../Modals/FlowConditionModal";
import { toastInfo } from "../toast/toastUtils";

import BypassEdge from "./edges/BypassEdge";
import CustomEdge from "./edges/CustomEdge";
import { useEdgeStyle } from "./edges/useEdgeStyle";
import { applyLayout } from "./layouts/layoutManager";
import { useLayoutMode } from "./layouts/useLayoutMode";
import QuestionNode from "./QuestionNode";
import ViewMenu from "./ViewMenu";

const nodeTypes = { questionNode: QuestionNode };

const edgeTypes = {
  "custom-edge": CustomEdge,
  "bypass-edge": BypassEdge,
};

const QuestionFlowContainer = ({
  Elements,
  surveyID,
  refetch,
}: QuestionFlowProps) => {
  const { fitView } = useReactFlow();
  const { layout, setLayout } = useLayoutMode(surveyID);
  const { edgeStyle, setEdgeStyle } = useEdgeStyle(surveyID);
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
    const qType = String(node.data?.element ?? "");

    if (isConditionlessType(qType)) {
      toastInfo("Conditions aren't available for this question type");
      return;
    }

    setSelectedNode(node);
    setOpenConditions(true);
    setErrors(() => ({}));
    setIsValidArray(() => []);

    const existingConditions =
      questionConditions?.filter(
        (cond: Condition) => cond.relatedQuestionID === node.id
      ) ?? [];

    setConditions(existingConditions);

    setEdgeFormData((prev) => ({
      ...prev,
      sourceQuestionID: String(node.data?.questionID as string) || "",
      sourceQuestionOrder: Number((node.data?.order as number) ?? -1),
      sourceQuestionText: String(node.data?.question as string) || "",
      sourceQuestionIcon: String(node.data?.element as string) || "",
    }));
  };

  const onConnect: OnConnect = (connection) => {
    const sourceNode = nodes.find((n) => n.id === connection.source);
    const targetNode = nodes.find((n) => n.id === connection.target);

    if (!sourceNode || !targetNode) return;

    const sourceType = String(sourceNode.data?.element ?? "");

    if (isConditionlessType(sourceType)) {
      toastInfo("Conditions aren't available for this question type");
      return;
    }

    const exists = edges.some(
      (e) => e.source === connection.source && e.target === connection.target
    );
    if (exists) return;

    setEdges((eds) => {
      const sourceOrder = (sourceNode?.data as unknown as NodeData)?.order ?? 0;
      const targetOrder = (targetNode?.data as unknown as NodeData)?.order ?? 0;
      const isBypass = targetOrder - sourceOrder > 1;

      const exists = eds.some(
        (edge) =>
          edge.source === connection.source && edge.target === connection.target
      );

      if (!exists) {
        const newEdge: Edge = {
          id: `bypass-${connection.source}-${connection.target}`,
          ...connection,
          type: "bypass-edge",
          label: `${sourceOrder} → ${targetOrder}`,
          data: {
            bypass: isBypass,
            sourceOrder: sourceOrder,
            targetOrder: targetOrder,
            flowConditionID: "",
            edgeStyle,
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

        const {
          nodes: relaidNodes,
          edges: laidEdges,
          overlays,
        } = applyLayout(layout, nodes, updatedEdges);
        const laidWithStyle = laidEdges.map((e) => ({
          ...e,
          data: { ...(e.data as any), edgeStyle },
        }));

        setNodes(
          overlays?.length ? [...overlays, ...relaidNodes] : relaidNodes
        );
        setEdges(laidWithStyle);
      }

      return eds;
    });

    setSelectedNode(sourceNode);
    setEdgeFormData((prev) => ({
      ...prev,
      sourceQuestionID: String(sourceNode.data?.questionID),
      sourceQuestionOrder: Number(sourceNode.data?.order),
      sourceQuestionText: String(sourceNode.data?.question),
      sourceQuestionIcon: String(sourceNode.data?.element),
      source: sourceNode.id as unknown as any,
      target: connection.target as unknown as any,
    }));

    const existingConditions =
      questionConditions?.filter(
        (cond: Condition) => cond.relatedQuestionID === connection.source
      ) ?? [];

    const newCondition = {
      flowConditionID: "",
      relatedQuestionID: String(connection.source ?? ""),
      goto_questionID: String(connection.target ?? ""),
      conditionType: "",
      conditionValue: null,
    };

    setConditions([...existingConditions, newCondition]);
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

    const {
      nodes: relaidNodes,
      edges: laidEdges,
      overlays,
    } = applyLayout(layout, nodes, updatedEdges);
    const laidWithStyle = laidEdges.map((e) => ({
      ...e,
      data: { ...(e.data as any), edgeStyle },
    }));

    setNodes(overlays?.length ? [...overlays, ...relaidNodes] : relaidNodes);
    setEdges(laidWithStyle);
  };

  useEffect(() => {
    if (!Elements || !Array.isArray(Elements)) return;

    const filtered = Elements.filter(
      (q) =>
        !["WELCOME_SCREEN", "EMAIL_CONTACT", "INSTRUCTIONS"].includes(q.type)
    );

    const ends = filtered.filter((q) => q.type === "END_SCREEN");
    const questions = filtered.filter((q) => q.type !== "END_SCREEN");

    const sortedQuestions = [...questions].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0)
    );

    const sorted = [...sortedQuestions, ...ends];

    const maxQuestionOrder = sortedQuestions.length
      ? Math.max(...sortedQuestions.map((q) => q.order ?? 0))
      : 0;

    const idToVirtualOrder = new Map<string, number>();
    sorted.forEach((q, i) => {
      const virt =
        q.type === "END_SCREEN" ? maxQuestionOrder + 1 + i : (q.order ?? 0);
      idToVirtualOrder.set(q.questionID, virt);
    });

    // Compact the virtual orders to dense ranks 0..k-1 to remove gaps
    const uniqueVirtuals = Array.from(
      new Set(sorted.map((q) => idToVirtualOrder.get(q.questionID)!))
    ).sort((a, b) => a - b);
    const virtualToCompact = new Map<number, number>();
    uniqueVirtuals.forEach((v, idx) => virtualToCompact.set(v, idx));

    const idToCompactOrder = new Map<string, number>();
    sorted.forEach((q) => {
      idToCompactOrder.set(
        q.questionID,
        virtualToCompact.get(idToVirtualOrder.get(q.questionID)!)!
      );
    });

    const generatedNodes: Node[] = sorted.map((q) => ({
      id: q.questionID,
      data: {
        label: q.type === "END_SCREEN" ? "END" : q.order,
        questionID: q.questionID,
        question: q.text,
        order: idToCompactOrder.get(q.questionID)!,
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
      data: { bypass: false, edgeStyle },
      immutable: true,
    }));

    const bypassEdges: Edge[] = (questionConditions ?? [])
      .map((condition: Condition) => {
        // skip edges whose endpoints don’t exist
        if (
          !idToCompactOrder.has(condition.relatedQuestionID) ||
          !idToCompactOrder.has(condition.goto_questionID)
        ) {
          return null;
        }

        const sOrder = idToCompactOrder.get(condition.relatedQuestionID)!;
        const tOrder = idToCompactOrder.get(condition.goto_questionID)!;

        return {
          id: `bypass-${condition.relatedQuestionID}-${condition.goto_questionID}`,
          source: condition.relatedQuestionID,
          target: condition.goto_questionID,
          type: "bypass-edge",
          label: `${sOrder} → ${tOrder}`,
          data: {
            bypass: tOrder - sOrder > 1, //  gap check on compact ranks
            sourceOrder: sOrder,
            targetOrder: tOrder,
            flowConditionID: condition.flowConditionID,
            edgeStyle,
          },
        } as Edge;
      })
      .filter(Boolean) as Edge[];

    const allEdges = [...defaultEdges, ...bypassEdges];

    // Selected layout
    const {
      nodes: laidNodes,
      edges: laidEdges,
      overlays,
    } = applyLayout(layout, generatedNodes, allEdges, {
      clusters: {
        getGroupId: (n) => (n.data as any)?.sectionId,
        padding: 24,
      },
    });

    const laidWithStyle = laidEdges.map((e) => ({
      ...e,
      data: { ...(e.data as any), edgeStyle },
    }));

    setNodes(overlays?.length ? [...overlays, ...laidNodes] : laidNodes);
    setEdges(laidWithStyle);
  }, [Elements, questionConditions, layout, edgeStyle]);

  useEffect(() => {
    setTimeout(() => {
      fitView({ padding: 0.2 });
    }, 0);
  }, [nodes, layout]);

  useEffect(() => {
    // Rehydrate style on current edges
    setEdges((eds) =>
      eds.map((e) => ({ ...e, data: { ...(e.data as any), edgeStyle } }))
    );
  }, [edgeStyle, setEdges]);

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
          "& .react-flow__attribution": {
            display: "none !important",
          },
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
          isValidConnection={(conn) => {
            const src = nodes.find((n) => n.id === conn.source);
            const srcType = String(src?.data?.element ?? "");
            return !isConditionlessType(srcType);
          }}
        >
          <Controls orientation="horizontal" />
          <Background variant={BackgroundVariant.Cross} gap={12} size={1} />

          <ViewMenu
            layout={layout}
            setLayout={setLayout}
            edgeStyle={edgeStyle}
            setEdgeStyle={setEdgeStyle}
          />
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
        refetch={refetch}
      />
    </Box>
  );
};

export default QuestionFlowContainer;
