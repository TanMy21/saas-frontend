import { useState, useEffect } from "react";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { QuestionTypeKey, SurveyBuilderCanvasProps } from "../../utils/types";
import SurveyWelcomeElement from "./Elements/SurveyWelcomeElement";
import { useGetElementByIDQuery } from "../../app/slices/elementApiSlice";
import { elementComponents } from "../../utils/elementsConfig";

const SurveyBuilderCanvas = ({
  // elementDetail,
  // qIndex,
  questionId,
}: SurveyBuilderCanvasProps) => {
  const [layout, setLayout] = useState<string | null>("desktop");
  const [isFirstLoad, setIsFirstLoad] = useState<Boolean>(true);

  const { data } = useGetElementByIDQuery(questionId, { skip: !questionId });

  const QuestionComponent = elementComponents[data?.type as QuestionTypeKey];

  const handleLayoutChange = (
    _event: React.MouseEvent<HTMLElement>,
    newLayout: string | null
  ) => {
    setLayout(newLayout);
  };

  useEffect(() => {
    setIsFirstLoad(false);
  }, []);

  return (
    <Box display={"flex"} flexDirection={"column"}>
      <Box
        margin={"auto"}
        width={"98%"}
        minHeight={"75vh"}
        borderRadius={"12px"}
        bgcolor={"#FFFFFF"}
        mt={"6%"}
      >
        {/* Element view */}
        {isFirstLoad && data ? (
          <QuestionComponent
            qID={data[0].questionID}
            qNO={data[0]?.order.toString()}
            qText={data[0].text}
          />
        ) : data?.type ? (
          <QuestionComponent
            qID={data.questionID}
            qNO={data?.order.toString()}
            qText={data.text}
          />
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
