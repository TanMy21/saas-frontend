import { Box, Typography } from "@mui/material";

const SurveyShare = () => {
  return (
    <Box display={"flex"} flexDirection={"column"}>
      <Box margin={"auto"} width={"98%"} minHeight={"75vh"} mt={"6%"}>
        <Typography variant={"h4"}>Share your survey</Typography>
      </Box>
    </Box>
  );
};

export default SurveyShare;
