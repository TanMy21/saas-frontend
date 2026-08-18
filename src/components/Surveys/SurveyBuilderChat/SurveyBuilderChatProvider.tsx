import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  AppendMessage,
  AssistantRuntimeProvider,
  useExternalStoreRuntime,
} from "@assistant-ui/react";

import {
  ACCEPTED_DOCUMENT_TYPES,
  createInitialMessages,
  createMessageId,
  DEFAULT_QUESTION_TYPES,
  getFileExtension,
  MAX_DOCUMENT_SIZE,
  MOCK_PREVIEW_QUESTIONS,
} from "./mockSurveyBuilderChat";
import type {
  SurveyBuilderChatContextValue,
  SurveyChatMessage,
  SurveyChatPhase,
  SurveyChatUploadMode,
} from "./surveyBuilderChat.types";
import { SurveyBuilderChatContext } from "./SurveyBuilderChatContext";

const wait = (duration: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, duration);
  });

const getMessageText = (message: AppendMessage) =>
  message.content
    .filter((part) => part.type === "text")
    .map((part) => (part.type === "text" ? part.text : ""))
    .join(" ")
    .trim();

const getAcceptedExtensions = () => ACCEPTED_DOCUMENT_TYPES.split(",");

export const SurveyBuilderChatProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [messages, setMessages] = useState<SurveyChatMessage[]>(
    createInitialMessages,
  );
  const [phase, setPhase] = useState<SurveyChatPhase>("idle");
  const [isRunning, setIsRunning] = useState(false);
  const [selectedQuestionCount, setSelectedQuestionCount] = useState(10);
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<string[]>(
    DEFAULT_QUESTION_TYPES,
  );
  const phaseRef = useRef(phase);
  const mountedRef = useRef(true);
  const operationRef = useRef(0);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(
    () => () => {
      mountedRef.current = false;
      operationRef.current += 1;
    },
    [],
  );

  const beginOperation = useCallback(() => {
    operationRef.current += 1;
    return operationRef.current;
  }, []);

  const isOperationActive = useCallback(
    (operationId: number) =>
      mountedRef.current && operationRef.current === operationId,
    [],
  );

  const appendMessage = useCallback(
    (message: Omit<SurveyChatMessage, "id" | "createdAt">) => {
      const nextMessage: SurveyChatMessage = {
        ...message,
        id: createMessageId(),
        createdAt: new Date(),
      };
      setMessages((current) => [...current, nextMessage]);
      return nextMessage.id;
    },
    [],
  );

  const updateProgress = useCallback(
    (
      messageId: string,
      value: number,
      label: string,
      detail: string,
    ) => {
      setMessages((current) =>
        current.map((message) =>
          message.id === messageId
            ? { ...message, progress: { value, label, detail } }
            : message,
        ),
      );
    },
    [],
  );

  const uploadDocument = useCallback(
    async (file: File, mode: SurveyChatUploadMode) => {
      const extension = `.${getFileExtension(file.name)}`;
      const accepted = getAcceptedExtensions().includes(extension);

      if (!accepted || file.size > MAX_DOCUMENT_SIZE) {
        appendMessage({
          role: "assistant",
          kind: "error",
          text: !accepted
            ? "That file type is not supported in this prototype. Try PDF, DOC, DOCX, ODT, TXT, Markdown, or RTF."
            : "That file is larger than the 25 MB prototype limit.",
        });
        return;
      }

      const attachment = {
        name: file.name,
        size: file.size,
        mimeType: file.type || "application/octet-stream",
        extension: getFileExtension(file.name).toUpperCase(),
      };

      appendMessage({ role: "user", kind: "attachment", attachment });
      const operationId = beginOperation();
      setIsRunning(true);
      setPhase(mode === "generate" ? "processing-document" : "importing");

      const progressId = appendMessage({
        role: "assistant",
        kind: "progress",
        text:
          mode === "generate"
            ? "Preparing your source document"
            : "Importing questions",
        progress: {
          value: 8,
          label: "Uploading document",
          detail: file.name,
        },
      });

      await wait(450);
      if (!isOperationActive(operationId)) return;
      updateProgress(
        progressId,
        36,
        "Extracting readable content",
        "Detecting headings, lists, tables, and question blocks",
      );

      await wait(650);
      if (!isOperationActive(operationId)) return;
      updateProgress(
        progressId,
        72,
        mode === "generate" ? "Analyzing the document" : "Mapping questions",
        mode === "generate"
          ? "Identifying topics suitable for survey questions"
          : "Matching prompts and options to supported question types",
      );

      await wait(650);
      if (!isOperationActive(operationId)) return;
      updateProgress(
        progressId,
        100,
        mode === "generate" ? "Document ready" : "Import complete",
        mode === "generate"
          ? "The source is ready for question generation"
          : "12 questions recognized and validated",
      );

      await wait(300);
      if (!isOperationActive(operationId)) return;
      setIsRunning(false);

      if (mode === "import") {
        setPhase("imported");
        appendMessage({
          role: "assistant",
          kind: "success",
          text: "12 questions were imported successfully in this simulation. No survey data was changed.",
        });
        return;
      }

      setPhase("choosing-count");
      appendMessage({
        role: "assistant",
        kind: "question-count",
        text: "How many questions should I generate from this document?",
      });
    },
    [appendMessage, beginOperation, isOperationActive, updateProgress],
  );

  const chooseQuestionCount = useCallback(
    (count: number) => {
      setSelectedQuestionCount(count);
      appendMessage({
        role: "user",
        kind: "text",
        text: `Create ${count} questions.`,
      });
      setPhase("choosing-types");
      appendMessage({
        role: "assistant",
        kind: "question-types",
        text: "Which question types may I use? Select one or more.",
      });
    },
    [appendMessage],
  );

  const toggleQuestionType = useCallback((type: string) => {
    setSelectedQuestionTypes((current) =>
      current.includes(type)
        ? current.filter((item) => item !== type)
        : [...current, type],
    );
  }, []);

  const generateQuestions = useCallback(async () => {
    if (selectedQuestionTypes.length === 0) return;

    const operationId = beginOperation();
    appendMessage({
      role: "user",
      kind: "text",
      text: `Use ${selectedQuestionTypes.length} selected question types.`,
    });
    setPhase("generating");
    setIsRunning(true);

    const progressId = appendMessage({
      role: "assistant",
      kind: "progress",
      text: "Generating survey questions",
      progress: {
        value: 12,
        label: "Planning question coverage",
        detail: `Balancing ${selectedQuestionCount} questions across the source`,
      },
    });

    await wait(500);
    if (!isOperationActive(operationId)) return;
    updateProgress(
      progressId,
      48,
      "Writing questions and options",
      "Applying the selected question types",
    );

    await wait(700);
    if (!isOperationActive(operationId)) return;
    updateProgress(
      progressId,
      82,
      "Reviewing the generated survey",
      "Checking clarity, duplication, and option quality",
    );

    await wait(600);
    if (!isOperationActive(operationId)) return;
    updateProgress(
      progressId,
      100,
      "Generation complete",
      `${selectedQuestionCount} questions are ready to review`,
    );

    await wait(300);
    if (!isOperationActive(operationId)) return;
    setIsRunning(false);
    setPhase("reviewing");
    appendMessage({
      role: "assistant",
      kind: "preview",
      text: "Here is a preview. Review the wording and options before approving.",
      preview: MOCK_PREVIEW_QUESTIONS,
      previewTotal: selectedQuestionCount,
    });
  }, [
    appendMessage,
    beginOperation,
    isOperationActive,
    selectedQuestionCount,
    selectedQuestionTypes,
    updateProgress,
  ]);

  const approveQuestions = useCallback(() => {
    appendMessage({
      role: "user",
      kind: "text",
      text: "Approve these questions.",
    });
    setPhase("approved");
    appendMessage({
      role: "assistant",
      kind: "success",
      text: `${selectedQuestionCount} questions were approved in this simulation. No survey data was changed.`,
    });
  }, [appendMessage, selectedQuestionCount]);

  const requestRevision = useCallback(() => {
    appendMessage({
      role: "user",
      kind: "text",
      text: "I want to revise the generated questions.",
    });
    appendMessage({
      role: "assistant",
      kind: "text",
      text: "Tell me what to adjust—for example, the tone, difficulty, wording, or answer options.",
    });
  }, [appendMessage]);

  const resetConversation = useCallback(() => {
    operationRef.current += 1;
    setMessages(createInitialMessages());
    setPhase("idle");
    setIsRunning(false);
    setSelectedQuestionCount(10);
    setSelectedQuestionTypes(DEFAULT_QUESTION_TYPES);
  }, []);

  const onNew = useCallback(
    async (message: AppendMessage) => {
      const text = getMessageText(message);
      if (!text) return;

      appendMessage({ role: "user", kind: "text", text });
      const operationId = beginOperation();
      setIsRunning(true);
      await wait(550);
      if (!isOperationActive(operationId)) return;

      const currentPhase = phaseRef.current;
      const requestedCount = Number.parseInt(text.match(/\d+/)?.[0] || "", 10);

      if (
        currentPhase === "choosing-count" &&
        requestedCount >= 1 &&
        requestedCount <= 50
      ) {
        setSelectedQuestionCount(requestedCount);
        setPhase("choosing-types");
        appendMessage({
          role: "assistant",
          kind: "question-types",
          text: `Great—${requestedCount} questions. Now choose the question types I may use.`,
        });
      } else if (currentPhase === "idle") {
        appendMessage({
          role: "assistant",
          kind: "text",
          text: "Attach a source document to begin, or choose direct import if your document already contains questions.",
        });
      } else if (currentPhase === "reviewing") {
        appendMessage({
          role: "assistant",
          kind: "text",
          text: "I’ve noted that revision request. In the connected version I would regenerate the preview; for now you can approve it or continue testing the conversation.",
        });
      } else {
        appendMessage({
          role: "assistant",
          kind: "text",
          text: "This is a UI simulation, but the message flow, loading state, and interactive controls behave like the connected chat will.",
        });
      }

      setIsRunning(false);
    },
    [appendMessage, beginOperation, isOperationActive],
  );

  const runtime = useExternalStoreRuntime({
    messages,
    isRunning,
    convertMessage: (message: SurveyChatMessage) => ({
        id: message.id,
        role: message.role,
        createdAt: message.createdAt,
        content: [{ type: "text", text: message.text || "" }],
        metadata: { custom: { kind: message.kind } },
    }),
    onNew,
  });

  const value = useMemo<SurveyBuilderChatContextValue>(
    () => ({
      messages,
      phase,
      isRunning,
      selectedQuestionCount,
      selectedQuestionTypes,
      uploadDocument,
      chooseQuestionCount,
      toggleQuestionType,
      generateQuestions,
      approveQuestions,
      requestRevision,
      resetConversation,
    }),
    [
      approveQuestions,
      chooseQuestionCount,
      generateQuestions,
      isRunning,
      messages,
      phase,
      requestRevision,
      resetConversation,
      selectedQuestionCount,
      selectedQuestionTypes,
      toggleQuestionType,
      uploadDocument,
    ],
  );

  return (
    <SurveyBuilderChatContext.Provider value={value}>
      <AssistantRuntimeProvider runtime={runtime}>
        {children}
      </AssistantRuntimeProvider>
    </SurveyBuilderChatContext.Provider>
  );
};
