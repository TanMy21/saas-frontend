import { Box } from "@mui/material";

import { ElementProps } from "../../../utils/types";
import ScaleResponse from "../ElementResponse/ScaleResponse";

import ElementQuestionText from "./ElementQuestionText";

const marks = [
  {
    value: 0,
    label: "0",
  },
  {
    value: 1,
    label: "1",
  },
  {
    value: 2,
    label: "2",
  },
  {
    value: 3,
    label: "3",
  },
  {
    value: 4,
    label: "4",
  },
  {
    value: 5,
    label: "5",
  },
  {
    value: 6,
    label: "6",
  },
  {
    value: 7,
    label: "7",
  },
  {
    value: 8,
    label: "8",
  },
  {
    value: 9,
    label: "9",
  },
  {
    value: 10,
    label: "10",
  },
];

const ScaleElement = ({ qSettings, display }: ElementProps) => {
  const marginTop = display === "mobile" ? "4%" : "8%";
  const sliderWidth = display === "mobile" ? "88%" : "80%";
  const sliderPadding = display === "mobile" ? "4%" : "2%";

  // const { minValue, maxValue } = qSettings || { minValue: 0, maxValue: 10 };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        margin: "auto",
        width: "98%",
        zIndex: 20,
        // border: "2px solid red",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-end",
          width: "100%",
          margin: "auto",
          // border: "2px solid blue",
        }}
      >
        <ElementQuestionText display={display} />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "center",
          width: "100%",
          margin: "auto",
          // border: "2px solid blue",
        }}
      >
        <ScaleResponse />
      </Box>
    </Box>
  );
};
export default ScaleElement;
