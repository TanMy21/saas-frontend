import { useState } from "react";

import { Box, Typography, IconButton, InputBase } from "@mui/material";
import { Grid, List, Search } from "lucide-react";

import { TextResponsesProps } from "../../../utils/insightTypes";
import { timeAgo } from "../../../utils/utils";

export const TextResponses = ({ question }: TextResponsesProps) => {
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards");
  const [localSearch, setLocalSearch] = useState("");

  const combinedSearch = localSearch;

  const filteredResponses = combinedSearch
    ? question.responses.filter((r) =>
        r.text.toLowerCase().includes(combinedSearch.toLowerCase()),
      )
    : question.responses;

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {/* ───────────────── Controls ───────────────── */}
      <Box display="flex" alignItems="center" gap={2}>
        {/* Search */}
        <Box
          sx={{
            position: "relative",
            flex: 1,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            px: 1,
            height: 36,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Search size={16} color="var(--mui-palette-text-secondary)" />
          <InputBase
            placeholder="Search responses..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            sx={{
              ml: 1,
              flex: 1,
              fontSize: 14,
            }}
          />
        </Box>

        {/* View toggle */}
        <Box
          sx={{
            display: "flex",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            p: "2px",
          }}
        >
          <IconButton
            size="small"
            onClick={() => setViewMode("cards")}
            sx={{
              width: 32,
              height: 32,
              bgcolor: viewMode === "cards" ? "action.hover" : "transparent",
            }}
          >
            <Grid size={16} />
          </IconButton>

          <IconButton
            size="small"
            onClick={() => setViewMode("list")}
            sx={{
              width: 32,
              height: 32,
              bgcolor: viewMode === "list" ? "action.hover" : "transparent",
            }}
          >
            <List size={16} />
          </IconButton>
        </Box>
      </Box>

      {/* ───────────────── Count ───────────────── */}
      <Typography fontSize={14} color="text.secondary">
        Showing {filteredResponses.length} of {question.responses.length}{" "}
        responses
      </Typography>

      {/* ───────────────── Responses ───────────────── */}
      <Box
        sx={{
          maxHeight: 384, // max-h-96
          overflowY: "auto",
          ...(viewMode === "cards"
            ? { display: "flex", flexDirection: "column", gap: 1.5 }
            : {
                "& > * + *": {
                  borderTop: "1px solid",
                  borderColor: "divider",
                },
              }),
        }}
      >
        {filteredResponses.map((response) => (
          <Box
            key={response.responseID}
            sx={{
              ...(viewMode === "cards"
                ? {
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    bgcolor: "action.hover",
                    p: 2,
                  }
                : {
                    py: 1.5,
                  }),
            }}
          >
            <Typography fontSize={14}>{response.text}</Typography>

            <Typography fontSize={12} color="text.secondary" mt={1}>
              {timeAgo(new Date(response.createdAt))}
            </Typography>
          </Box>
        ))}

        {filteredResponses.length === 0 && (
          <Box py={4} textAlign="center">
            <Typography color="text.secondary">
              No responses match your search.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};
