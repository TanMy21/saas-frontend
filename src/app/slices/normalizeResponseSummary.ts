import {
  ResponsesSummaryResponse,
  SummaryQuestion,
} from "../../types/insightTypes";

export function normalizeResponsesSummary(
  api: ResponsesSummaryResponse,
): SummaryQuestion[] {
  const questions = Array.isArray(api.questions) ? api.questions : [];

  return questions
    .map((q): SummaryQuestion | null => {
      if (!q || !q.questionID || !q.type) return null;

      const base = {
        questionID: q.questionID,
        type: q.type,
        order: q.order,
        text: q.text,
      };

      switch (q.type) {
        case "BINARY":
        case "THREE_D":
          return {
            ...base,
            type: q.type,
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
          return {
            ...base,
            type: "RADIO",
            meta: {
              totalResponses: q.total ?? 0,
              skipped: q.skippedCount ?? 0,
            },
            result: {
              options: q.options ?? [],
            },
          };

        case "DROPDOWN":
          return {
            ...base,
            type: "DROPDOWN",
            meta: {
              totalResponses: q.total ?? 0,
              skipped: q.skippedCount ?? 0,
            },
            result: {
              options: q.options ?? [],
            },
          };

        case "TIMED_CHOICE":
          return {
            ...base,
            type: "TIMED_CHOICE",
            meta: {
              totalResponses: q.total ?? 0,
              skipped: q.skippedCount ?? 0,
            },
            result: {
              displayMode: q.displayMode ?? "TEXT",
              displayModeCounts: q.displayModeCounts ?? {},
              options: q.options ?? [],
              timing: q.timing ?? {
                meanResponseTimeMs: 0,
                medianResponseTimeMs: 0,
                minResponseTimeMs: 0,
                maxResponseTimeMs: 0,
                stdDevResponseTimeMs: 0,
                overTimeCount: 0,
                overTimePercentage: 0,
              },
            },
          };

        case "CONCEPT_FIT":
          return {
            ...base,
            type: "CONCEPT_FIT",
            meta: {
              totalResponses: q.totalSubmissions ?? q.total ?? 0,
              skipped: q.skippedCount ?? 0,
            },
            result: {
              labels: q.labels ?? {
                left: "Fits",
                right: "Doesn't fit",
              },
              counts: q.counts ?? {
                left: 0,
                right: 0,
              },
              percentages: q.percentages ?? {
                left: 0,
                right: 0,
              },
              timing: q.timing ?? {
                meanResponseTimeMs: 0,
                medianResponseTimeMs: 0,
                minResponseTimeMs: 0,
                maxResponseTimeMs: 0,
                stdDevResponseTimeMs: 0,
              },
              attributes: q.attributes ?? [],
              totalSubmissions: q.totalSubmissions ?? q.total ?? 0,
              completedCount: q.completedCount ?? 0,
              completionPercentage: q.completionPercentage ?? 0,
              totalAttributeResponses: q.totalAttributeResponses ?? 0,
            },
          };

        case "IAT":
          return {
            ...base,
            type: "IAT",
            meta: {
              totalResponses: q.totalSubmissions ?? q.total ?? 0,
              skipped: q.skippedCount ?? 0,
            },
            result: {
              totalSubmissions: q.totalSubmissions ?? q.total ?? 0,
              completedCount: q.completedCount ?? 0,
              completionPercentage: q.completionPercentage ?? 0,
              skippedCount: q.skippedCount ?? 0,

              totalTrials: q.totalTrials ?? 0,
              errorTrials: q.errorTrials ?? 0,
              errorRate: q.errorRate ?? 0,

              timing: q.timing ?? {
                meanResponseTimeMs: 0,
                medianResponseTimeMs: 0,
                minResponseTimeMs: 0,
                maxResponseTimeMs: 0,
                stdDevResponseTimeMs: 0,
              },

              rounds: q.rounds ?? {
                initial: {
                  totalTrials: 0,
                  meanResponseTimeMs: 0,
                  medianResponseTimeMs: 0,
                  stdDevResponseTimeMs: 0,
                },
                reversed: {
                  totalTrials: 0,
                  meanResponseTimeMs: 0,
                  medianResponseTimeMs: 0,
                  stdDevResponseTimeMs: 0,
                },
              },

              comparison: q.comparison ?? {
                averageDifferenceMs: 0,
                medianDifferenceMs: 0,
                associationDirection: "NEUTRAL",
                strength: "NEUTRAL",
              },

              pairingStrategies: q.pairingStrategies ?? {},
              schemaVersions: q.schemaVersions ?? {},
            },
          };

        case "MULTIPLE_CHOICE":
          return {
            ...base,
            type: "MULTIPLE_CHOICE",
            meta: {
              totalResponses: q.totalRespondents ?? q.total ?? 0,
              skipped: q.skippedCount ?? 0,
            },
            result: {
              options: q.options ?? [],
            },
          };

        case "MEDIA":
          return {
            ...base,
            type: "MEDIA",
            meta: {
              totalResponses: q.totalRespondents ?? q.total ?? 0,
              skipped: q.skippedCount ?? 0,
            },
            result: {
              options: q.options ?? [],
            },
          };

        case "NUMBER":
          return {
            ...base,
            type: "NUMBER",
            meta: {
              totalResponses: q.total ?? 0,
              skipped: q.skippedCount ?? 0,
            },
            result: {
              mean: q.stats?.mean ?? 0,
              median: q.stats?.median ?? 0,
              min: q.stats?.min ?? 0,
              max: q.stats?.max ?? 0,
              stdDev: q.stats?.stdDev ?? 0,
              distribution: q.distribution ?? [],
            },
          };

        case "RANGE":
          return {
            ...base,
            type: "RANGE",
            meta: {
              totalResponses: q.total ?? 0,
              skipped: q.skippedCount ?? 0,
            },
            result: {
              scale: q.scale ?? 5,
              mean: q.mean ?? 0,
              median: q.median ?? 0,
              stdDev: q.stdDev ?? 0,
              distribution: q.distribution ?? [],
            },
          };

        case "RANK":
          return {
            ...base,
            type: "RANK",
            meta: {
              totalResponses: q.total ?? 0,
              skipped: q.skippedCount ?? 0,
            },
            options: q.options ?? [],
            total: q.total ?? 0,
            skippedCount: q.skippedCount ?? 0,
          };

        case "TEXT":
          return {
            ...base,
            type: "TEXT",
            meta: {
              totalResponses: q.total ?? 0,
              skipped: q.skippedCount ?? 0,
            },
            total: q.total ?? 0,
            page: q.page ?? 1,
            pageSize: q.pageSize ?? 25,
            responses:
              q.responses?.map((r) => ({
                responseID: r.responseID,
                text: r.text,
                createdAt: r.createdAt,
              })) ?? [],
          };

        default:
          return null;
      }
    })
    .filter((q): q is SummaryQuestion => q !== null);
}
