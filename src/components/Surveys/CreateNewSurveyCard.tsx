import { useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import { Box, ButtonBase, Typography } from "@mui/material";

import { NewSurveyProps } from "../../utils/types";
import NewSurveyModal from "../Modals/NewSurveyModal";

const CreateNewSurveyCard = ({
  workspaceId,
  workspaceName,
  viewMode,
}: NewSurveyProps) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  return (
    <>
      <Box
        sx={{
          border: "2px dashed #E2E5E9",
          borderRadius: 2,
          backgroundColor: "white",
          p: viewMode === "grid" ? 2 : 0,
          display: "flex",
          flexDirection: viewMode === "grid" ? "column" : "row",
          width: viewMode === "list" ? "100%" : null,
          height: viewMode === "list" ? "60px" : null,
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          cursor: "pointer",
          transition: "border-color 0.3s",
          "&:hover": {
            borderColor: "#6F25EB",
            backgroundColor: "#EDE9FE",
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
                width: 48,
                height: 48,
                backgroundColor: "#EDE9FE",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
                transition: "background-color 0.3s",
                "&:hover": {
                  backgroundColor: "purple.200",
                },
              }}
            >
              <AddIcon sx={{ fontSize: 24, color: "#6E25EB" }} />
            </Box>
            <Typography variant="h6" fontWeight="medium" color="grey.900">
              Create new survey
            </Typography>
            <Typography variant="body2" color="grey.500">
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
                backgroundColor: "#EDE9FE",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background-color 0.3s",
                "&:hover": {
                  backgroundColor: "purple.200",
                },
              }}
            >
              <AddIcon sx={{ fontSize: 24, color: "#6E25EB" }} />
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
              <Typography variant="h6" fontWeight="medium" color="grey.900">
                Create new survey
              </Typography>
              <Typography variant="body2" color="grey.500">
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
