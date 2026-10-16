import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { AppendMessage } from "@assistant-ui/react";
import {
  AssistantRuntimeProvider,
  useExternalStoreRuntime,
} from "@assistant-ui/react";

import { setAiQuestionsJustAdded } from "../../../app/slices/generateSurveyQuestionSlice";
import {
  useCommitSurveyBuilderAssistantDraftMutation,
  useCreateSurveyBuilderAssistantThreadMutation,
  useGetSurveyBuilderAssistantJobQuery,
  useLazyGetSurveyBuilderAssistantMessagesQuery,
  useLazyGetSurveyBuilderAssistantThreadQuery,
  useSendSurveyBuilderAssistantMessageMutation,
} from "../../../app/slices/surveyBuilderAssistantApiSlice";
import { useAppDispatch } from "../../../app/typedReduxHooks";
import { useSurveyCanvasRefetch } from "../../../context/BuilderRefetchCanvas";
import {
  AssistantMessage,
  AssistantMessageSubmissionResult,
  AssistantThread,
  PendingCommitRequest,
  PendingMessageRequest,
  ParsedAssistantApiError,
  SendAssistantMessageArgs,
  SurveyBuilderAssistantProviderProps,
} from "../../../types/surveyBuilderAssistant.types";
import {
  ASSISTANT_JOB_POLLING_INTERVAL,
  ASSISTANT_MESSAGE_PAGE_SIZE,
} from "../../../utils/constants";

import {
  convertAssistantMessageToRuntime,
  createAssistantFailureMessage,
  createOptimisticAssistantMessage,
  getAssistantAppendMessageText,
  isAssistantFailureLikeMessage,
  mergeAssistantMessages,
  normalizeAssistantMessageForDisplay,
  parseAssistantApiError,
} from "./SurveyBuilderAssistantAdapters";
import { SurveyBuilderAssistantContext } from "./SurveyBuilderAssistantContext";
import {
  canSendAssistantThreadMessage,
  isAssistantThreadCommitted,
  isAssistantThreadProcessing,
  isAssistantThreadReadOnly,
} from "./surveyBuilderAssistantLifecycle";
import {
  getAssistantApiNotice,
  isAssistantStalePreviewError,
} from "./surveyBuilderAssistantNotices";
import {
  clearAssistantActiveJobID,
  clearAssistantSession,
  readAssistantSession,
  setAssistantActiveJobID,
  writeAssistantSession,
} from "./surveyBuilderAssistantStorage";

export const SurveyBuilderAssistantProvider = ({
  children,
  surveyID,
}: SurveyBuilderAssistantProviderProps) => {
  const assistantSurveyID = surveyID;
  const dispatch = useAppDispatch();
  const refetchCanvas = useSurveyCanvasRefetch();

  const [thread, setThread] = useState<AssistantThread | null>(null);
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [optimisticMessage, setOptimisticMessage] =
    useState<AssistantMessage | null>(null);
  const [activeJobID, setActiveJobID] = useState<string | null>(null);
  const [pendingMessage, setPendingMessage] =
    useState<PendingMessageRequest | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [invalidDraftVersions, setInvalidDraftVersions] = useState<number[]>([]);
  const [nextBeforeSequence, setNextBeforeSequence] = useState<number | null>(
    null,
  );
  const [assistantError, setAssistantError] =
    useState<ParsedAssistantApiError | null>(null);
  const setErrorMessage = useCallback(
    (message: string | null, error?: ParsedAssistantApiError) => {
      setAssistantError(
        message === null
          ? null
          : { status: null, code: null, ...error, message },
      );
    },
    [],
  );
  const errorMessage = assistantError?.message ?? null;
  const errorNotice = useMemo(
    () => (assistantError ? getAssistantApiNotice(assistantError) : null),
    [assistantError],
  );

  const initializationSurveyIDRef = useRef<string | null>(null);
  const handledJobIDRef = useRef<string | null>(null);
  const pendingCommitRef = useRef<PendingCommitRequest | null>(null);
  const createThreadInFlightRef = useRef(false);

  const [createThread] = useCreateSurveyBuilderAssistantThreadMutation();

  const [getThread] = useLazyGetSurveyBuilderAssistantThreadQuery();

  const [getMessages] = useLazyGetSurveyBuilderAssistantMessagesQuery();

  const [sendAssistantMessage, { isLoading: isSending }] =
    useSendSurveyBuilderAssistantMessageMutation();

  const [commitAssistantDraft, { isLoading: isCommitting }] =
    useCommitSurveyBuilderAssistantDraftMutation();

  const shouldPollActiveJob =
    Boolean(activeJobID) &&
    thread?.status === "ACTIVE" &&
    !isAssistantThreadCommitted(thread);

  const { data: activeJob, error: activeJobError } =
    useGetSurveyBuilderAssistantJobQuery(
      {
        surveyID: assistantSurveyID,
        threadID: thread?.threadID ?? "",
        jobID: activeJobID ?? "",
      },
      {
        skip:
          !assistantSurveyID ||
          !thread?.threadID ||
          !activeJobID ||
          !shouldPollActiveJob,
        pollingInterval: shouldPollActiveJob
          ? ASSISTANT_JOB_POLLING_INTERVAL
          : 0,
        refetchOnMountOrArgChange: true,
      },
    );

  const displayMessages = useMemo(() => {
    const mergedMessages = optimisticMessage
      ? mergeAssistantMessages(messages, [optimisticMessage])
      : messages;

    return mergedMessages.map(normalizeAssistantMessageForDisplay);
  }, [messages, optimisticMessage]);

  const isGenerating =
    shouldPollActiveJob &&
    (!activeJob ||
      activeJob.status === "PENDING" ||
      activeJob.status === "PROCESSING");

  useEffect(() => {
    if (!activeJobID || !isAssistantThreadReadOnly(thread)) return;

    setActiveJobID(null);
    clearAssistantActiveJobID(assistantSurveyID);
  }, [activeJobID, assistantSurveyID, thread]);

  const canSendMessages =
    canSendAssistantThreadMessage(thread) &&
    !isInitializing &&
    !isSending &&
    !isGenerating &&
    !isCommitting;

  const loadInitialMessages = useCallback(
    async (threadID: string) => {
      const response = await getMessages({
        surveyID: assistantSurveyID,
        threadID,
        limit: ASSISTANT_MESSAGE_PAGE_SIZE,
      }).unwrap();

      setMessages(response.messages);
      setHasMoreMessages(response.hasMore);
      setNextBeforeSequence(response.nextBeforeSequence);
    },
    [assistantSurveyID, getMessages],
  );

  const refreshThreadAndMessages = useCallback(async () => {
    if (!thread?.threadID) return;

    const threadID = thread.threadID;

    const [latestThread, latestMessages] = await Promise.all([
      getThread({
        surveyID: assistantSurveyID,
        threadID,
      }).unwrap(),
      getMessages({
        surveyID: assistantSurveyID,
        threadID,
        limit: ASSISTANT_MESSAGE_PAGE_SIZE,
      }).unwrap(),
    ]);

    setThread(latestThread);
    setMessages((current) =>
      mergeAssistantMessages(current, latestMessages.messages),
    );
    setHasMoreMessages(latestMessages.hasMore);
    setNextBeforeSequence(latestMessages.nextBeforeSequence);
  }, [assistantSurveyID, getMessages, getThread, thread?.threadID]);

  const createAndStoreThread = useCallback(async () => {
    if (!assistantSurveyID || createThreadInFlightRef.current) return null;

    createThreadInFlightRef.current = true;

    try {
      const createdThread = await createThread({
        surveyID: assistantSurveyID,
      }).unwrap();

      writeAssistantSession(assistantSurveyID, {
        threadID: createdThread.threadID,
      });

      return createdThread;
    } finally {
      createThreadInFlightRef.current = false;
    }
  }, [assistantSurveyID, createThread]);

  const initializeAssistant = useCallback(async () => {
    if (!assistantSurveyID) {
      setErrorMessage("A survey is required to start the assistant.");
      setIsInitializing(false);
      return;
    }

    setIsInitializing(true);
    setErrorMessage(null);
    setThread(null);
    setInvalidDraftVersions([]);
    setMessages([]);
    setOptimisticMessage(null);
    setPendingMessage(null);
    setActiveJobID(null);

    const storedSession = readAssistantSession(assistantSurveyID);
    let loadedThread: AssistantThread | null = null;
    let restoredJobID: string | null = storedSession?.activeJobID ?? null;

    try {
      if (!storedSession?.threadID) {
        loadedThread = await createAndStoreThread();
        restoredJobID = null;
      } else {
        try {
          loadedThread = await getThread({
            surveyID: assistantSurveyID,
            threadID: storedSession.threadID,
          }).unwrap();
        } catch (error) {
          const parsedError = parseAssistantApiError(
            error,
            "Unable to load the saved assistant thread.",
          );

          if (parsedError.status !== 404) throw error;

          clearAssistantSession(assistantSurveyID);
          restoredJobID = null;
          loadedThread = await createAndStoreThread();
        }
      }

      if (!loadedThread) return;

      const canRestoreJob =
        loadedThread.status === "ACTIVE" &&
        !isAssistantThreadCommitted(loadedThread) &&
        Boolean(restoredJobID);

      if (!canRestoreJob) {
        restoredJobID = null;
      }

      writeAssistantSession(assistantSurveyID, {
        threadID: loadedThread.threadID,
        ...(restoredJobID ? { activeJobID: restoredJobID } : {}),
      });

      setThread(loadedThread);

      await loadInitialMessages(loadedThread.threadID);

      if (restoredJobID) {
        handledJobIDRef.current = null;
        setActiveJobID(restoredJobID);
      }
    } catch (error) {
      const parsedError = parseAssistantApiError(
        error,
        "Unable to start the survey assistant.",
      );

      setErrorMessage(parsedError.message, parsedError);
    } finally {
      setIsInitializing(false);
    }
  }, [assistantSurveyID, createAndStoreThread, getThread, loadInitialMessages]);

  useEffect(() => {
    if (
      !assistantSurveyID ||
      initializationSurveyIDRef.current === assistantSurveyID
    ) {
      return;
    }

    initializationSurveyIDRef.current = assistantSurveyID;
    void initializeAssistant();
  }, [assistantSurveyID, initializeAssistant]);

  const submitMessageRequest = useCallback(
    async (
      request: PendingMessageRequest,
      isRetry: boolean,
      targetThread: AssistantThread | null = thread,
    ): Promise<AssistantMessageSubmissionResult> => {
      if (
        !targetThread?.threadID ||
        !canSendAssistantThreadMessage(targetThread) ||
        isSending ||
        isGenerating
      ) {
        return {
          success: false,
          error: "Please wait until the assistant is ready to receive your answers.",
        };
      }

      setErrorMessage(null);

      if (!isRetry) {
        const lastSequence =
          targetThread.threadID === thread?.threadID
            ? (messages.at(-1)?.sequence ?? 0)
            : 0;

        setOptimisticMessage(
          createOptimisticAssistantMessage({
            clientMessageID: request.clientMessageID,
            message: request.message,
            sequence: lastSequence + 1,
          }),
        );
      } else {
        setOptimisticMessage((current) =>
          current?.messageID === request.clientMessageID
            ? {
                ...current,
                status: "PENDING",
                errorCode: null,
              }
            : current,
        );
      }

      const args: SendAssistantMessageArgs = {
        surveyID: assistantSurveyID,
        threadID: targetThread.threadID,
        clientMessageID: request.clientMessageID,
        message: request.message,
      };

      try {
        const response = await sendAssistantMessage(args).unwrap();

        handledJobIDRef.current = null;
        setActiveJobID(response.jobID);
        setAssistantActiveJobID(assistantSurveyID, response.jobID);

        setThread((current) =>
          current?.threadID === targetThread.threadID
            ? {
                ...current,
                stage: "PROCESSING",
              }
            : current,
        );
        return { success: true };
      } catch (error) {
        const parsedError = parseAssistantApiError(
          error,
          "The message could not be sent.",
        );

        setErrorMessage(parsedError.message, parsedError);

        setOptimisticMessage((current) =>
          current?.messageID === request.clientMessageID
            ? {
                ...current,
                status: "FAILED",
                errorCode: parsedError.code,
              }
            : current,
        );
        return { success: false, error: parsedError.message };
      }
    },
    [
      assistantSurveyID,
      isGenerating,
      isSending,
      messages,
      sendAssistantMessage,
      thread,
    ],
  );

  const sendMessageWithResult = useCallback(
    async (message: string): Promise<AssistantMessageSubmissionResult> => {
      const normalizedMessage = message.trim();

      if (!normalizedMessage) {
        setErrorMessage("Enter a message before sending.");
        return { success: false, error: "Enter a message before sending." };
      }

      if (normalizedMessage.length > 10_000) {
        setErrorMessage("Messages cannot contain more than 10,000 characters.");
        return {
          success: false,
          error: "Messages cannot contain more than 10,000 characters.",
        };
      }

      if (!canSendMessages) {
        return {
          success: false,
          error: "Please wait until the assistant is ready to receive your answers.",
        };
      }

      if (
        pendingMessage?.message === normalizedMessage &&
        optimisticMessage?.messageID === pendingMessage.clientMessageID &&
        optimisticMessage.status === "FAILED"
      ) {
        return submitMessageRequest(pendingMessage, true, thread);
      }

      const request: PendingMessageRequest = {
        clientMessageID: crypto.randomUUID(),
        message: normalizedMessage,
      };

      setPendingMessage(request);
      return submitMessageRequest(request, false, thread);
    },
    [canSendMessages, optimisticMessage, pendingMessage, submitMessageRequest, thread],
  );

  const sendMessage = useCallback(
    async (message: string) => {
      await sendMessageWithResult(message);
    },
    [sendMessageWithResult],
  );

  const retryMessage = useCallback(async () => {
    if (
      !pendingMessage ||
      !canSendMessages ||
      isSending ||
      isGenerating ||
      isCommitting
    ) {
      return;
    }

    await submitMessageRequest(pendingMessage, true);
  }, [
    isCommitting,
    isGenerating,
    isSending,
    canSendMessages,
    pendingMessage,
    submitMessageRequest,
  ]);

  useEffect(() => {
    if (!activeJob || activeJob.jobID !== activeJobID) return;

    if (activeJob.status === "PENDING" || activeJob.status === "PROCESSING") {
      return;
    }

    if (handledJobIDRef.current === activeJob.jobID) {
      return;
    }

    handledJobIDRef.current = activeJob.jobID;
    setActiveJobID(null);
    clearAssistantActiveJobID(assistantSurveyID);

    void (async () => {
      let responseReloadFailed = false;

      try {
        await refreshThreadAndMessages();
      } catch (error) {
        responseReloadFailed = true;
        const parsedError = parseAssistantApiError(
          error,
          "The assistant finished, but its response could not be loaded.",
        );

        setErrorMessage(parsedError.message, parsedError);
      } finally {
        setOptimisticMessage(null);
      }

      if (activeJob.status === "COMPLETED") {
        setPendingMessage(null);
        if (!responseReloadFailed) setErrorMessage(null);
        return;
      }

      if (!responseReloadFailed) setErrorMessage(null);
      setMessages((current) => {
        const latestMessage = current.at(-1);

        if (latestMessage && isAssistantFailureLikeMessage(latestMessage)) {
          return current;
        }

        return mergeAssistantMessages(current, [
          createAssistantFailureMessage(
            activeJob,
            (latestMessage?.sequence ?? 0) + 1,
          ),
        ]);
      });
    })();
  }, [activeJob, activeJobID, assistantSurveyID, refreshThreadAndMessages]);

  useEffect(() => {
    if (!activeJobError || !activeJobID) return;

    const parsedError = parseAssistantApiError(
      activeJobError,
      "Unable to check the assistant job status.",
    );

    setErrorMessage(parsedError.message, parsedError);
  }, [activeJobError, activeJobID]);

  const loadOlderMessages = useCallback(async () => {
    if (
      !thread?.threadID ||
      !hasMoreMessages ||
      nextBeforeSequence === null ||
      isLoadingOlder
    ) {
      return;
    }

    setIsLoadingOlder(true);

    try {
      const response = await getMessages({
        surveyID: assistantSurveyID,
        threadID: thread.threadID,
        limit: ASSISTANT_MESSAGE_PAGE_SIZE,
        beforeSequence: nextBeforeSequence,
      }).unwrap();

      setMessages((current) =>
        mergeAssistantMessages(response.messages, current),
      );
      setHasMoreMessages(response.hasMore);
      setNextBeforeSequence(response.nextBeforeSequence);
    } catch (error) {
      const parsedError = parseAssistantApiError(
        error,
        "Older assistant messages could not be loaded.",
      );

      setErrorMessage(parsedError.message, parsedError);
    } finally {
      setIsLoadingOlder(false);
    }
  }, [
    getMessages,
    hasMoreMessages,
    isLoadingOlder,
    nextBeforeSequence,
    assistantSurveyID,
    thread?.threadID,
  ]);

  const commitDraft = useCallback(
    async (draftVersion: number) => {
      if (
        !thread?.threadID ||
        thread.status !== "ACTIVE" ||
        invalidDraftVersions.includes(draftVersion) ||
        isAssistantThreadProcessing(thread) ||
        isAssistantThreadCommitted(thread) ||
        isAssistantThreadReadOnly(thread) ||
        isCommitting ||
        isGenerating ||
        isSending
      ) {
        return;
      }

      const existingRequest = pendingCommitRef.current;

      const request =
        existingRequest?.draftVersion === draftVersion
          ? existingRequest
          : {
              draftVersion,
              idempotencyKey: crypto.randomUUID(),
            };

      pendingCommitRef.current = request;
      setErrorMessage(null);

      try {
        await commitAssistantDraft({
          surveyID: assistantSurveyID,
          threadID: thread.threadID,
          expectedVersion: request.draftVersion,
          idempotencyKey: request.idempotencyKey,
        }).unwrap();

        pendingCommitRef.current = null;

        await refreshThreadAndMessages();
        await Promise.resolve(refetchCanvas());

        dispatch(setAiQuestionsJustAdded());
      } catch (error) {
        const parsedError = parseAssistantApiError(
          error,
          "The survey changes could not be applied.",
        );

        const isStalePreview = isAssistantStalePreviewError(parsedError);

        if (isStalePreview) {
          pendingCommitRef.current = null;
          setInvalidDraftVersions((current) =>
            current.includes(draftVersion)
              ? current
              : [...current, draftVersion],
          );

          try {
            await refreshThreadAndMessages();
          } catch {
            // The original commit error remains visible.
          }
        }

        // Stale previews show their warning beside the affected approval control.
        setErrorMessage(isStalePreview ? null : parsedError.message, parsedError);
      }
    },
    [
      commitAssistantDraft,
      invalidDraftVersions,
      dispatch,
      isCommitting,
      isGenerating,
      isSending,
      refetchCanvas,
      refreshThreadAndMessages,
      assistantSurveyID,
      thread,
    ],
  );

  const createNewThread = useCallback(async () => {
    if (
      !assistantSurveyID ||
      createThreadInFlightRef.current ||
      isInitializing ||
      isSending ||
      isGenerating ||
      isCommitting
    ) {
      return;
    }

    setIsInitializing(true);
    setErrorMessage(null);

    try {
      const createdThread = await createAndStoreThread();

      if (!createdThread) return;

      handledJobIDRef.current = null;
      pendingCommitRef.current = null;

      setThread(createdThread);
      setInvalidDraftVersions([]);
      setMessages([]);
      setOptimisticMessage(null);
      setPendingMessage(null);
      setActiveJobID(null);
      setHasMoreMessages(false);
      setNextBeforeSequence(null);

      try {
        await loadInitialMessages(createdThread.threadID);
      } catch (error) {
        const parsedError = parseAssistantApiError(
          error,
          "The new chat was created, but its messages could not be loaded.",
        );

        setErrorMessage(parsedError.message, parsedError);
      }
    } catch (error) {
      const parsedError = parseAssistantApiError(
        error,
        "A new assistant thread could not be created.",
      );

      setErrorMessage(
        parsedError.status === 409 &&
          parsedError.code === "SURVEY_BUILDER_THREAD_BUSY"
          ? "Please wait for the current operation to finish before starting a new chat."
          : parsedError.message,
        parsedError,
      );
    } finally {
      setIsInitializing(false);
    }
  }, [
    createAndStoreThread,
    isCommitting,
    isGenerating,
    isInitializing,
    isSending,
    loadInitialMessages,
    assistantSurveyID,
  ]);

  const clearError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const onNew = useCallback(
    async (message: AppendMessage) => {
      const text = getAssistantAppendMessageText(message);

      if (!text) return;

      await sendMessage(text);
    },
    [sendMessage],
  );

  const runtime = useExternalStoreRuntime({
    messages: displayMessages,
    isRunning: isSending || isGenerating,
    convertMessage: convertAssistantMessageToRuntime,
    onNew,
  });

  const contextValue = useMemo(
    () => ({
      thread,
      messages: displayMessages,
      isInitializing,
      isSending,
      isGenerating,
      isCommitting,
      isLoadingOlder,
      hasMoreMessages,
      canSendMessages,
      invalidDraftVersions,
      errorMessage,
      errorNotice,
      sendMessage,
      sendMessageWithResult,
      retryMessage,
      loadOlderMessages,
      commitDraft,
      createNewThread,
      clearError,
    }),
    [
      canSendMessages,
      clearError,
      commitDraft,
      createNewThread,
      displayMessages,
      errorMessage,
      errorNotice,
      hasMoreMessages,
      invalidDraftVersions,
      isCommitting,
      isGenerating,
      isInitializing,
      isLoadingOlder,
      isSending,
      loadOlderMessages,
      retryMessage,
      sendMessage,
      sendMessageWithResult,
      thread,
    ],
  );

  return (
    <SurveyBuilderAssistantContext.Provider value={contextValue}>
      <AssistantRuntimeProvider runtime={runtime}>
        {children}
      </AssistantRuntimeProvider>
    </SurveyBuilderAssistantContext.Provider>
  );
};
