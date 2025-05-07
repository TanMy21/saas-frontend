import { Box } from "@mui/material";
import { useSelector } from "react-redux";

import { RootState } from "../../../app/store";

import BinaryResponseNo from "./BinaryResponseNo";
import BinaryResponseYes from "./BinaryResponseYes";

const BinaryResponseContainer = () => {
  const question = useSelector(
    (state: RootState) => state.question.selectedQuestion
  );

  const { questionID, questionPreferences } = question || {};

  const { buttonTextYes, buttonTextNo } = questionPreferences?.uiConfig || {
    buttonTextYes: "Yes",
    buttonTextNo: "No",
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "80%",
        height: "100%",
        margin: "auto",
        padding: 2,
        gap: 2,
        // border: "2px solid green",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "80%",
          height: "100%",
          gap: 2,
          // border: "2px solid red",
        }}
      >
        <BinaryResponseYes
          questionID={questionID}
          buttonTextYes={buttonTextYes}
          index={0}
        />
        <BinaryResponseNo
          questionID={questionID}
          buttonTextNo={buttonTextNo}
          index={1}
        />
      </Box>
    </Box>
  );
};

export default BinaryResponseContainer;
