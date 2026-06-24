import { Box, ButtonBase, Typography } from "@mui/material";
import { Box as Box3D, LockKeyhole, Upload } from "lucide-react";

import { ThreeDModelEmptyStateProps } from "../../../types/model3DTypes";

export const ThreeDModelEmptyState = ({
  isMobile,
  canUpload3DModel,
  hasProfessionalPlan,
  onUpload,
}: ThreeDModelEmptyStateProps) => {
  const isLocked = !canUpload3DModel;

  const title = canUpload3DModel
    ? "Add a 3D model"
    : hasProfessionalPlan
      ? "3D model upload unavailable"
      : "3D models require Professional";

  const description = canUpload3DModel
    ? "Upload a model"
    : hasProfessionalPlan
      ? "You do not have permission to upload a model for this question."
      : "Upgrade to Professional or Enterprise to upload interactive 3D models.";

  const surfaceStyles = {
    position: "relative",
    width: "100%",
    minHeight: isMobile ? 380 : 700,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
    // border: "1px dashed",
    borderColor: isLocked ? "#CBD5E1" : "#93C5FD",
    bgcolor: isLocked ? "#F8FAFC" : "#F8FBFF",
    px: isMobile ? 2.25 : 4,
    py: isMobile ? 4 : 4.5,
    cursor: canUpload3DModel ? "pointer" : "default",
    textAlign: "center",
    transition:
      "border-color 180ms ease, background-color 180ms ease, box-shadow 180ms ease, transform 180ms ease",

    /* Creates a subtle visual grid that suggests a 3D workspace. */
    backgroundImage: isLocked
      ? "none"
      : `
          linear-gradient(rgba(0, 116, 235, 0.045) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 116, 235, 0.045) 1px, transparent 1px)
        `,
    backgroundSize: "26px 26px",

    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background:
        "radial-gradient(circle at 50% 32%, rgba(0, 116, 235, 0.11), transparent 45%)",
    },

    ...(canUpload3DModel && {
      "&:hover": {
        borderColor: "#0074EB",
        bgcolor: "#F4F9FF",
        boxShadow: "0 14px 30px rgba(0, 91, 196, 0.11)",
        transform: "translateY(-2px)",
      },

      "&:focus-visible": {
        outline: "3px solid rgba(0, 116, 235, 0.25)",
        outlineOffset: 3,
      },
    }),
  };

  const content = (
    <Box
      sx={{
        position: "relative",
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: 430,
      }}
    >
      <Box
        sx={{
          width: isMobile ? 72 : 80,
          height: isMobile ? 72 : 80,
          display: "grid",
          placeItems: "center",
          mb: 2.25,
          borderRadius: 3,
          border: "1px solid",
          borderColor: isLocked ? "#E2E8F0" : "#BFDBFE",
          bgcolor: isLocked ? "#F1F5F9" : "#EFF6FF",
          boxShadow: isLocked ? "none" : "0 10px 22px rgba(0, 116, 235, 0.12)",
        }}
      >
        {isLocked ? (
          <LockKeyhole
            size={isMobile ? 33 : 38}
            strokeWidth={1.9}
            color="#64748B"
          />
        ) : (
          <Box3D size={isMobile ? 38 : 52} strokeWidth={1.8} color="#005BC4" />
        )}
      </Box>

      <Typography
        sx={{
          color: isLocked ? "#334155" : "#0F172A",
          fontSize: isMobile ? "1.18rem" : "1.3rem",
          fontWeight: 750,
          lineHeight: 1.25,
          mb: 1,
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          maxWidth: 390,
          color: "#64748B",
          fontSize: isMobile ? "0.9rem" : "0.95rem",
          lineHeight: 1.6,
        }}
      >
        {description}
      </Typography>

      {canUpload3DModel && (
        <>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              mt: 2.6,
              px: 2.25,
              py: 1.2,
              borderRadius: 2.5,
              bgcolor: "#0074EB",
              color: "common.white",
              fontSize: "0.93rem",
              fontWeight: 700,
              boxShadow: "0 8px 16px rgba(0, 116, 235, 0.22)",
              transition: "background-color 180ms ease, transform 180ms ease",
            }}
          >
            <Upload size={20} strokeWidth={2.25} />
            Upload 3D Model
          </Box>

          <Typography
            sx={{
              mt: 1.5,
              color: "#94A3B8",
              fontSize: "0.78rem",
              fontWeight: 500,
            }}
          >
            Participants will be able to interact with the model.
          </Typography>
        </>
      )}
    </Box>
  );

  if (canUpload3DModel) {
    return (
      <ButtonBase
        component="div"
        role="button"
        tabIndex={0}
        aria-label="Upload a 3D model"
        onClick={onUpload}
        sx={surfaceStyles}
      >
        {content}
      </ButtonBase>
    );
  }

  return <Box sx={surfaceStyles}>{content}</Box>;
};
