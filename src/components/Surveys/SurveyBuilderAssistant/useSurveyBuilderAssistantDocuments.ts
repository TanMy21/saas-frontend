import { useCallback, useEffect, useRef, useState } from "react";

import {
  useDeleteSurveyBuilderAssistantDocumentMutation,
  useLazyGetSurveyBuilderAssistantDocumentQuery,
  useUploadSurveyBuilderAssistantDocumentMutation,
} from "../../../app/slices/surveyBuilderAssistantApiSlice";
import type {
  AssistantComposerDocument,
  AssistantDocument,
  AssistantDocumentStatus,
  AssistantThread,
} from "../../../types/surveyBuilderAssistant.types";

import { parseAssistantApiError } from "./SurveyBuilderAssistantAdapters";

const MAX_DOCUMENTS_PER_MESSAGE = 3;
const MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024;
const DOCUMENT_POLL_INTERVAL_MS = 1_500;
const DOCUMENT_MAX_POLL_ATTEMPTS = 200;
const DOCUMENT_MAX_CONSECUTIVE_POLL_ERRORS = 3;

const DOCUMENT_MIME_BY_EXTENSION: Record<string, string> = {
  ".pdf": "application/pdf",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".txt": "text/plain",
};

const PROCESSING_DOCUMENT_STATUSES = new Set<AssistantDocumentStatus>([
  "UPLOADING",
  "PENDING_SCAN",
  "SCANNING",
  "ANALYZING",
]);

const RETRYABLE_DOCUMENT_STATUSES = new Set<
  AssistantComposerDocument["status"]
>(["UPLOAD_FAILED", "POLLING_FAILED", "SCAN_FAILED", "ANALYSIS_FAILED"]);

const wait = (milliseconds: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });

const getFileExtension = (fileName: string) => {
  const extensionIndex = fileName.lastIndexOf(".");

  return extensionIndex >= 0
    ? fileName.slice(extensionIndex).toLowerCase()
    : "";
};

const getDocumentFailureMessage = (document: AssistantDocument) => {
  if (document.errorMessage?.trim()) return document.errorMessage;

  if (document.status === "REJECTED") {
    return "This document did not pass the security scan.";
  }

  if (document.status === "SCAN_FAILED") {
    return "The document security scan could not be completed.";
  }

  if (document.status === "ANALYSIS_FAILED") {
    return "The document could not be analyzed.";
  }

  return null;
};

interface UseSurveyBuilderAssistantDocumentsArgs {
  thread: AssistantThread | null;
  canManageDocuments: boolean;
  onError: (message: string) => void;
  onDocumentReady: () => void | Promise<void>;
}

export const useSurveyBuilderAssistantDocuments = ({
  thread,
  canManageDocuments,
  onError,
  onDocumentReady,
}: UseSurveyBuilderAssistantDocumentsArgs) => {
  const [composerDocuments, setComposerDocuments] = useState<
    AssistantComposerDocument[]
  >([]);
  const documentsRef = useRef<AssistantComposerDocument[]>([]);
  const operationGenerationRef = useRef(0);
  const cancelledClientDocumentIDsRef = useRef(new Set<string>());

  const [uploadDocument] = useUploadSurveyBuilderAssistantDocumentMutation();
  const [getDocument] = useLazyGetSurveyBuilderAssistantDocumentQuery();
  const [deleteDocument] = useDeleteSurveyBuilderAssistantDocumentMutation();

  const updateDocuments = useCallback(
    (
      updater: (
        current: AssistantComposerDocument[],
      ) => AssistantComposerDocument[],
    ) => {
      setComposerDocuments((current) => {
        const next = updater(current);
        documentsRef.current = next;
        return next;
      });
    },
    [],
  );

  const updateDocument = useCallback(
    (
      clientDocumentID: string,
      updater: (
        current: AssistantComposerDocument,
      ) => AssistantComposerDocument,
    ) => {
      updateDocuments((current) =>
        current.map((document) =>
          document.clientDocumentID === clientDocumentID
            ? updater(document)
            : document,
        ),
      );
    },
    [updateDocuments],
  );

  useEffect(() => {
    operationGenerationRef.current += 1;
    cancelledClientDocumentIDsRef.current.clear();
    updateDocuments(() => []);
  }, [thread?.threadID, updateDocuments]);

  useEffect(
    () => () => {
      operationGenerationRef.current += 1;
    },
    [],
  );

  const deleteRemoteDocument = useCallback(
    async ({
      surveyID,
      threadID,
      documentID,
      reportError,
    }: {
      surveyID: string;
      threadID: string;
      documentID: string;
      reportError: boolean;
    }) => {
      try {
        await deleteDocument({ surveyID, threadID, documentID }).unwrap();
      } catch (error) {
        if (!reportError) return;

        onError(
          parseAssistantApiError(
            error,
            "The document could not be removed. Please try again.",
          ).message,
        );
      }
    },
    [deleteDocument, onError],
  );

  const pollDocument = useCallback(
    async ({
      clientDocumentID,
      documentID,
      file,
      generation,
      surveyID,
      threadID,
    }: {
      clientDocumentID: string;
      documentID: string;
      file: File;
      generation: number;
      surveyID: string;
      threadID: string;
    }) => {
      let consecutiveErrors = 0;

      for (
        let attempt = 0;
        attempt < DOCUMENT_MAX_POLL_ATTEMPTS;
        attempt += 1
      ) {
        await wait(DOCUMENT_POLL_INTERVAL_MS);

        if (
          generation !== operationGenerationRef.current ||
          cancelledClientDocumentIDsRef.current.has(clientDocumentID)
        ) {
          return;
        }

        try {
          const response = await getDocument(
            { surveyID, threadID, documentID },
            false,
          ).unwrap();
          const remoteDocument = response.document;

          consecutiveErrors = 0;

          updateDocument(clientDocumentID, () => ({
            clientDocumentID,
            documentID: remoteDocument.documentID,
            file,
            fileName: remoteDocument.fileName,
            mimeType: remoteDocument.mimeType,
            sizeBytes: remoteDocument.sizeBytes,
            status: remoteDocument.status,
            errorMessage: getDocumentFailureMessage(remoteDocument),
          }));

          if (remoteDocument.status === "READY") {
            void onDocumentReady();
            return;
          }

          if (!PROCESSING_DOCUMENT_STATUSES.has(remoteDocument.status)) return;
        } catch (error) {
          consecutiveErrors += 1;

          if (consecutiveErrors < DOCUMENT_MAX_CONSECUTIVE_POLL_ERRORS) {
            continue;
          }

          updateDocument(clientDocumentID, (current) => ({
            ...current,
            status: "POLLING_FAILED",
            errorMessage: parseAssistantApiError(
              error,
              "Document processing status could not be checked.",
            ).message,
          }));
          return;
        }
      }

      updateDocument(clientDocumentID, (current) => ({
        ...current,
        status: "POLLING_FAILED",
        errorMessage:
          "Document processing is taking longer than expected. Try again to check its status.",
      }));
    },
    [getDocument, onDocumentReady, updateDocument],
  );

  const processUpload = useCallback(
    async (
      localDocument: AssistantComposerDocument,
      targetThread: AssistantThread,
      generation: number,
    ) => {
      try {
        const response = await uploadDocument({
          surveyID: targetThread.surveyID,
          threadID: targetThread.threadID,
          clientDocumentID: localDocument.clientDocumentID,
          document: localDocument.file,
        }).unwrap();
        const remoteDocument = response.document;

        if (
          generation !== operationGenerationRef.current ||
          cancelledClientDocumentIDsRef.current.has(
            localDocument.clientDocumentID,
          )
        ) {
          await deleteRemoteDocument({
            surveyID: targetThread.surveyID,
            threadID: targetThread.threadID,
            documentID: remoteDocument.documentID,
            reportError: false,
          });
          return;
        }

        updateDocument(localDocument.clientDocumentID, () => ({
          clientDocumentID: localDocument.clientDocumentID,
          documentID: remoteDocument.documentID,
          file: localDocument.file,
          fileName: remoteDocument.fileName,
          mimeType: remoteDocument.mimeType,
          sizeBytes: remoteDocument.sizeBytes,
          status: remoteDocument.status,
          errorMessage: getDocumentFailureMessage(remoteDocument),
        }));

        if (remoteDocument.status === "READY") {
          void onDocumentReady();
          return;
        }

        if (PROCESSING_DOCUMENT_STATUSES.has(remoteDocument.status)) {
          await pollDocument({
            clientDocumentID: localDocument.clientDocumentID,
            documentID: remoteDocument.documentID,
            file: localDocument.file,
            generation,
            surveyID: targetThread.surveyID,
            threadID: targetThread.threadID,
          });
        }
      } catch (error) {
        if (
          generation !== operationGenerationRef.current ||
          cancelledClientDocumentIDsRef.current.has(
            localDocument.clientDocumentID,
          )
        ) {
          return;
        }

        updateDocument(localDocument.clientDocumentID, (current) => ({
          ...current,
          status: "UPLOAD_FAILED",
          errorMessage: parseAssistantApiError(
            error,
            "The document could not be uploaded. Please try again.",
          ).message,
        }));
      }
    },
    [
      deleteRemoteDocument,
      onDocumentReady,
      pollDocument,
      updateDocument,
      uploadDocument,
    ],
  );

  const selectComposerDocuments = useCallback(
    async (files: File[]) => {
      if (!thread || !canManageDocuments || files.length === 0) return;

      if (
        documentsRef.current.length + files.length >
        MAX_DOCUMENTS_PER_MESSAGE
      ) {
        onError(
          `You can attach up to ${MAX_DOCUMENTS_PER_MESSAGE} documents to one message.`,
        );
        return;
      }

      const validatedFiles: File[] = [];

      for (const file of files) {
        const extension = getFileExtension(file.name);
        const expectedMimeType = DOCUMENT_MIME_BY_EXTENSION[extension];
        const normalizedMimeType = file.type.trim().toLowerCase();

        if (!expectedMimeType || normalizedMimeType !== expectedMimeType) {
          onError("Only PDF, DOCX, and TXT documents are supported.");
          return;
        }

        if (file.size === 0) {
          onError(`${file.name} is empty and cannot be uploaded.`);
          return;
        }

        if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
          onError(`${file.name} exceeds the 10 MB upload limit.`);
          return;
        }

        validatedFiles.push(file);
      }

      const generation = operationGenerationRef.current;
      const newDocuments = validatedFiles.map<AssistantComposerDocument>(
        (file) => ({
          clientDocumentID: crypto.randomUUID(),
          documentID: null,
          file,
          fileName: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
          status: "UPLOADING",
          errorMessage: null,
        }),
      );

      updateDocuments((current) => [...current, ...newDocuments]);

      await Promise.all(
        newDocuments.map((document) =>
          processUpload(document, thread, generation),
        ),
      );
    },
    [canManageDocuments, onError, processUpload, thread, updateDocuments],
  );

  const retryComposerDocument = useCallback(
    async (clientDocumentID: string) => {
      if (!thread || !canManageDocuments) return;

      const document = documentsRef.current.find(
        (candidate) => candidate.clientDocumentID === clientDocumentID,
      );

      if (!document || !RETRYABLE_DOCUMENT_STATUSES.has(document.status)) {
        return;
      }

      cancelledClientDocumentIDsRef.current.delete(clientDocumentID);

      const retryDocument: AssistantComposerDocument = {
        ...document,
        status: "UPLOADING",
        errorMessage: null,
      };

      updateDocument(clientDocumentID, () => retryDocument);

      await processUpload(
        retryDocument,
        thread,
        operationGenerationRef.current,
      );
    },
    [canManageDocuments, processUpload, thread, updateDocument],
  );

  const removeComposerDocument = useCallback(
    async (clientDocumentID: string) => {
      const document = documentsRef.current.find(
        (candidate) => candidate.clientDocumentID === clientDocumentID,
      );

      if (!document) return;

      cancelledClientDocumentIDsRef.current.add(clientDocumentID);
      updateDocuments((current) =>
        current.filter(
          (candidate) => candidate.clientDocumentID !== clientDocumentID,
        ),
      );

      if (thread && document.documentID) {
        await deleteRemoteDocument({
          surveyID: thread.surveyID,
          threadID: thread.threadID,
          documentID: document.documentID,
          reportError: true,
        });
      }
    },
    [deleteRemoteDocument, thread, updateDocuments],
  );

  const clearComposerDocuments = useCallback(() => {
    updateDocuments(() => []);
  }, [updateDocuments]);

  const isPreparingDocuments = composerDocuments.some((document) =>
    PROCESSING_DOCUMENT_STATUSES.has(
      document.status as AssistantDocumentStatus,
    ),
  );

  const hasUnreadyDocuments = composerDocuments.some(
    (document) => document.status !== "READY",
  );

  return {
    composerDocuments,
    isPreparingDocuments,
    hasUnreadyDocuments,
    selectComposerDocuments,
    retryComposerDocument,
    removeComposerDocument,
    clearComposerDocuments,
  };
};
