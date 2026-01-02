import { useState } from "react";

import { Box } from "@mui/material";

import { mockQuestions, surveyMetadata } from "../../utils/MockData";

import { QuestionSection } from "./QuestionSection";
import { SummaryControls } from "./SummaryControls";
import { SummaryHeader } from "./SummaryHeader";

export const SummaryContainer = () => {
  const [displayMode, setDisplayMode] = useState<"count" | "percentage">(
    "percentage"
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Box minHeight="100vh" bgcolor="background.default">
      <SummaryHeader
        title={surveyMetadata.title}
        totalResponses={surveyMetadata.totalResponses}
        completionRate={surveyMetadata.completionRate}
      />

      <SummaryControls
        displayMode={displayMode}
        onDisplayModeChange={setDisplayMode}
        onFilterClick={() => setIsFilterOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      /> */}

      <Box component="main" px={{ xs: 3, lg: 4 }} py={4}>
        <Box
          mx="auto"
          maxWidth={960}
          display="flex"
          flexDirection="column"
          gap={3}
        >
          {mockQuestions.map((question) => (
            <QuestionSection
              key={question.id}
              question={question}
              displayMode={displayMode}
              searchQuery={searchQuery}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};
