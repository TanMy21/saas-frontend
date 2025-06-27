import { Box } from "@mui/material";

import { ElementProps } from "../../../utils/types";
import ResponseList from "../ElementResponse/ResponseList";

import ElementQuestionText from "./ElementQuestionText";

const RankElement = ({ qID, display }: ElementProps) => {
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        margin: "auto",
        width: "98%",
        minHeight: "700px",
        zIndex: 20,
        // border: "2px solid red",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          bottom: "50%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-end",
          width: "100%",
          margin: "0 auto",
          marginTop: "8%",
          zIndex: 2,
          mb: 5,
          // border: "2px solid blue",
        }}
      >
        <ElementQuestionText display={display} />
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "center",
          width: "100%",
          minHeight: "60%",
          margin: "auto",
          // border: "2px solid blue",
        }}
      >
         
          <ResponseList
            key={qID}
            qID={qID!}
            qType={"RANK"}
            optionText={"Rank"}
            display={display}
          />
        
      </Box>
    </Box>
  );
};
export default RankElement;
