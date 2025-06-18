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
          border: "2px dashed #E2E5E9",
          borderRadius: 5,
          backgroundColor: background.paper,
          p: viewMode === "grid" ? 2 : 0,
          display: "flex",
          flexDirection: viewMode === "grid" ? "column" : "row",
          width: viewMode === "list" ? "98%" : null,
          height: viewMode === "list" ? { lg: "56px", xl: "60px" } : null,
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          cursor: "pointer",
          margin: viewMode === "list" ? "auto" : null,
          transition: "border-color 0.3s",
          "&:hover": {
            borderColor: primary.dark,
            backgroundColor: background.soft6,
          },
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
            }}
            onClick={handleOpen}
          >
            <Box
              sx={{
                width: { md: 40, xl: 48 },
                height: { md: 40, xl: 48 },
                backgroundColor: background.soft6,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
                transition: "background-color 0.3s",
              }}
            >
              <AddIcon sx={{ fontSize: 24, color: primary.dark }} />
            </Box>
            <Typography sx={textStyles.strongH6}>Create new survey</Typography>
            <Typography
              sx={{ ...textStyles.bodyGrey, fontSize: { md: 16, xl: 20 } }}
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
            }}
            onClick={handleOpen}
          >
            <Box
              sx={{
                ml: 2,
                width: 40,
                height: 40,
                backgroundColor: background.soft6,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background-color 0.3s",
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
                justifyContent: "center",
                alignItems: "flex-start",
                gap: 0.2,
                width: "80%",
                height: "96%",
              }}
            >
              <Typography sx={textStyles.strongH6}>
                Create new survey
              </Typography>
              <Typography sx={textStyles.bodyGrey}>
                Start collecting valuable feedback
              </Typography>
            </Box>
          </ButtonBase>
        )}
      </Box>
      <NewSurveyModal
        open={open}
        setOpen={setOpen}
        workspaceId={workspaceId!}
        workspaceName={workspaceName!}
      />
    </>
  );
};

export default CreateNewSurveyCard;
