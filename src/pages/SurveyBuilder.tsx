import { Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const SurveyBuilder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { workspaceId } = location.state || {};
  return (
    <>
      <Typography variant="h2">SurveyBuilder </Typography>
    </>
  );
};

export default SurveyBuilder;
