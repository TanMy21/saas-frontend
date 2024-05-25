import { Box, Button, Slider } from "@mui/material";
import { ElementProps } from "../../../utils/types";
import ElementQuestionText from "./ElementQuestionText";
import { BiCheck } from "react-icons/bi";

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

const ScaleElement = ({
  qID,
  qNO,
  qText,
  qDescription,
  display,
}: ElementProps) => {
  const marginTop = display === "mobile" ? "4%" : "8%";
  const sliderWidth = display === "mobile" ? "88%" : "64%";
  const sliderPadding = display === "mobile" ? "4%" : "2%";

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"start"}
      alignItems={"center"}
      margin={"auto"}
      width={"96%"}
      height={"100%"}
      zIndex={20}
    >
      <Box display={"flex"} flexDirection={"row"} sx={{ marginTop: marginTop }}>
        <ElementQuestionText
          qID={qID}
          qNO={qNO}
          qText={qText}
          qDescription={qDescription}
          display={display}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "98%",
        }}
      >
        <Box
          display={"flex"}
          mt={4}
          sx={{
            padding: sliderPadding,
            width: sliderWidth,
          }}
        >
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "auto",
            marginTop: "4%",
            width: "98%",
            height: "60%",
            // border: "2px solid blue",
          }}
        >
          <Button
            variant="contained"
            size="large"
            endIcon={<BiCheck />}
            sx={{
              width: "8%",
              height: "48px",
              color: "white",
              fontWeight: "bold",
              fontSize: {
                xs: "24px",
                sm: "24px",
                md: "32px",
                lg: "24px",
                xl: "24px",
              },
              backgroundColor: "#0445AF",
              borderRadius: "6px",
              textTransform: "capitalize",
              "&:hover": {
                backgroundColor: "#0445AF",
              },
            }}
          >
            Ok
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
export default ScaleElement;
