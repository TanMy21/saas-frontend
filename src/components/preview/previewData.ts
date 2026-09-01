import type { PreviewQuestion, PreviewSurvey } from "./previewTypes";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const hasQuestions = (value: unknown): value is Record<string, unknown> =>
  isRecord(value) && Array.isArray(value.questions);

const findPreviewPayload = (response: unknown): Record<string, unknown> | null => {
  if (!isRecord(response)) return null;

  const data = isRecord(response.data) ? response.data : null;
  const candidates: unknown[] = [
    response.getSurveyPreview,
    response.preview,
    response.survey,
    data?.getSurveyPreview,
    data?.preview,
    data?.survey,
    data,
    response,
  ];

  return candidates.find(hasQuestions) ?? null;
};

export const normalizePreviewResponse = (
  response: unknown,
): PreviewSurvey | null => {
  const payload = findPreviewPayload(response);
  if (!payload) return null;

  const questions = (payload.questions as unknown[]).filter(
    (question): question is PreviewQuestion =>
      isRecord(question) &&
      typeof question.questionID === "string" &&
      typeof question.type === "string",
  );

  return {
    surveyID:
      typeof payload.surveyID === "string" ? payload.surveyID : undefined,
    title: typeof payload.title === "string" ? payload.title : undefined,
    description:
      typeof payload.description === "string"
        ? payload.description
        : undefined,
    questions,
  };
};
