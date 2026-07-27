import { lazy, type ComponentType } from "react";

import type { SummaryQuestion } from "../types/insightTypes";

const BinaryChart = lazy(() =>
  import("../components/Insights/visualizations/BinaryChart").then(
    (module) => ({
      default: module.BinaryChart,
    }),
  ),
);

const ConceptFitSummaryChart = lazy(
  () => import("../components/Insights/visualizations/ConceptFitChart"),
);

const DropdownChoiceChart = lazy(
  () => import("../components/Insights/visualizations/DropdownChoiceChart"),
);

const IATSummaryChart = lazy(
  () => import("../components/Insights/visualizations/IATChart"),
);

const MediaOptionsViz = lazy(() =>
  import("../components/Insights/visualizations/MediaOptionsViz").then(
    (module) => ({
      default: module.MediaOptionsViz,
    }),
  ),
);

const MultipleChoiceChart = lazy(() =>
  import("../components/Insights/visualizations/MultipleChoiceChart").then(
    (module) => ({
      default: module.MultipleChoiceChart,
    }),
  ),
);

const NumericChart = lazy(() =>
  import("../components/Insights/visualizations/NumericChart").then(
    (module) => ({
      default: module.NumericChart,
    }),
  ),
);

const RankingChart = lazy(() =>
  import("../components/Insights/visualizations/RankingChart").then(
    (module) => ({
      default: module.RankingChart,
    }),
  ),
);

const ScaleChart = lazy(() =>
  import("../components/Insights/visualizations/ScaleChart").then((module) => ({
    default: module.ScaleChart,
  })),
);

const SingleChoiceChart = lazy(() =>
  import("../components/Insights/visualizations/SingleChart").then(
    (module) => ({
      default: module.SingleChoiceChart,
    }),
  ),
);

const TextResponses = lazy(() =>
  import("../components/Insights/visualizations/TextResponses").then(
    (module) => ({
      default: module.TextResponses,
    }),
  ),
);

const TimedChoiceChart = lazy(
  () => import("../components/Insights/visualizations/TimedChoiceChart"),
);

export const summaryVisualizationMap: Partial<
  Record<SummaryQuestion["type"], ComponentType<{ question: any }>>
> = {
  BINARY: BinaryChart,
  RADIO: SingleChoiceChart,
  MULTIPLE_CHOICE: MultipleChoiceChart,
  MEDIA: MediaOptionsViz,
  RANGE: ScaleChart,
  NUMBER: NumericChart,
  RANK: RankingChart,
  TEXT: TextResponses,
  DROPDOWN: DropdownChoiceChart,
  TIMED_CHOICE: TimedChoiceChart,
  CONCEPT_FIT: ConceptFitSummaryChart,
  IAT: IATSummaryChart,
};
