import { useMemo } from "react";

import { Box,  Typography } from "@mui/material";

import { RootState } from "../../../app/store";
import { useAppSelector } from "../../../app/typedReduxHooks";
import { sanitizeInfoScreenHtml } from "../../../utils/richTextUtils";
import { ElementProps } from "../../../utils/types";

const InfoScreenEmptyState = () => {
  return (
    <Box
      sx={{
        width: "100%",
        border: "1px dashed #CBD5E1",
        borderRadius: 3,
        bgcolor: "#F8FAFC",
        px: 3,
        py: 4,
        textAlign: "center",
      }}
    >
      <Typography sx={{ fontSize: 14, color: "#64748B", fontWeight: 600 }}>
        Add rich info content from the editor in settings panel.
      </Typography>
    </Box>
  );
};

export const InfoScreenContent = ({ qID, display }: ElementProps) => {
  const isMobile = display === "mobile";

  const question = useAppSelector(
    (state: RootState) => state.question.selectedQuestion,
  );

  const description = question?.questionID === qID ? question?.description : "";

  const sanitizedHtml = useMemo(
    () => sanitizeInfoScreenHtml(description),
    [description],
  );

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        mt: 3,
      }}
    >
      <Box
        sx={{
          width: isMobile ? "92%" : "72%",
          maxWidth: 860,
          borderRadius: 4,
          px: isMobile ? 2.25 : 4,
          py: isMobile ? 2.5 : 4,
        }}
      >
        {sanitizedHtml ? (
          <Box
            className="info-screen-content"
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
            sx={{
              width: "100%",
              color: "#0F172A",
              fontSize: 16,
              lineHeight: 1.7,
              "& p": {
                margin: "0 0 12px",
              },
              "& h1": {
                fontSize: isMobile ? 26 : 32,
                lineHeight: 1.2,
                margin: "0 0 16px",
                fontWeight: 900,
              },
              "& h2": {
                fontSize: isMobile ? 22 : 26,
                lineHeight: 1.25,
                margin: "0 0 14px",
                fontWeight: 900,
              },
              "& h3": {
                fontSize: isMobile ? 18 : 22,
                lineHeight: 1.3,
                margin: "0 0 12px",
                fontWeight: 800,
              },
              "& ul, & ol": {
                paddingLeft: "1.4rem",
                margin: "0 0 14px",
              },
              "& li": {
                marginBottom: "6px",
              },
              "& li p": {
                margin: 0,
              },
              "& blockquote": {
                borderLeft: "4px solid #CBD5E1",
                margin: "12px 0",
                padding: "8px 12px",
                color: "#475569",
                backgroundColor: "#F8FAFC",
                borderRadius: "8px",
              },
              "& a": {
                color: "#2563EB",
                textDecoration: "underline",
                fontWeight: 600,
              },
              "& img": {
                display: "block",
                maxWidth: "100%",
                maxHeight: "300px",
                height: "auto",
                borderRadius: "16px",
                margin: "16px auto",
                boxShadow: "0 12px 30px rgba(15,23,42,0.12)",
              },
              "& strong": {
                fontWeight: 800,
              },
            }}
          />
        ) : (
          <InfoScreenEmptyState />
        )}
      </Box>
    </Box>
  );
};
