import { BehavioralSignals, SegmentComparison } from "./insightTypes";

 

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

export type ThreeDQuestionResultAggregate = {
  questionID: string;

  explicit: {
    totalResponses: number;
    likeCount: number;
    dislikeCount: number;
    likeRate: number;
    dislikeRate: number;
  };

  behaviorSummary: {
    answeredWithoutInteractionCount: number;
    answeredWithoutInteractionRate: number;

    viewedMultipleAnglesCount: number;
    viewedMultipleAnglesRate: number;

    fullRotationCompletedCount: number;
    fullRotationCompletedRate: number;

    deepZoomUsedCount: number;
    deepZoomUsedRate: number;

    modelClickCountTotal: number;
    emptySpaceClickCountTotal: number;
    viewerClickCountTotal: number;
    emptyClickRate: number;
  };

  behaviorByAnswer: {
    like: ThreeDBehaviorGroupSummary;
    dislike: ThreeDBehaviorGroupSummary;
  };

  heatmap: {
    screenZoneClickSummary: Record<string, number>;
    likeScreenZoneClickSummary: Record<string, number>;
    dislikeScreenZoneClickSummary: Record<string, number>;
  };

  modelAreas: {
    clickedMeshes: ClickedMeshArea[];
    likedClickedMeshes: ClickedMeshArea[];
    dislikedClickedMeshes: ClickedMeshArea[];
  };

  surfaceClickSamples: SurfaceClickSample[];
  likedSurfaceClickSamples: SurfaceClickSample[];
  dislikedSurfaceClickSamples: SurfaceClickSample[];

  performance: {
    avgFps: number | null;
    avgTriangles: number | null;
    avgDrawCalls: number | null;
    avgTextures: number | null;
  };

  insights: {
    mostInteractedArea: {
      hasData: boolean;
      message: string;
      area: ClickedMeshArea | null;
    };

    firstImpressionVsInspected: {
      firstImpression: {
        total: number;
        likeCount: number;
        dislikeCount: number;
        likeRate: number;
      };
      inspected: {
        total: number;
        likeCount: number;
        dislikeCount: number;
        likeRate: number;
      };
    };

    rotationInspection: {
      viewedMultipleAnglesCount: number;
      viewedMultipleAnglesRate: number;
      fullRotationCompletedCount: number;
      fullRotationCompletedRate: number;
      avgManualAzimuthCoverage: number;
      avgManualElevationCoverage: number;
      avgManualOrbitChanges: number;
    };

    zoomInspection: {
      deepZoomUsedCount: number;
      deepZoomUsedRate: number;
      deepZoomLikeRate: number;
      nonDeepZoomLikeRate: number;
    };

    performanceWarning: {
      hasWarning: boolean;
      warnings: string[];
    };
  };
};

export type ThreeDBehaviorGroupSummary = {
  total: number;
  answeredWithoutInteractionRate: number;
  viewedMultipleAnglesRate: number;
  deepZoomUsedRate: number;
  avgModelClicks: number;
  avgEmptyClicks: number;
};

export type HeatmapMode = "ALL" | "LIKE" | "DISLIKE";

export type LikeDislikeSplitSummaryProps = {
  likeCount: number;
  dislikeCount: number;
  likePercentage: number;
  dislikePercentage: number;
  formatValue: (count: number, percentage: number) => string;
};

export interface ThreeDBehaviorInsightsProps {
  data: any;
  isLoading: boolean;
  modelUrl?: string;
}

export type ThreeDInsightTab = "by-answer" | "viewport" | "regions";

export type ThreeDBehaviorDetailsTabsProps = {
  data: ThreeDQuestionResultAggregate;
  activeAreas: ColoredClickedMeshArea[];
};

export type ThreeDHeatmapInsightsSectionProps = {
  data: ThreeDQuestionResultAggregate;
  modelUrl?: string;
  heatmapMode: HeatmapMode;
  onHeatmapModeChange: (mode: HeatmapMode) => void;
  activeHeatmapData: {
    clickedMeshes: ColoredClickedMeshArea[];
    surfaceClickSamples: SurfaceClickSample[];
    label: string;
  };
};

export type ColoredClickedMeshArea = ClickedMeshArea & {
  color: string;
};
