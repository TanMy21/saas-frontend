import { useState } from "react";

import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

import {
  useGetParticipantBehaviorDetailQuery,
  useGetParticipantsBehaviorQuery,
} from "../../app/slices/behaviorApiSlice";
import { ParticipantBehaviorRowWithSerial } from "../../types/behaviorTypes";
import { MockQuestionBeh } from "../../utils/insightTypes";

import { BehaviorParticipantDetailDrawer } from "./BehaviorParticipantDetailDrawer";
import { BehaviorParticipantsTable } from "./BehaviorParticipantsTable";

export const BehaviorInsights = () => {
  const { surveyID } = useParams();

  const [preset, setPreset] = useState<
    "last_week" | "last_month" | "custom" | undefined
  >(undefined);

  const [device, setDevice] = useState<
    "mobile" | "desktop" | "tablet" | "unknown" | undefined
  >(undefined);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { data, isLoading } = useGetParticipantsBehaviorQuery({
    surveyID: surveyID!,
    page,
    pageSize,
    preset,
    device,
  });
  // Selected entities
  const [selectedQuestion, setSelectedQuestion] =
    useState<MockQuestionBeh | null>(null);
  const [selectedParticipant, setSelectedParticipant] =
    useState<ParticipantBehaviorRowWithSerial | null>(null);

  const handleParticipantClick = (
    participant: ParticipantBehaviorRowWithSerial,
  ) => {
    setSelectedParticipant(participant);
  };

  const { data: detailData, isLoading: detailLoading } =
    useGetParticipantBehaviorDetailQuery(
      {
        surveyID: surveyID!,
        participantID: selectedParticipant?.participantID!,
      },
      {
        skip: !selectedParticipant,
      },
    );

  console.log("Detail Data:", detailData);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Box
        component="main"
        sx={{
          maxWidth: "72rem",
          mx: "auto",
          px: 3,
          py: 4,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              animation: "fadeIn 0.2s ease-in",
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                }}
              >
                Individual Participants
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mt: 0.5 }}
              >
                View detailed behavior patterns for individual respondents
              </Typography>
            </Box>

            <BehaviorParticipantsTable
              rows={data?.rows ?? []}
              meta={
                data?.meta ?? {
                  page: 1,
                  pageSize: 25,
                  totalRows: 0,
                  totalPages: 1,
                }
              }
              onPageChange={(newPage) => setPage(newPage)}
              onViewBehavior={handleParticipantClick}
            />
          </Box>
        </Box>
      </Box>

      {/* Participant Detail Drawer */}

      <BehaviorParticipantDetailDrawer
        participant={selectedParticipant}
        open={!!selectedParticipant}
        onClose={() => setSelectedParticipant(null)}
        detail={detailData}
        loading={detailLoading}
      />
    </Box>
  );
};
