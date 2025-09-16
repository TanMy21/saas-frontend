import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Box, IconButton, Tooltip } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";

import { useAppTheme } from "../../../theme/useAppTheme";
import { SurveyBuilderHeaderProps } from "../../../utils/types";

const SurveyNavigation = ({
  workspaceId,
  workspaceName,
  survey,
  surveyTitle,
}: SurveyBuilderHeaderProps) => {
  const navigate = useNavigate();
  const { grey, text } = useAppTheme();

  const handleNavigationBack = () => {
    navigate(-1);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        marginTop: { lg: "1%", xl: "0%" },
        minWidth: 0,
        gap: 1.5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: "8%",
          height: "98%",
          // border: "2px solid green",
        }}
      >
        <IconButton
          onClick={handleNavigationBack}
          sx={{
            background: grey[100],
            width: "32px",
            height: "32px",
            borderRadius: 2,
            ml: 2,
            color: grey[931],
            boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
            transition: "transform 120ms ease, box-shadow 120ms ease",
            "&:hover": {
              backgroundColor: grey[100],
              transform: "translateX(-1px)",
              boxShadow:
                "0 0 0 1px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.10)",
            },
            "& .MuiSvgIcon-root": { fontSize: { xs: 22, md: 24 } },
          }}
        >
          <ChevronLeftIcon fontSize="medium" />
        </IconButton>
      </Box>
      {/* Divider */}
      <Box
        sx={{
          alignSelf: "stretch",
          width: "1px",
          backgroundColor: grey[200],
          mx: 1,
        }}
      />

      {/* Titles */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "80%",
          height: "100%",
          minWidth: 0,
          gap: 1,
          // border: "2px solid blue",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            width: "98%",
            height: "48%",
            px: "2%",
            // border: "2px solid orange",
          }}
        >
          <NavLink
            to={`/dash/w/${workspaceId}`}
            style={() => {
              return {
                display: "block",
                color: text.primaryDark,
                lineHeight: "20px",
                fontWeight: "bold",
                textDecoration: "none",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                transition: "color 120ms ease",
              };
            }}
          >
            {workspaceName} &nbsp;
          </NavLink>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            width: "98%",
            minWidth: 0,
            height: "48%",
            // border: "2px solid orange",
          }}
        >
          <Tooltip title={survey?.title || ""} placement="bottom" arrow={false}>
            <Box
              sx={{
                fontSize: "16px",
                fontWeight: 600,
                textDecoration: "none",
                color: grey[600],
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "clip",
              }}
            >
              &nbsp; {surveyTitle ? surveyTitle : survey?.title}
            </Box>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

export default SurveyNavigation;
