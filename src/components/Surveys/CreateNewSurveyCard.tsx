import { useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import { Box, ButtonBase, Typography } from "@mui/material";

import { useAppTheme } from "../../theme/useAppTheme";
import { NewSurveyProps } from "../../utils/types";
import NewSurveyModal from "../Modals/NewSurveyModal";

const CreateNewSurveyCard = ({
  workspaceId,
  workspaceName,
  viewMode,
}: NewSurveyProps) => {
  const { background, primary, textStyles } = useAppTheme();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  return (
    <>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          border: "2px dashed #E2E5E9",
          borderRadius: viewMode === "list" ? 3 : 4,
          backgroundColor: background.paper,
          p: viewMode === "grid" ? 2 : 0,
          display: "flex",
          flexDirection: viewMode === "grid" ? "column" : "row",
          width: viewMode === "list" ? "98%" : null,
          height: viewMode === "list" ? { lg: "56px", xl: "60px" } : null,
          px: viewMode === "list" ? { md: 1.5, lg: 1.5 } : null,
          py: viewMode === "list" ? { md: 1.5, lg: 0.25 } : null,
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          cursor: "pointer",
          margin: viewMode === "list" ? "auto" : null,
          backdropFilter: "saturate(140%) blur(2px)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)",
          transition:
            "border-color 140ms ease, background-color 140ms ease, box-shadow 140ms ease, transform 140ms ease",
          "&:hover": {
            borderColor: primary.dark,
            backgroundColor: background.soft6,
            boxShadow:
              "0 6px 14px rgba(2,43,103,0.08), inset 0 1px 0 rgba(255,255,255,0.35)",
            transform: { md: "translateY(-2px)" },
          },
          "&:focus-within": {
            outline: "2px solid",
            outlineColor: primary.dark,
            outlineOffset: "2px",
          },
          "@media (prefers-reduced-motion: reduce)": {
            transition: "none",
            "&:hover": { transform: "none" },
          },
          "&::after": {
            content: '""',
            position: "absolute",
            top: -40,
            right: -40,
            width: 140,
            height: 140,
            borderRadius: "50%",
            background:
              "radial-gradient(closest-side, rgba(0,116,235,0.10), transparent 70%)",
            opacity: 0,
            transition: "opacity 140ms ease",
          },
          "&:hover::after": { opacity: 1 },
        }}
      >
        {viewMode === "grid" ? (
          <ButtonBase
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              textTransform: "none",
              borderRadius: 3,
              "&:hover": { backgroundColor: "transparent" },
            }}
            onClick={handleOpen}
            focusRipple
          >
            <Box
              className="plusIconWrap"
              sx={{
                width: { md: 44, xl: 52 },
                height: { md: 44, xl: 52 },
                backgroundColor: background.soft6,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1.5,
                background:
                  "linear-gradient(180deg, rgba(2,43,103,0.06) 0%, rgba(2,43,103,0.02) 100%)",
                boxShadow: "inset 0 1px 2px rgba(255,255,255,0.5)",
                transition: "transform 160ms ease",
                ".MuiBox-root:hover &": { transform: "scale(1.06)" },
                "@media (prefers-reduced-motion: reduce)": {
                  transition: "none",
                },
              }}
            >
              <AddIcon
                sx={{ fontSize: { md: 26, xl: 30 }, color: primary.dark }}
              />
            </Box>
            <Typography sx={textStyles.strongH6}>Create new survey</Typography>
            <Typography
              noWrap
              sx={{
                ...textStyles.bodyGrey,
                fontSize: { md: 16, xl: 20 },
              }}
            >
              Start collecting valuable feedback
            </Typography>
          </ButtonBase>
        ) : (
          <ButtonBase
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 2,
              width: "100%",
              height: "100%",
              textTransform: "none",
              borderRadius: 3,
              px: 1,
              "&:hover": { backgroundColor: "transparent" },
            }}
            onClick={handleOpen}
          >
            <Box
              sx={{
                ml: 1.5,
                width: 48,
                height: 48,
                backgroundColor: background.soft6,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "linear-gradient(180deg, rgba(2,43,103,0.06) 0%, rgba(2,43,103,0.02) 100%)",
                boxShadow: "inset 0 1px 2px rgba(255,255,255,0.5)",
                transition: "transform 160ms ease",
                ".MuiButtonBase-root:hover &": { transform: "scale(1.05)" },
                "@media (prefers-reduced-motion: reduce)": {
                  transition: "none",
                },
                "&:hover": {
                  backgroundColor: background.soft6,
                },
              }}
            >
              <AddIcon sx={{ fontSize: 24, color: primary.dark }} />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 0.2,
                width: "80%",
                height: "96%",
              }}
            >
              <Typography sx={textStyles.strongH6}>
                Create new survey
              </Typography>
              <Typography noWrap sx={textStyles.bodyGrey}>
                Start collecting valuable feedback
              </Typography>
            </Box>
          </ButtonBase>
        )}
      </Box>
      <NewSurveyModal
        open={open}
        onClose={() => setOpen(false)}
        workspaceId={workspaceId!}
        workspaceName={workspaceName!}
      />
    </>
  );
};

export default CreateNewSurveyCard;
