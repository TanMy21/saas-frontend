import { useState } from "react";

import { Box, Typography } from "@mui/material";
import { Calendar, Smartphone } from "lucide-react";
import { useParams } from "react-router-dom";

import {
  useGetParticipantBehaviorDetailQuery,
  useGetParticipantsBehaviorQuery,
} from "../../app/slices/behaviorApiSlice";
import { ParticipantBehaviorRowWithSerial } from "../../types/behaviorTypes";
import { InsightsFilterDropdown } from "../Insights/InsightsFilterDropdown";
import { EmptyState } from "../States/EmptyState";
import { NoResults } from "../States/NoResults";

import { BehaviorParticipantDetailDrawer } from "./BehaviorParticipantDetailDrawer";
import { BehaviorParticipantsTable } from "./BehaviorParticipantsTable";

export const BehaviorInsights = () => {
  const { surveyID } = useParams();

  const [preset, setPreset] = useState<"last_week" | "last_month" | undefined>(
    undefined,
  );

  const [device, setDevice] = useState<
    "mobile" | "desktop" | "tablet" | undefined
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

  const totalRows = data?.meta?.totalRows ?? 0;
  const hasFilters = !!preset || !!device;

  const showEmptySurvey = !isLoading && totalRows === 0 && !hasFilters;
  const showFilteredEmpty = !isLoading && totalRows === 0 && hasFilters;

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
          {/* FILTERS */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <InsightsFilterDropdown<"all" | "last_week" | "last_month">
              label="Time Range"
              value={preset ?? "all"}
              onChange={(v) => setPreset(v === "all" ? undefined : v)}
              options={[
                { value: "all", label: "All time" },
                { value: "last_week", label: "Past week" },
                { value: "last_month", label: "Past month" },
              ]}
              icon={Calendar}
            />

            <InsightsFilterDropdown<"all" | "mobile" | "desktop" | "tablet">
              label="Device Type"
              value={device ?? "all"}
              onChange={(v) => setDevice(v === "all" ? undefined : v)}
              options={[
                { value: "all", label: "All devices" },
                { value: "mobile", label: "Mobile" },
                { value: "desktop", label: "Desktop" },
                { value: "tablet", label: "Tablet" },
              ]}
              icon={Smartphone}
            />
          </Box>

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

            {isLoading ? null : showEmptySurvey ? (
              <EmptyState />
            ) : showFilteredEmpty ? (
              <NoResults
                onClearFilters={() => {
                  setPreset(undefined);
                  setDevice(undefined);
                }}
              />
            ) : (
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
            )}
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
