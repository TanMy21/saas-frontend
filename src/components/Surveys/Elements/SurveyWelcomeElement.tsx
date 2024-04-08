import { Box, Typography } from "@mui/material";
import { GoArrowUpLeft } from "react-icons/go";
const SurveyWelcomeElement = () => {
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"start"}
      alignItems={"center"}
      margin={"auto"}
      width={"100%"}
      height={"100%"}
      zIndex={20}
    >
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"flex-end"}
        width={"90%"}
        height={"100px"}
        mt={8}
      >
        <Typography variant="h1">
          <GoArrowUpLeft />
        </Typography>
      </Box>
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        width={"80%"}
        height={"400px"}
      >
        <Typography variant="h3" color={"#171D5C"}>
          Welcome to the survey!
        </Typography>
        <Typography variant="h5" color={"#424242"} mt={2}>
          Get started by clicking on the Add button to add Survey Elements.
        </Typography>
      </Box>
    </Box>
  );
};
export default SurveyWelcomeElement;
