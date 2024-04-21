import { Box, Button } from "@mui/material";
import { ElementProps } from "../../../utils/types";
import ElementQuestionText from "./ElementQuestionText";

const BinaryElement = ({ qID, qNO, qText }: ElementProps) => {
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"start"}
      alignItems={"center"}
      margin={"auto"}
      width={"70%"}
      height={"100%"}
      zIndex={20}
    >
      <Box display={"flex"} flexDirection={"row"} sx={{ marginTop: "12%" }}>
        <ElementQuestionText qID={qID} qNO={qNO} qText={qText}/>
      </Box>
      <Box display={"flex"} mt={4}>
        <Button variant="outlined" size="large" sx={{ marginRight: "12%" }}>
          Yes
        </Button>
        <Button variant="outlined" size="large">
          No
        </Button>
      </Box>
    </Box>
  );
};
export default BinaryElement;
