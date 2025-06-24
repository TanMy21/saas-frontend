import { Box } from "@mui/material";

import { RootState } from "../../../app/store";
import { useAppSelector } from "../../../app/typedReduxHooks";
import { BinaryResponseProps } from "../../../utils/types";

import BinaryResponseNo from "./BinaryResponseNo";
import BinaryResponseYes from "./BinaryResponseYes";

const BinaryResponseContainer = ({ display }: BinaryResponseProps) => {
  const question = useAppSelector(
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
          width: display === "mobile" ? "98%" : "80%",
          height: "100%",
          gap: 2,
          // border: "2px solid red",
        }}
      >
        <BinaryResponseYes
          questionID={questionID}
          buttonTextYes={buttonTextYes}
          index={0}
          display={display}
        />
        <BinaryResponseNo
          questionID={questionID}
          buttonTextNo={buttonTextNo}
          index={1}
          display={display}
        />
      </Box>
    </Box>
  );
};

export default BinaryResponseContainer;
