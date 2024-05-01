import { Box, Typography } from "@mui/material";
import { GoArrowUpLeft } from "react-icons/go";
import { ElementProps } from "../../../utils/types";

const SurveyWelcomeElement = ({ display }: ElementProps) => {
  const marginTop = display === "mobile" ? "-80%" : "10%";
  const arrowFontSize = display === "mobile" ? "1rem" : "4rem";
  const welcomeFontSize = display === "mobile" ? "24px" : "40px";
  const subtextFontSize = display === "mobile" ? "16px" : "20px";

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
        mt={marginTop}
      >
        <Typography fontSize={arrowFontSize}>
          <GoArrowUpLeft />
        </Typography>
      </Box>
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        width={"84%"}
        height={"60%"}
      >
        <Typography fontSize={welcomeFontSize} color={"#171D5C"}>
          Welcome to the survey!
        </Typography>
        <Typography fontSize={subtextFontSize} color={"#424242"} mt={2}>
          Get started by clicking on the Add button + to add Survey Elements.
        </Typography>
      </Box>
    </Box>
  );
};
export default SurveyWelcomeElement;
