import { BehavioralSignals, SegmentComparison } from "../utils/insightTypes";

export type ParticipantBehaviorCursor = {
  startedAt: string;
  sessionID: string;
};

export type ParticipantBehaviorRow = {
  participantID: string;
  deviceID: string;
  deviceType: "mobile" | "desktop" | "tablet" | "unknown";
  sessionState: "ACTIVE" | "PAUSED" | "COMPLETED";
  startedAt: string;
  serialNumber?: number;
  progress: {
    answered: number;
    total: number;
    percent: number;
  };
};

export type ParticipantBehaviorTableResponse = {
  rows: ParticipantBehaviorRow[];
  meta: {
    page: number;
    pageSize: number;
    totalRows: number;
    totalPages: number;
  };
};

export type ParticipantBehaviorRowWithSerial = ParticipantBehaviorRow & {
  serialNumber: number;
};

export type BehaviorTableProps = {
  rows: ParticipantBehaviorRow[];
  meta: {
    page: number;
    pageSize: number;
    totalRows: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onViewBehavior: (participant: ParticipantBehaviorRowWithSerial) => void;
};

export type TimelineEvent = {
  type:
    | "QUESTION_STARTED"
    | "FIRST_INTERACTION"
    | "FOCUS_LOST"
    | "FOCUS_GAINED"
    | "ANSWERED"
    | "IDLE"
    | "BACKTRACKED"
    | "HESITATION";
  atMs?: number;
  at?: string;
  durationMs?: number;
  count?: number;
};

export type ParticipantBehaviorDetailResponse = {
  summary: {
    sessionState: "ACTIVE" | "PAUSED" | "COMPLETED";
    deviceType: "mobile" | "desktop" | "tablet" | "unknown";
    sessionStartedAt: string;
    progress: {
      answered: number;
      total: number;
      percent: number;
    };
  };
  meta: {
    totalHesitationsMs: number;
    totalFocusLosses: number;
    totalBacktracks: number;
    totalHesitationCount: number;
  };
  timeline: {
    questionID: string;
    questionOrder: number;
    questionType: string;
    events: TimelineEvent[];
  }[];
};

export interface ParticipantDetailDrawerProps {
  participant: ParticipantBehaviorRow | null;
  detail?: ParticipantBehaviorDetailResponse;
  loading: boolean;
  open: boolean;
  onClose: () => void;
}

export type BackendTimeline = {
  questionID: string;
  questionOrder: number;
  questionType: string;
  events: {
    type:
      | "QUESTION_STARTED"
      | "FIRST_INTERACTION"
      | "ANSWERED"
      | "HESITATION"
      | "FOCUS_LOST"
      | "IDLE"
      | "FOCUS_GAINED"
      | "BACKTRACKED";
    atMs?: number;
    durationMs?: number;
    count?: number;
  }[];
};

export interface BehaviorTimelineProps {
  timeline: BackendTimeline[];
}


export type BehaviorMetricProps = {
  label: string;
  value: number | string;
  sx?: object;
};


export interface BehavioralSignalsProps {
  signals: BehavioralSignals;
  comparisons?: SegmentComparison[];
  className?: string;
}

export interface BehaviorMetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  tooltip?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  variant?: "default" | "signal" | "comparison";
  className?: string;
}


export interface NoResultsProps {
  onClearFilters: () => void;
}