// import { useState, useEffect } from "react";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import {
  // QuestionDetail,
  QuestionTypeKey,
  SurveyBuilderCanvasProps,
} from "../../utils/types";
import SurveyWelcomeElement from "./Elements/SurveyWelcomeElement";
import { useGetElementByIDQuery } from "../../app/slices/elementApiSlice";
import { elementComponents } from "../../utils/elementsConfig";

const SurveyBuilderCanvas = ({
  // elementDetail,
  // qIndex,
  questionId,
  display,
  handleLayoutChange,
}: SurveyBuilderCanvasProps) => {
  // const [selectedQuestion, setSelectedQuestion] =
  //   useState<QuestionDetail | null>(null);

  const { data: questions } = useGetElementByIDQuery(questionId, {
    skip: !questionId,
  });

  // useEffect(() => {
  //   if (questions && questions.length > 0) {
  //     setSelectedQuestion(questions[0]);
  //   }
  // }, [questions]);

  const QuestionComponent =
    /*selectedQuestion*/
    /*?*/ elementComponents[questions?.type as QuestionTypeKey];
  // : SurveyWelcomeElement;

  // console.log("QuestionComponent: ", selectedQuestion);

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
        {questions?.type ? (
          <QuestionComponent
            qID={questions?.questionID}
            qNO={questions?.order?.toString()}
            qText={questions?.text}
            qType={questions?.type}
          />
        ) : (
          <SurveyWelcomeElement />
        )}
      </Box>
      <Box mt={4} mb={2} display={"flex"} justifyContent={"center"}>
        <ToggleButtonGroup
          color="primary"
          value={display}
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
