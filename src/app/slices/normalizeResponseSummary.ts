import {
  NormalizedQuestion,
  ResponsesSummaryResponse,
} from "../../utils/insightTypes";

export function normalizeResponsesSummary(
  api: ResponsesSummaryResponse,
): NormalizedQuestion[] {
  return api.questions.map((q) => {
    switch (q.type) {
      case "BINARY":
      case "THREE_D":
        return {
          questionID: q.questionID,
          type: q.type,
          order: q.order,
          text: q.text,
          meta: {
            totalResponses: q.totalAnswered ?? 0,
            skipped: q.skippedCount ?? 0,
          },
          result: {
            left: {
              label: q.labels?.left ?? "Yes",
              count: q.counts?.left ?? 0,
            },
            right: {
              label: q.labels?.right ?? "No",
              count: q.counts?.right ?? 0,
            },
          },
        };

      case "RADIO":
      case "MULTIPLE_CHOICE":
      case "MEDIA":
        return {
          questionID: q.questionID,
          type: q.type,
          order: q.order,
          text: q.text,
          meta: {
            totalResponses: q.total ?? q.totalRespondents ?? 0,
            skipped: q.skippedCount ?? 0,
          },
          result: {
            options: q.options,
          },
        };

      case "NUMBER":
        return {
          questionID: q.questionID,
          type: q.type,
          order: q.order,
          text: q.text,
          meta: {
            totalResponses: q.total ?? 0,
            skipped: q.skippedCount ?? 0,
          },
          result: {
            ...q.stats,
            distribution: q.distribution,
          },
        };

      case "RANGE":
        return {
          questionID: q.questionID,
          type: q.type,
          order: q.order,
          text: q.text,
          meta: {
            totalResponses: q.total ?? 0,
            skipped: q.skippedCount ?? 0,
          },
          result: {
            scale: q.scale,
            mean: q.mean,
            median: q.median,
            stdDev: q.stdDev,
            distribution: q.distribution,
          },
        };

      case "RANK":
        return {
          questionID: q.questionID,
          type: q.type,
          order: q.order,
          text: q.text,
          meta: {
            totalResponses: q.total ?? 0,
            skipped: q.skippedCount ?? 0,
          },
          result: {
            options: q.options,
          },
        };

      case "TEXT":
        return {
          questionID: q.questionID,
          type: q.type,
          order: q.order,
          text: q.text,
          meta: {
            totalResponses: q.total ?? 0,
            skipped: q.skippedCount ?? 0,
          },
          result: {
            total: q.total,
            page: q.page,
            pageSize: q.pageSize,
            responses: q?.responses?.map((r) => ({
              responseID: r.responseID,
              text: r.text,
              createdAt: r.createdAt,
            })),
          },
        };
    }
  });
}
