import { type TableCellProps } from "@mui/material";
import { type LucideIcon } from "lucide-react";

import { ColoredClickedMeshArea } from "../types/behaviorTypes";
import { Question, QuestionType } from "../utils/types";

type DistributionItem = { label: string; percent: number };

export type GetInsightsArgs = {
  surveyID: string;
  time: "all" | "week" | "month" | "custom";
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

export type ResponseRecord = Record<string, unknown>;

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

export interface NormalizedResponsesSummaryResponse {
  surveyID: string;
  filters: {
    deviceType: string;
    range: string;
    from?: string | null;
    to?: string | null;
  };
  questions: SummaryQuestion[];
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

  displayMode?: "TEXT" | "TEXT_IMAGE";
  displayModeCounts?: Record<string, number>;
  timing?: TimedChoiceTiming;

  percentages?: {
    left: number;
    right: number;
  };

  attributes?: ConceptFitAttributeSummary[];
  totalSubmissions?: number;
  completedCount?: number;
  completionPercentage?: number;
  totalAttributeResponses?: number;

  totalTrials?: number;
  errorTrials?: number;
  errorRate?: number;

  rounds?: {
    initial: IATRoundSummary;
    reversed: IATRoundSummary;
  };

  comparison?: IATComparison;

  pairingStrategies?: Record<string, number>;
  schemaVersions?: Record<string, number>;

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

export interface DropdownChoiceOption {
  optionID: string;
  label: string;
  count: number;
  percentage: number;
}

export interface DropdownChoiceResult {
  options: DropdownChoiceOption[];
}

export interface DropdownChoiceQuestion extends NormalizedQuestion {
  type: "DROPDOWN";
  result: DropdownChoiceResult;
}

export interface DropdownChoiceChartProps {
  question: DropdownChoiceQuestion;
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

export interface ThreeDQuestion {
  surveyID: string;
  type: "THREE_D";
  questionID: string;
  title?: string;
  questionText?: string;
  responses?: any[];
}

export interface ThreeDOptionChartProps {
  question: BinaryQuestion;
  surveyID: string;
}

export interface TextResponsesProps {
  question: TextQuestion;
}

export interface TimedChoiceOption {
  optionID: string;
  label: string;
  value?: string | null;
  image?: string | null;
  count: number;
  percentage: number;
  avgResponseTimeMs: number;
  medianResponseTimeMs: number;
  overTimeCount: number;
  overTimePercentage: number;
}

export interface TimedChoiceTiming {
  meanResponseTimeMs: number;
  medianResponseTimeMs: number;
  minResponseTimeMs: number;
  maxResponseTimeMs: number;
  stdDevResponseTimeMs: number;
  overTimeCount: number;
  overTimePercentage: number;
}

export interface TimedChoiceResult {
  displayMode: "TEXT" | "TEXT_IMAGE";
  displayModeCounts?: Record<string, number>;
  options: TimedChoiceOption[];
  timing: TimedChoiceTiming;
}

export interface TimedChoiceQuestion extends NormalizedQuestion {
  type: "TIMED_CHOICE";
  result: TimedChoiceResult;
}

export interface TimedChoiceChartProps {
  question: TimedChoiceQuestion;
}

export interface ConceptFitAttributeSummary {
  attributeOptionID: string | null;
  attributeText: string;
  counts: {
    left: number;
    right: number;
  };
  percentages: {
    left: number;
    right: number;
  };
  total: number;
  avgResponseTimeMs: number;
  medianResponseTimeMs: number;
}

export interface ConceptFitTiming {
  meanResponseTimeMs: number;
  medianResponseTimeMs: number;
  minResponseTimeMs: number;
  maxResponseTimeMs: number;
  stdDevResponseTimeMs: number;
}

export interface ConceptFitResult {
  labels: {
    left: string;
    right: string;
  };
  counts: {
    left: number;
    right: number;
  };
  percentages: {
    left: number;
    right: number;
  };
  timing: ConceptFitTiming;
  attributes: ConceptFitAttributeSummary[];
  totalSubmissions: number;
  completedCount: number;
  completionPercentage: number;
  totalAttributeResponses: number;
}

export interface ConceptFitQuestion extends NormalizedQuestion {
  type: "CONCEPT_FIT";
  result: ConceptFitResult;
}

export interface ConceptFitSummaryChartProps {
  question: ConceptFitQuestion;
}

export interface IATTiming {
  meanResponseTimeMs: number;
  medianResponseTimeMs: number;
  minResponseTimeMs: number;
  maxResponseTimeMs: number;
  stdDevResponseTimeMs: number;
}

export interface IATRoundSummary {
  totalTrials: number;
  meanResponseTimeMs: number;
  medianResponseTimeMs: number;
  stdDevResponseTimeMs: number;
}

export interface IATComparison {
  averageDifferenceMs: number;
  medianDifferenceMs: number;
  associationDirection:
    | "BRAND_A_WITH_THEME_A"
    | "BRAND_A_WITH_THEME_B"
    | "NEUTRAL";
  strength: "STRONG" | "MODERATE" | "WEAK" | "NEUTRAL";
}

export interface IATResult {
  totalSubmissions: number;
  completedCount: number;
  completionPercentage: number;
  skippedCount: number;

  totalTrials: number;
  errorTrials: number;
  errorRate: number;

  timing: IATTiming;

  rounds: {
    initial: IATRoundSummary;
    reversed: IATRoundSummary;
  };

  comparison: IATComparison;

  pairingStrategies: Record<string, number>;
  schemaVersions: Record<string, number>;
}

export interface IATQuestion extends NormalizedQuestion {
  type: "IAT";
  result: IATResult;
}

export interface IATSummaryChartProps {
  question: IATQuestion;
}

export type SummaryQuestion =
  | BinaryQuestion
  | ConceptFitQuestion
  | DropdownChoiceQuestion
  | SingleChoiceQuestion
  | IATQuestion
  | MultipleChoiceQuestion
  | MediaQuestion
  | NumberQuestion
  | RangeQuestion
  | RankQuestion
  | TextQuestion
  | TimedChoiceQuestion;

export interface QuestionSectionProps {
  surveyID: string;
  question: SummaryQuestion;
}

export interface QuestionTypeBadgeProps {
  type: QuestionType;
  className?: string;
}

export type SummaryVisualizationProps = {
  question: SummaryQuestion;
  surveyID: string;
};

export type SummaryVisualizationComponent = React.FC<SummaryVisualizationProps>;

export type ClickedMeshArea = {
  label: string;
  meshName: string;
  materialName: string | null;
  clickCount: number;
};

export type SurfaceClickSample = {
  t: number;
  meshName: string | null;
  materialName: string | null;
  faceIndex: number | null;
  screenZoneId?: string | null;
  point: {
    x: number;
    y: number;
    z: number;
  };
};

export type ThreeDResultBehaviorViewerProps = {
  modelUrl?: string;
  clickedMeshes: ColoredClickedMeshArea[];
  surfaceClickSamples?: SurfaceClickSample[];
  height?: number;
  autoRotate?: boolean;
};
