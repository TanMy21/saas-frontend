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


export interface SummaryHeaderProps {
  title: string;
  totalResponses: number;
  completionRate: number;
}

export interface SummaryControlsProps {
  displayMode: "count" | "percentage";
  onDisplayModeChange: (mode: "count" | "percentage") => void;
  onFilterClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export interface SingleChoiceChartProps {
  options: { label: string; count: number }[];
  displayMode: "count" | "percentage";
}



export interface MockQuestionBeh {
  id: string;
  number: number;
  text: string;
  type: 'multiple_choice' | 'text' | 'rating' | 'scale';
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
  segment: 'completed' | 'dropped' | 'mobile' | 'desktop' | 'fast' | 'slow';
  signals: BehavioralSignals;
}

export interface BehaviorEvent {
  timestamp: number;
  type: 'question_start' | 'first_interaction' | 'pause' | 'blur' | 'focus' | 'backtrack' | 'answer' | 'idle';
  duration?: number;
  details?: string;
}

export interface Participant {
  id: string;
  startedAt: Date;
  completedAt?: Date;
  status: 'completed' | 'dropped' | 'in_progress';
  device: 'mobile' | 'desktop';
  responseTime: 'fast' | 'average' | 'slow';
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
