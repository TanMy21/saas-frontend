import { useState } from "react";

import {
  Box,
  Button,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  InsightTableColumnConfig,
  SurveyInsightTable,
} from "../../utils/insightTypes";
import { convertHtmlToPlainText } from "../../utils/richTextUtils";
import { severitySx } from "../../utils/utils";

const ITEMS_PER_PAGE = 5;

const INSIGHTS_COLUMNS: InsightTableColumnConfig[] = [
  { label: "  " },
  { label: "Question" },
  { label: "Reached", align: "right" },
  { label: "Answered", align: "right" },
  { label: "Dropped", align: "right" },
  { label: "Drop Rate", align: "right" },
  { label: "Avg. Time", align: "right" },
];

export const SurveyInsightsTable = ({ questions }: SurveyInsightTable) => {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(questions.length / ITEMS_PER_PAGE);
  const questionsSlice = questions.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const startItem = (page - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(page * ITEMS_PER_PAGE, questions.length);

  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        boxShadow: 1,
      }}
    >
      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#F3F4F6" }}>
              {INSIGHTS_COLUMNS.map((col, i) => (
                <TableCell
                  key={i}
                  align={col.align ?? "left"}
                  sx={{
                    px: 3,
                    py: 2,
                    textTransform: "uppercase",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "text.secondary",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent:
                        col.align === "right" ? "flex-end" : "flex-start",
                      gap: 1,
                    }}
                  >
                    {col.label}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {questionsSlice.map((q, index) => (
              <TableRow
                key={q.id}
                sx={{
                  bgcolor: index % 2 === 0 ? "background.paper" : "#F8FAFC",
                  transition: "background-color 150ms",
                  "&:hover": {
                    bgcolor: "action.selected",
                  },
                }}
              >
                <TableCell sx={{ px: 3, fontWeight: 600 }}>
                  {q.number}
                </TableCell>

                <TableCell sx={{ px: 3, maxWidth: 420 }}>
                  <Tooltip
                    title={convertHtmlToPlainText(q.text)}
                    placement="top-start"
                    arrow
                  >
                    <Typography fontWeight={500} noWrap>
                      {convertHtmlToPlainText(q.text)}
                    </Typography>
                  </Tooltip>
                  <Chip
                    label={q.type}
                    size="small"
                    sx={{
                      mt: 0.5,
                      bgcolor: "#EDE9FE",
                      color: "#4C1D95",
                      fontWeight: 600,
                      opacity: 0.85,
                    }}
                  />
                </TableCell>

                <NumericCell>{q.reached}</NumericCell>
                <NumericCell>{q.answered}</NumericCell>
                <NumericCell>{q?.dropped!}</NumericCell>

                <TableCell align="right" sx={{ px: 3 }}>
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      px: 2,
                      py: 0.5,
                      minWidth: 60,
                      borderRadius: 999,
                      border: "1px solid",
                      fontFamily: "monospace",
                      fontWeight: 600,
                      fontVariantNumeric: "tabular-nums",
                      ...severitySx(q?.dropOffRate!),
                    }}
                  >
                    {q.dropOffRate?.toFixed(1)}%
                  </Box>
                </TableCell>

                <TableCell align="right" sx={{ px: 3 }}>
                  <Typography
                    fontFamily="monospace"
                    fontWeight={600}
                    color="text.secondary"
                  >
                    {(q?.avgTimeMs! / 1000).toFixed(1)}s
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box
        sx={{
          px: 3,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "#F3F4F6",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Showing <b>{startItem}</b> to <b>{endItem}</b> of{" "}
          <b>{questions.length}</b> questions
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton disabled={page === 1} onClick={() => setPage(page - 1)}>
            <ChevronLeft size={18} />
          </IconButton>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              size="small"
              onClick={() => setPage(p)}
              variant={p === page ? "contained" : "text"}
            >
              {p}
            </Button>
          ))}

          <IconButton
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight size={18} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

// helper component for numeric cells
const NumericCell = ({ children }: { children: number }) => (
  <TableCell align="right" sx={{ px: 3 }}>
    <Typography fontFamily="monospace" fontWeight={600}>
      {children.toLocaleString()}
    </Typography>
  </TableCell>
);

export default SurveyInsightsTable;
