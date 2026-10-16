import type { ReactNode } from "react";
import { useMemo } from "react";

import { styled, Typography } from "@mui/material";

import { useAppSelector } from "../../../../app/typedReduxHooks";
import type {
  AssistantMessage,
  AssistantQuestionType,
  AssistantThread,
} from "../../../../types/surveyBuilderAssistant.types";
import { htmlToPlainText } from "../../../../utils/richTextUtils";
import type { Element } from "../../../../utils/types";
import {
  QuestionFlow,
  type QuestionFlowAnswers,
  type QuestionFlowStep,
} from "../../../assistant-ui/question-flow";
import { useSurveyBuilderAssistant } from "../SurveyBuilderAssistantContext";

const Box = styled("div")({});
const protectedTypes = new Set([
  "WELCOME_SCREEN",
  "END_SCREEN",
  "INSTRUCTIONS",
  "EMAIL_CONTACT",
  "INFO_SCREEN",
  "CONSENT",
]);
const questionTypes: Record<AssistantQuestionType, string> = {
  RADIO: "Single choice",
  MULTIPLE_CHOICE: "Multiple choice",
  DROPDOWN: "Dropdown",
  TEXT: "Text",
  NUMBER: "Number",
  RANGE: "Range",
  RANK: "Ranking",
  BINARY: "Binary",
  MEDIA: "Media",
  TIMED_CHOICE: "Timed choice",
  CONCEPT_FIT: "Concept fit",
  IAT: "IAT",
};

const questionOptions = (questions: Element[]) =>
  questions.map((question, index) => ({
    id: question.questionID,
    label: `Q${index + 1}. ${htmlToPlainText(question.text).trim() || "Untitled question"}`,
  }));

const getSteps = (
  thread: AssistantThread,
  questions: Element[],
): QuestionFlowStep[] => {
  const workflow = thread.workflowState;
  const missing = workflow?.missingFields ?? [];
  const replacement = Boolean(workflow?.pendingReplacementRequest);

  if (
    missing.includes("REORDER_SCOPE") ||
    missing.includes("REORDER_DESTINATION")
  ) {
    if (questions.length < 2) return [];
    const steps: QuestionFlowStep[] = [];
    if (missing.includes("REORDER_SCOPE"))
      steps.push({
        id: "REORDER_SCOPE",
        question: "Which questions should move together?",
        description:
          "Select at least two existing questions. You can describe a different group in chat.",
        selectionMode: "multiple",
        minSelections: 2,
        options: questionOptions(questions),
      });
    if (missing.includes("REORDER_DESTINATION"))
      steps.push({
        id: "REORDER_DESTINATION",
        question: "Where should those questions go?",
        description:
          "For a position before or after another group, describe it in chat.",
        options: [
          { id: "BEGINNING", label: "At the beginning" },
          { id: "END", label: "At the end" },
        ],
      });
    return steps;
  }

  // Mode selection is limited to pending replacement requests, not general chat setup.
  if (
    replacement &&
    missing.includes("REPLACEMENT_SCOPE") &&
    questions.length > 0
  )
    return [
      {
        id: "REPLACEMENT_SCOPE",
        question: "Which questions should be replaced?",
        description:
          "Select existing questions or choose the complete set. You will review a preview before approval.",
        selectionMode: "multiple",
        options: [
          { id: "ALL", label: "All ordinary questions", exclusive: true },
          ...questionOptions(questions),
        ],
      },
    ];

  if (replacement && missing.includes("MODE"))
    return [
      {
        id: "MODE",
        question: "How would you like to prepare the replacement questions?",
        options: [
          {
            id: "IMPORT",
            label: "I’ll provide the questions",
            description:
              "Paste your replacement questions and options in chat next.",
          },
          {
            id: "GENERATE",
            label: "Generate them for me",
            description: "Use your research topic and generation preferences.",
          },
        ],
      },
    ];

  if (workflow?.activeMode !== "GENERATE" || missing.includes("TOPIC"))
    return [];
  const requirements = workflow.generationRequirements;
  if (!requirements?.topic?.trim()) return [];

  const needsCount = !requirements.questionCount;
  const needsTypes =
    requirements.questionTypes.length === 0 &&
    !requirements.chooseQuestionTypesForMe;
  // Preserve the existing rich type picker when it is the only missing choice.
  if (!needsCount) return [];
  const maximum =
    replacement || thread.draft.commitMode !== "APPEND"
      ? 50
      : Math.max(0, 50 - questions.length - thread.draft.questions.length);
  if (maximum === 0) return [];
  const counts = [...new Set([1, 2, 3, 5, 10, 15, 20, 25, 30, 50, maximum])]
    .filter((count) => count <= maximum)
    .sort((a, b) => a - b);
  const steps: QuestionFlowStep[] = [
    {
      id: "QUESTION_COUNT",
      question: "How many questions would you like?",
      description: `Choose a count, or type a different number from 1 to ${maximum} in chat.`,
      options: counts.map((count) => ({
        id: String(count),
        label: `${count} question${count === 1 ? "" : "s"}`,
      })),
    },
  ];
  if (needsTypes)
    steps.push({
      id: "QUESTION_TYPES",
      question: "Which question types should I use?",
      description: "Select one or more types, or let the assistant choose.",
      selectionMode: "multiple",
      options: [
        { id: "CHOOSE_FOR_ME", label: "Choose for me", exclusive: true },
        ...Object.entries(questionTypes).map(([id, label]) => ({ id, label })),
      ],
    });
  return steps;
};

const formatAnswers = (
  answers: QuestionFlowAnswers,
  questions: Element[],
  chooseTypesForMe = false,
) => {
  const positions = (ids: string[]) =>
    ids
      .map((id) => {
        const index = questions.findIndex(
          (question) => question.questionID === id,
        );
        if (index < 0)
          throw new Error(
            "The survey changed. Please review the questions and try again.",
          );
        return index + 1;
      })
      .sort((a, b) => a - b)
      .join(", ");

  if (answers.MODE)
    return answers.MODE[0] === "IMPORT"
      ? "For the pending replacement request, I will provide the replacement questions and options."
      : "For the pending replacement request, generate the replacement questions for me.";

  if (answers.REPLACEMENT_SCOPE)
    return answers.REPLACEMENT_SCOPE.includes("ALL")
      ? "For the pending replacement request, replace all ordinary questions."
      : `For the pending replacement request, replace questions ${positions(answers.REPLACEMENT_SCOPE)}.`;

  if (answers.REORDER_SCOPE || answers.REORDER_DESTINATION) {
    const destination =
      answers.REORDER_DESTINATION?.[0] === "BEGINNING" ? "beginning" : "end";
    if (answers.REORDER_SCOPE && answers.REORDER_DESTINATION)
      return `Move questions ${positions(answers.REORDER_SCOPE)} to the ${destination}.`;
    // Short clarifications let the backend retain the already-known group or destination.
    return answers.REORDER_SCOPE
      ? `Questions ${positions(answers.REORDER_SCOPE)}.`
      : `At the ${destination}.`;
  }

  const parts: string[] = [];
  if (answers.QUESTION_COUNT)
    parts.push(
      `For generation, use a question count of ${answers.QUESTION_COUNT[0]}.`,
    );
  if (!answers.QUESTION_TYPES && chooseTypesForMe) {
    parts.push("Choose the most appropriate question types for me.");
  }
  if (answers.QUESTION_TYPES)
    parts.push(
      answers.QUESTION_TYPES.includes("CHOOSE_FOR_ME")
        ? "Choose the most appropriate question types for me."
        : `For generation, use these question types: ${answers.QUESTION_TYPES.map((type) => `${questionTypes[type as AssistantQuestionType]} (${type})`).join(", ")}.`,
    );
  return parts.join("\n");
};

const AssistantQuestionFlow = ({
  message,
  latestCompletedAssistantMessageID,
  children,
}: {
  message: AssistantMessage;
  latestCompletedAssistantMessageID: string | null;
  children: ReactNode;
}) => {
  const { thread, canSendMessages, sendMessageWithResult } =
    useSurveyBuilderAssistant();
  const elements = useAppSelector((state) => state.surveyBuilder.elements);
  const eligible =
    message.role === "ASSISTANT" &&
    message.status === "COMPLETED" &&
    message.messageID === latestCompletedAssistantMessageID &&
    thread?.status === "ACTIVE" &&
    (thread.stage === "COLLECTING_INPUT" || thread.stage === "PROCESSING") &&
    thread.workflowState?.lastActionName === "ASK_CLARIFICATION" &&
    !message.content.parts.some(
      (part) => part.type === "notice" && part.reason !== "QUESTION_CAPACITY",
    );
  const questions = useMemo(
    () =>
      elements
        .filter(
          (element) =>
            element.relatedSurveyId === thread?.surveyID &&
            !protectedTypes.has(element.type),
        )
        .slice()
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [elements, thread?.surveyID],
  );
  const steps = useMemo(
    () => (eligible && thread ? getSteps(thread, questions) : []),
    [eligible, thread, questions],
  );

  if (steps.length === 0) return <>{children}</>;

  return (
    <Box>
      {message.content.parts.some((part) => part.type === "notice") && (
        <Box sx={{ mb: 1 }}>{children}</Box>
      )}
      <QuestionFlow
        key={`${thread?.threadID}:${message.messageID}:${JSON.stringify(steps)}`}
        steps={steps}
        disabled={!canSendMessages}
        completeLabel="Continue"
        onComplete={async (answers) => {
          const result = await sendMessageWithResult(
            formatAnswers(
              answers,
              questions,
              thread?.workflowState?.generationRequirements
                ?.chooseQuestionTypesForMe,
            ),
          );
          if (!result.success) throw new Error(result.error);
        }}
      />
      <Typography
        sx={{
          mt: 0.75,
          color: "#64748B",
          fontSize: "var(--assistant-chat-font-label, 12px)",
          lineHeight: 1.5,
        }}
      >
        You can also answer in chat. Survey changes still need your approval.
      </Typography>
    </Box>
  );
};

export default AssistantQuestionFlow;
