import { useState } from "react";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { SurveyBuilderCanvasProps } from "../../utils/types";
import SurveyWelcomeElement from "./Elements/SurveyWelcomeElement";

const SurveyBuilderCanvas = ({
  survey,
  elementDetail,
  qIndex,
}: SurveyBuilderCanvasProps) => {
  const [layout, setLayout] = useState<string | null>("desktop");

  const handleLayoutChange = (
    _event: React.MouseEvent<HTMLElement>,
    newLayout: string | null
  ) => {
    setLayout(newLayout);
  };
  return (
    <Box display={"flex"} flexDirection={"column"}>
      <Box p={4}>
        <Typography variant="h5">Create Survey: {survey?.title}</Typography>
      </Box>
      <Box
        margin={"auto"}
        width={"98%"}
        minHeight={"75vh"}
        borderRadius={"12px"}
        bgcolor={"#FFFFFF"}
      >
        {/* Element view */}
        {elementDetail ? (
          <elementDetail.Element qNO={qIndex} />
        ) : (
          <SurveyWelcomeElement />
        )}
      </Box>
      <Box mt={4} mb={2} display={"flex"} justifyContent={"center"}>
        <ToggleButtonGroup
          color="primary"
          value={layout}
          exclusive
          onChange={handleLayoutChange}
          aria-label="Platform"
        >
          <ToggleButton
            size="small"
            value="mobile"
            sx={{
              textTransform: "capitalize",
              color: "black",
              bgcolor: "#E3E3E3",
              "&.Mui-selected": {
                bgcolor: "#3C3737",
                color: "white",
                "&:hover": {
                  bgcolor: "#868383",
                  color: "white",
                },
              },
            }}
          >
            <span>Mobile</span>
          </ToggleButton>
          <ToggleButton
            size="small"
            value="desktop"
            sx={{
              textTransform: "capitalize",
              color: "black",
              bgcolor: "#E3E3E3",
              "&.Mui-selected": {
                bgcolor: "#3C3737",
                color: "white",
                "&:hover": {
                  bgcolor: "#868383",
                  color: "white",
                },
              },
            }}
          >
            Desktop
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
};

export default SurveyBuilderCanvas;
