import { type TableCellProps } from "@mui/material";
import { type LucideIcon } from "lucide-react";

import { Question, QuestionType } from "./types";

type DistributionItem = { label: string; percent: number };

export type GetInsightsArgs = {
  surveyID: string;
  time: "all" | "week" | "month";
  device: "all" | "mobile" | "desktop" | "tablet";
};

export type TimeFilter = "all" | "week" | "month" | "custom";
export type DeviceFilter = "all" | "mobile" | "desktop" | "tablet";

export type InsightsFilters = {
  time: TimeFilter;
  device: DeviceFilter;
  from?: string;
  to?: string;
};

export type InsightTableColumnConfig = {
  label: string;
  icon?: LucideIcon;
  align?: TableCellProps["align"];
};

export type InsightQuestionRow = {
  id: string;
  number: string;
  text: string;
  type: string;
  reached: number;
  answered: number;

  dropped?: number;
  dropOffRate?: number;
  avgTimeMs?: number;

  distribution?: DistributionItem[];
};

export interface InsightsFilterDropdownProps<T extends string> {
  label: string;
  value: T;
  options: { label: string; value: T }[];
  onChange: (value: T) => void;
  icon: React.ComponentType<any>;
}

export interface SurveyInsightTable {
  questions: InsightQuestionRow[];
}

export interface SummaryHeaderProps {
  title: string;
  totalResponses: number;
  completionRate: number;
}

export interface SummaryControlsProps {
  filters: InsightsFilters;
  setFilters: React.Dispatch<React.SetStateAction<InsightsFilters>>;
}

export interface MockQuestionBeh {
  id: string;
  number: number;
  text: string;
  type: "multiple_choice" | "text" | "rating" | "scale";
  responseRate: number;
  dropOffRate: number;
  avgTimeSpent: number;
}

export interface BehavioralSignals {
  avgHesitationTime: number;
  hesitationPercentage: number;
  avgInteractionDuration: number;
  backtrackPercentage: number;
  focusLossPercentage: number;
  idlePercentage: number;
}

export interface SegmentComparison {
  segment: "completed" | "dropped" | "mobile" | "desktop" | "fast" | "slow";
  signals: BehavioralSignals;
}

export interface BehaviorEvent {
  timestamp: number;
  type:
    | "question_start"
    | "first_interaction"
    | "pause"
    | "blur"
    | "focus"
    | "backtrack"
    | "answer"
    | "idle";
  duration?: number;
  details?: string;
}

export interface Participant {
  id: string;
  startedAt: Date;
  completedAt?: Date;
  status: "completed" | "dropped" | "in_progress";
  device: "mobile" | "desktop";
  responseTime: "fast" | "average" | "slow";
  questionsAnswered: number;
  totalQuestions: number;
  droppedAtQuestion?: number;
  behaviorEvents: BehaviorEvent[];
}

export interface Survey {
  id: string;
  name: string;
  totalResponses: number;
  completionRate: number;
  avgCompletionTime: number;
  questions: Question[];
}

export interface GetResponsesSummaryArgs {
  surveyID: string;

  deviceType?: "all" | "mobile" | "desktop" | "tablet";
  range?: "all" | "week" | "month" | "custom";

  from?: string;
  to?: string;

  q?: string;
  page?: number;
  pageSize?: number;
}

export interface NormalizedQuestion {
  questionID: string;
  type: ResponsesSummaryQuestion["type"];
  order: number;
  text: string;

  meta: {
    totalResponses: number;
    skipped: number;
  };
}

export interface ResponsesSummaryQuestion {
  questionID: string;
  type: QuestionType;
  order: number;
  text: string;

  // backend-dependent fields
  labels?: { left: string; right: string };
  counts?: { left: number; right: number };

  options?: any[];
  stats?: any;
  distribution?: any[];

  total?: number;
  totalSeen?: number;
  totalAnswered?: number;
  totalRespondents?: number;
  totalSelections?: number;
  skippedCount?: number;

  scale?: number;
  mean?: number;
  median?: number;
  stdDev?: number;

  page?: number;
  pageSize?: number;
  responses?: any[];

  meta: {
    totalResponses: number;
    skipped: number;
  };

  result?: unknown;
}

export interface ResponsesSummaryResponse {
  surveyID: string;
  filters: {
    deviceType: string;
    range: string;
    from?: string;
    to?: string;
  };
  questions: ResponsesSummaryQuestion[];
}

export interface BinaryResult {
  left: { label: string; count: number };
  right: { label: string; count: number };
}

export interface BinaryQuestion extends NormalizedQuestion {
  type: "BINARY" | "THREE_D";
  result: BinaryResult;
}

export interface BinaryChartProps {
  question: BinaryQuestion;
}

export interface SingleChoiceOption {
  optionID: string;
  label: string;
  count: number;
  percentage: number;
}

export interface SingleChoiceResult {
  options: SingleChoiceOption[];
}

export interface SingleChoiceQuestion extends NormalizedQuestion {
  type: "RADIO";
  result: SingleChoiceResult;
}

export interface SingleChoiceChartProps {
  question: SingleChoiceQuestion;
}

export interface MultipleChoiceOption {
  optionID: string;
  label: string;
  count: number;
  percentage: number;
}

export interface MultipleChoiceResult {
  options: MultipleChoiceOption[];
}

export interface MultipleChoiceQuestion extends NormalizedQuestion {
  type: "MULTIPLE_CHOICE";
  result: MultipleChoiceResult;
}

export interface MultipleChoiceChartProps {
  question: MultipleChoiceQuestion;
}

export interface MediaOption {
  optionID: string;
  label: string;
  image: string | null;
  count: number;
  percentage: number;
}

export interface MediaResult {
  options: MediaOption[];
}

export interface MediaQuestion extends NormalizedQuestion {
  type: "MEDIA";

  result: MediaResult;
}

export interface MediaOptionsVizProps {
  question: MediaQuestion;
}

// Represents one histogram/bin bucket for numeric responses
export interface NumberDistributionItem {
  min: number;
  max: number;
  count: number;
  percentage: number;
}

// Summary statistics for numeric responses
export interface NumberResult {
  mean: number;
  median: number;
  min: number;
  max: number;
  stdDev: number;
  distribution: NumberDistributionItem[];
}

// Normalized NUMBER question
export interface NumberQuestion extends NormalizedQuestion {
  type: "NUMBER";
  result: NumberResult;
}

export interface NumericChartProps {
  question: NumberQuestion;
}

export interface RangeDistributionItem {
  value: number;
  count: number;
  percentage: number;
}

export interface RangeResult {
  scale: number;
  mean: number;
  median: number;
  stdDev: number;
  distribution: RangeDistributionItem[];
}

export interface RangeQuestion extends NormalizedQuestion {
  type: "RANGE";
  result: RangeResult;
}

export interface ScaleChartProps {
  question: RangeQuestion;
}

export interface RankOption {
  optionID: string;
  label: string;
  avgRank: number;
  firstPlace: number;
  lastPlace: number;
}

export interface RankQuestion extends NormalizedQuestion {
  type: "RANK";
  options: RankOption[];
  total?: number;
  skippedCount?: number;
}

export interface RankingChartProps {
  question: RankQuestion;
}

export interface TextResponseItem {
  responseID: string;
  text: string;
  createdAt: string;
}

export interface TextQuestion extends NormalizedQuestion {
  type: "TEXT";
  total?: number;
  page?: number;
  pageSize?: number;
  responses: TextResponseItem[];
}

export interface TextResponsesProps {
  question: TextQuestion;
}

export type SummaryQuestion =
  | BinaryQuestion
  | SingleChoiceQuestion
  | MultipleChoiceQuestion
  | MediaQuestion
  | NumberQuestion
  | RangeQuestion
  | RankQuestion
  | TextQuestion;

export interface QuestionSectionProps {
  question: SummaryQuestion;
}

export interface QuestionTypeBadgeProps {
  type: QuestionType;
  className?: string;
}
