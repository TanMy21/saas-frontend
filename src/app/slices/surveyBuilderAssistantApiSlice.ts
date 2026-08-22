import {
  AssistantDocumentResponse,
  AssistantJob,
  AssistantMessagesResponse,
  AssistantThread,
  CommitAssistantDraftArgs,
  CommitAssistantDraftResponse,
  DeleteAssistantDocumentResponse,
  GetAssistantDocumentArgs,
  GetAssistantJobArgs,
  GetAssistantMessagesArgs,
  GetAssistantThreadArgs,
  SendAssistantMessageArgs,
  SendAssistantMessageResponse,
  UploadAssistantDocumentArgs,
  UploadAssistantDocumentResponse,
} from "../../types/surveyBuilderAssistant.types";
import { apiSlice } from "../api/apiSlice";

const threadPath = (surveyID: string, threadID: string) =>
  `/s/survey/${surveyID}/assistant/threads/${threadID}`;

export const surveyBuilderAssistantApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createSurveyBuilderAssistantThread: builder.mutation<
      AssistantThread,
      { surveyID: string }
    >({
      query: ({ surveyID }) => ({
        url: `/s/survey/${surveyID}/assistant/threads`,
        method: "POST",
      }),
    }),

    getSurveyBuilderAssistantThread: builder.query<
      AssistantThread,
      GetAssistantThreadArgs
    >({
      query: ({ surveyID, threadID }) => threadPath(surveyID, threadID),
      keepUnusedDataFor: 0,
    }),

    getSurveyBuilderAssistantMessages: builder.query<
      AssistantMessagesResponse,
      GetAssistantMessagesArgs
    >({
      query: ({ surveyID, threadID, limit = 50, beforeSequence }) => ({
        url: `${threadPath(surveyID, threadID)}/messages`,
        params: {
          limit,
          ...(beforeSequence !== undefined ? { beforeSequence } : {}),
        },
      }),
      keepUnusedDataFor: 0,
    }),

    uploadSurveyBuilderAssistantDocument: builder.mutation<
      UploadAssistantDocumentResponse,
      UploadAssistantDocumentArgs
    >({
      query: ({ surveyID, threadID, clientDocumentID, document }) => {
        const body = new FormData();

        body.append("clientDocumentID", clientDocumentID);
        body.append("document", document);

        return {
          url: `${threadPath(surveyID, threadID)}/documents`,
          method: "POST",
          body,
        };
      },
    }),

    getSurveyBuilderAssistantDocument: builder.query<
      AssistantDocumentResponse,
      GetAssistantDocumentArgs
    >({
      query: ({ surveyID, threadID, documentID }) =>
        `${threadPath(surveyID, threadID)}/documents/${documentID}`,
      keepUnusedDataFor: 0,
    }),

    deleteSurveyBuilderAssistantDocument: builder.mutation<
      DeleteAssistantDocumentResponse,
      GetAssistantDocumentArgs
    >({
      query: ({ surveyID, threadID, documentID }) => ({
        url: `${threadPath(surveyID, threadID)}/documents/${documentID}`,
        method: "DELETE",
      }),
    }),

    sendSurveyBuilderAssistantMessage: builder.mutation<
      SendAssistantMessageResponse,
      SendAssistantMessageArgs
    >({
      query: ({
        surveyID,
        threadID,
        clientMessageID,
        message,
        documentIDs,
      }) => ({
        url: `${threadPath(surveyID, threadID)}/messages`,
        method: "POST",
        body: {
          clientMessageID,
          message,
          ...(documentIDs?.length ? { documentIDs } : {}),
        },
      }),
    }),

    getSurveyBuilderAssistantJob: builder.query<
      AssistantJob,
      GetAssistantJobArgs
    >({
      query: ({ surveyID, threadID, jobID }) =>
        `${threadPath(surveyID, threadID)}/jobs/${jobID}`,
      keepUnusedDataFor: 0,
    }),

    commitSurveyBuilderAssistantDraft: builder.mutation<
      CommitAssistantDraftResponse,
      CommitAssistantDraftArgs
    >({
      query: ({ surveyID, threadID, expectedVersion, idempotencyKey }) => ({
        url: `${threadPath(surveyID, threadID)}/commit`,
        method: "POST",
        body: {
          expectedVersion,
          idempotencyKey,
        },
      }),
      invalidatesTags: ["Elements", "Surveys"],
    }),
  }),
});

export const {
  useCreateSurveyBuilderAssistantThreadMutation,
  useLazyGetSurveyBuilderAssistantThreadQuery,
  useLazyGetSurveyBuilderAssistantMessagesQuery,
  useUploadSurveyBuilderAssistantDocumentMutation,
  useLazyGetSurveyBuilderAssistantDocumentQuery,
  useDeleteSurveyBuilderAssistantDocumentMutation,
  useSendSurveyBuilderAssistantMessageMutation,
  useGetSurveyBuilderAssistantJobQuery,
  useCommitSurveyBuilderAssistantDraftMutation,
} = surveyBuilderAssistantApiSlice;
