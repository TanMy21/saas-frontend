export type PreviewOption = {
  optionID: string;
  text: string;
  value: string;
  order: number;
  image?: string | null;
  imageUrl?: string;
  imageURL?: string;
  public_id?: string | null;
  settings?: Record<string, unknown>;
};

export type PreviewQuestionPreferences = {
  questionBackgroundColor?: string;
  questionImageTemplate?: boolean;
  questionImageTemplateUrl?: string;
  titleFontSize?: number;
  titleFontSizeMobile?: number;
  titleTextColor?: string;
  descriptionFontSize?: number;
  descriptionFontSizeMobile?: number;
  descriptionTextColor?: string;
  uiConfig?: Record<string, unknown>;
};

export type PreviewQuestion = {
  questionID: string;
  type: string;
  text?: string;
  description?: string;
  order?: number;
  showQuestion?: boolean;
  questionImage?: boolean;
  questionImages?: Array<{
    questionImageID?: string;
    imageUrl?: string;
    altText?: string | null;
  }>;
  options?: PreviewOption[];
  questionPreferences?: PreviewQuestionPreferences;
  Model3D?: {
    fileUrl?: string;
    posterUrl?: string;
    showQuestion?: boolean;
  };
};

export type PreviewSurvey = {
  surveyID?: string;
  title?: string;
  description?: string;
  questions: PreviewQuestion[];
};
