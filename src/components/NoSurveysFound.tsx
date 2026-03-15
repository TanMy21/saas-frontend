import { useState } from "react";

import { Box, Button, Typography } from "@mui/material";

import empty from "../assets/empty.svg";

import NewSurveyModal from "./Modals/NewSurveyModal";

const NoSurveysFound = ({
  workspaceId,
  workspaceName,
}: {
  workspaceId: string;
  workspaceName: string;
}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "450px",
        // border: "2px solid red",
      }}
    >
      {/* --- SVG --- */}
      <Box sx={{ width: 400, height: 400, mb: 0.5 }}>
        <img
          src={empty}
          style={{ width: "100%", height: "100%" }}
          alt="no surveys found"
        />
      </Box>

      <Typography
        sx={{
          fontSize: "1.4rem",
          fontWeight: 700,
          color: "text.primary",
          lineHeight: 1.2,
        }}
      >
        No surveys yet
      </Typography>
      {/* CTA BUTTON */}
      <Button
        onClick={handleOpen}
        sx={{
          mt: 4,
          px: 4,
          py: 1.3,
          fontSize: "0.95rem",
          fontWeight: 600,
          borderRadius: "16px",
          textTransform: "none",
          backgroundColor: "#0074EB",
          color: "#fff",
          boxShadow: "0px 4px 14px rgba(0,116,235,0.25)",
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: "#005BC4",
            transform: "translateY(-1px)",
            boxShadow: "0px 6px 18px rgba(0,116,235,0.35)",
          },
        }}
      >
        Create new survey
      </Button>

      {/* MODAL */}
      <NewSurveyModal
        open={open}
        onClose={() => setOpen(false)}
        workspaceId={workspaceId}
        workspaceName={workspaceName}
      />
    </Box>
  );
};

export default NoSurveysFound;
