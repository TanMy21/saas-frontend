import { Box } from "@mui/material";
import {
  CheckCircle2,
  FileText,
  Hash,
  Image,
  List,
  ListOrdered,
  Star,
  ThumbsUp,
  ToggleLeft,
} from "lucide-react";

import { QuestionType } from "../../utils/MockData";

interface QuestionTypeBadgeProps {
  type: QuestionType;
  className?: string;
}

const typeConfig: Record<
  QuestionType,
  { label: string; icon: React.ElementType; color: string }
> = {
  binary: {
    label: "Yes/No",
    icon: ToggleLeft,
    color: "bg-chart-1/10 text-chart-1",
  },
  text: {
    label: "Text",
    icon: FileText,
    color: "bg-chart-2/10 text-chart-2",
  },
  numeric: {
    label: "Numeric",
    icon: Hash,
    color: "bg-chart-3/10 text-chart-3",
  },
  "single-choice": {
    label: "Single choice",
    icon: CheckCircle2,
    color: "bg-chart-4/10 text-chart-4",
  },
  "multiple-choice": {
    label: "Multiple choice",
    icon: List,
    color: "bg-chart-5/10 text-chart-5",
  },
  ranking: {
    label: "Ranking",
    icon: ListOrdered,
    color: "bg-chart-6/10 text-chart-6",
  },
  rating: {
    label: "Rating",
    icon: Star,
    color: "bg-chart-7/10 text-chart-7",
  },
  media: {
    label: "Media",
    icon: Image,
    color: "bg-chart-8/10 text-chart-8",
  },
  "3d-option": {
    label: "Like/Dislike",
    icon: ThumbsUp,
    color: "bg-chart-1/10 text-chart-1",
  },
};

export function QuestionTypeBadge({ type, className }: QuestionTypeBadgeProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px", // gap-1.5 → 6px
        borderRadius: "999px",
        px: "10px", // px-2.5 → 10px
        py: "4px", // py-1 → 4px
        fontSize: "12px", // text-xs
        fontWeight: 500, // font-medium
        lineHeight: 1,
        ...(className ? {} : {}),
      }}
    >
      <Box
        component={Icon}
        sx={{
          width: 12, // h-3
          height: 12, // w-3
          flexShrink: 0,
        }}
      />
      {config.label}
    </Box>
  );
}
