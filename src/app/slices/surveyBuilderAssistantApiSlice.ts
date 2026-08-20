import {
  AssistantJob,
  AssistantMessagesResponse,
  AssistantThread,
  CommitAssistantDraftArgs,
  CommitAssistantDraftResponse,
  GetAssistantJobArgs,
  GetAssistantMessagesArgs,
  GetAssistantThreadArgs,
  SendAssistantMessageArgs,
  SendAssistantMessageResponse,
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

    sendSurveyBuilderAssistantMessage: builder.mutation<
      SendAssistantMessageResponse,
      SendAssistantMessageArgs
    >({
      query: ({ surveyID, threadID, clientMessageID, message }) => ({
        url: `${threadPath(surveyID, threadID)}/messages`,
        method: "POST",
        body: {
          clientMessageID,
          message,
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
  useSendSurveyBuilderAssistantMessageMutation,
  useGetSurveyBuilderAssistantJobQuery,
  useCommitSurveyBuilderAssistantDraftMutation,
} = surveyBuilderAssistantApiSlice;
