import { Box, Slider } from "@mui/material";
import { ElementProps } from "../../../utils/types";
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

const ScaleElement = ({ qID, qNO, qText }: ElementProps) => {
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
      <Box display={"flex"} flexDirection={"row"} sx={{ marginTop: "20%" }}>
        <ElementQuestionText qID={qID} qNO={qNO} qText={qText} />
      </Box>
      <Box display={"flex"} mt={4} width={"600px"}>
        <Slider
          aria-label="Always visible"
          defaultValue={2}
          //   getAriaValueText={valuetext}
          min={0}
          max={10}
          step={1}
          marks={marks}
          valueLabelDisplay="on"
          sx={{
            "& .MuiSlider-markLabel": {
              fontSize: "1.25rem",
            },
          }}
        />
      </Box>
    </Box>
  );
};
export default ScaleElement;
