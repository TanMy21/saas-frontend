import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import { ChevronRight, TrendingDown, Clock } from "lucide-react";

import { MockQuestionBeh } from "../../utils/insightTypes";

interface DropOffTableProps {
  questions: MockQuestionBeh[];
  onQuestionClick: (question: MockQuestionBeh) => void;
  className?: string;
}

// Question type labels (unchanged)
const questionTypeLabels: Record<string, string> = {
  multiple_choice: "Choice",
  text: "Text",
  rating: "Rating",
  scale: "Scale",
};

export function BehaviorDropOffTable({
  questions,
  onQuestionClick,
  className,
}: DropOffTableProps) {
  /**
   * Maps drop-off rate → color intent
   * Converted from Tailwind utility logic to MUI color usage
   */
  const getDropOffStyles = (rate: number) => {
    if (rate >= 10)
      return {
        color: "error.main",
        bgcolor: "error.light",
      };
    if (rate >= 5)
      return {
        color: "warning.main",
        bgcolor: "warning.light",
      };
    return {
      color: "success.main",
      bgcolor: "success.light",
    };
  };

  return (
    // Root container (rounded + border + bg + shadow)
    <Box
      className={className}
      sx={{
        borderRadius: 1, // rounded-lg
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        boxShadow: 1, // shadow-card equivalent
        overflow: "hidden",
      }}
    >
      <Table>
        {/* TABLE HEADER */}
        <TableHead>
          <TableRow
            sx={{
              bgcolor: "action.hover", // bg-muted/50
              "&:hover": {
                bgcolor: "action.hover", // hover:bg-muted/50 (same)
              },
            }}
          >
            <TableCell sx={{ width: 48, fontWeight: 600 }}>#</TableCell>

            <TableCell sx={{ fontWeight: 600 }}>Question</TableCell>

            <TableCell align="center" sx={{ width: 96, fontWeight: 600 }}>
              Type
            </TableCell>

            <TableCell align="center" sx={{ width: 112, fontWeight: 600 }}>
              {/* Drop-off header with icon */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,
                }}
              >
                <TrendingDown size={14} />
                Drop-off
              </Box>
            </TableCell>

            <TableCell align="center" sx={{ width: 96, fontWeight: 600 }}>
              {/* Avg time header with icon */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,
                }}
              >
                <Clock size={14} />
                Avg Time
              </Box>
            </TableCell>

            <TableCell sx={{ width: 40 }} />
          </TableRow>
        </TableHead>

        {/* TABLE BODY */}
        <TableBody>
          {questions.map((question, index) => (
            <TableRow
              key={question.id}
              onClick={() => onQuestionClick(question)}
              sx={{
                cursor: "pointer",
                transition: "background-color 0.15s ease",
                "&:hover": {
                  bgcolor: "primary.light", // hover:bg-primary-muted/30
                },
              }}
              // animation delay preserved
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Question number */}
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: "text.secondary",
                }}
              >
                {question.number}
              </TableCell>

              {/* Question text */}
              <TableCell
                sx={{
                  fontWeight: 500,
                  color: "text.primary",
                  maxWidth: 300,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {question.text}
              </TableCell>

              {/* Question type */}
              <TableCell align="center">
                {/* Replaces shadcn Badge */}
                <Chip
                  label={questionTypeLabels[question.type]}
                  size="small"
                  sx={{
                    fontSize: 12,
                    fontWeight: 400,
                    bgcolor: "action.hover",
                  }}
                />
              </TableCell>

              {/* Drop-off rate */}
              <TableCell align="center">
                <Box
                  component="span"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    px: 1,
                    py: 0.25,
                    borderRadius: 1,
                    fontSize: 14,
                    fontWeight: 600,
                    ...getDropOffStyles(question.dropOffRate),
                  }}
                >
                  {question.dropOffRate}%
                </Box>
              </TableCell>

              {/* Avg time spent */}
              <TableCell align="center" sx={{ color: "text.secondary" }}>
                {question.avgTimeSpent}s
              </TableCell>

              {/* Chevron */}
              <TableCell>
                <ChevronRight
                  size={16}
                  style={{
                    color: "rgba(0,0,0,0.4)",
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
