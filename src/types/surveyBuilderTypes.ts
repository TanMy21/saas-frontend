import { QuestionTypeKey } from "../utils/types";

export interface ShareTabProps {
  title: string;
  shareURL: string;
  shareID?: string;
  surveyID?: string;
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  trackShareEvent: (args: { surveyID: string; actionType: string }) => void;
}

export type TabType = "link" | "email" | "embed";

 
export type AddMenuItemConfig = {
  label: string;
  type: QuestionTypeKey;
  icon: JSX.Element;
  color: string;
  action: "QUESTION" | "SCREEN";
  disabled?: boolean;
  title?: string;
  professionalOnly?: boolean;
};

export type OrderedSurveyElement = {
  questionID: string;
  type: string;
  order?: number | null;
};


export type InfoScreenRichTextSettingsProps = {
  qID?: string;
};
