import {
  ParticipantBehaviorDetailResponse,
  ParticipantBehaviorTableResponse,
} from "../../types/behaviorTypes";
import { apiSlice } from "../api/apiSlice";

export const behaviorApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getParticipantsBehavior: builder.query<
      ParticipantBehaviorTableResponse,
      {
        surveyID: string;
        page?: number;
        pageSize?: number;
        preset?: string;
        from?: string;
        to?: string;
        device?: string;
      }
    >({
      query: ({
        surveyID,
        page = 1,
        pageSize = 25,
        preset,
        from,
        to,
        device,
      }) => ({
        url: `/beh/participants/${surveyID}`,
        params: {
          page,
          pageSize,
          preset,
          from,
          to,
          device,
        },
      }),
    }),
    getParticipantBehaviorDetail: builder.query<
      ParticipantBehaviorDetailResponse,
      {
        surveyID: string;
        participantID: string;
      }
    >({
      query: ({ surveyID, participantID }) => ({
        url: `/beh/participants/${surveyID}/${participantID}`,
      }),
    }),
  }),
});

export const {
  useGetParticipantsBehaviorQuery,
  useGetParticipantBehaviorDetailQuery,
} = behaviorApiSlice;
