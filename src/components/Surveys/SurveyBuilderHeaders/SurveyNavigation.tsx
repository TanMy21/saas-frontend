import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, IconButton, Tooltip } from "@mui/material";
import { FaAngleRight } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";

import { useElectricTheme } from "../../../theme/useElectricTheme";
import { SurveyBuilderHeaderProps } from "../../../utils/types";

const SurveyNavigation = ({
  workspaceId,
  workspaceName,
  survey,
  surveyTitle,
}: SurveyBuilderHeaderProps) => {
  const navigate = useNavigate();
  const { grey, text } = useElectricTheme();

  const handleNavigationBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          width: "fit-content",
          marginTop: { lg: "1%", xl: "0%" },
          textOverflow: "clip",
        }}
      >
        <IconButton
          onClick={handleNavigationBack}
          sx={{
            background: grey[100],
            width: "32px",
            height: "32px",
            borderRadius: 2,
            color: grey[931],
            mr: 4,
            "&:hover": {
              backgroundColor: grey[100],
            },
          }}
        >
          <ArrowBackIcon fontSize="medium" />
        </IconButton>
        <NavLink
          to={`/dash/w/${workspaceId}`}
          style={() => {
            return {
              display: "block",
              color: text.primaryDark,
              lineHeight: "16px",
              fontWeight: "bold",
              textDecoration: "none",
              overflow: "hidden",
              whiteSpace: "nowrap",
            };
          }}
        >
          {workspaceName} &nbsp;
        </NavLink>
      </Box>
      <Box
        sx={{
          marginTop: { md: "2%", lg: "2%", xl: "1%" },
          color: grey[600],
        }}
      >
        <FaAngleRight />
      </Box>
      <Box sx={{ width: "68%" }}>
        <Tooltip title={survey?.title}>
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
    </>
  );
};

export default SurveyNavigation;
