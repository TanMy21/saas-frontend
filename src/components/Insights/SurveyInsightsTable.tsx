import { useState } from "react";

import {
  Box,
  Card,
  Chip,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { SurveyInsightTable } from "../../utils/insightTypes";
import { calculateDropOff, severitySx } from "../../utils/utils";

const SurveyInsightsTable = ({
  questions,
  onSelect,
}: SurveyInsightTable) => {
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const totalPages = Math.ceil(questions.length / ITEMS_PER_PAGE);
  const questionsSlice = questions.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

 

  const barColor = (rate: number) => {
    if (rate >= 25) return "#ef4444";
    if (rate >= 10) return "#f59e0b";
    return "#10b981";
  };

  return (
    <Card>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Question</TableCell>
            <TableCell align="right">Friction</TableCell>
            <TableCell align="right">Reached</TableCell>
            <TableCell align="right">Answered</TableCell>
            <TableCell align="right">Dropped</TableCell>
            <TableCell align="right">Rate</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {questions.map((q) => {
            const { dropped, rate } = calculateDropOff(q.reached, q.answered);

            const fillColor = barColor(rate);
            return (
              <TableRow
                key={q.id}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() => onSelect(q)}
              >
                <TableCell>{q.number}</TableCell>
                <TableCell>
                  <Typography fontWeight={500}>{q.text}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {q.type}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  {/* Outer track */}
                  <Box
                    sx={{
                      height: 8,
                      width: "100%",
                      bgcolor: "#f3f4f6",
                      borderRadius: 999,
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    {/* Filled bar */}
                    <Box
                      sx={{
                        height: "100%",
                        width: `${Math.max(2, rate)}%`, // ✅ same as your Tailwind
                        bgcolor: fillColor, // ✅ green/yellow/red
                        borderRadius: 999,
                        transition: "width 700ms ease-out",
                      }}
                    />
                  </Box>
                </TableCell>
                <TableCell align="right">{q.reached}</TableCell>
                <TableCell align="right">{q.answered}</TableCell>
                <TableCell align="right">-{dropped}</TableCell>
                <TableCell align="right">
                  <Chip
                    label={`${rate.toFixed(1)}%`}
                    sx={{
                      fontWeight: 700,
                      border: "1px solid",
                      ...severitySx(rate),
                    }}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Divider />

      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="caption">
          Page {page} of {totalPages}
        </Typography>

        <Box>
          <IconButton disabled={page === 1} onClick={() => setPage(page - 1)}>
            <ChevronLeft />
          </IconButton>
          <IconButton
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};

export default SurveyInsightsTable;
