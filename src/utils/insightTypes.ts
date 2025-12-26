import { Question } from "./types";

type MockQuestionTemp = {
  id: number;
  number: string;
  text: string;
  type: string;
  reached: number;
  answered: number;
  distribution: { label: string; percent: number }[];
};

export interface SurveyInsightTable {
  questions: MockQuestionTemp[];
  onSelect: (question: Question) => void;
}
