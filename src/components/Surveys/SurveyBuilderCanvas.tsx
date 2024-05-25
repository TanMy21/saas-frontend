import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { QuestionTypeKey, SurveyBuilderCanvasProps } from "../../utils/types";
import SurveyWelcomeElement from "./Elements/SurveyWelcomeElement";
import { useGetElementByIDQuery } from "../../app/slices/elementApiSlice";
import { elementComponents } from "../../utils/elementsConfig";

const SurveyBuilderCanvas = ({
  questionId,
  display,
  // handleLayoutChange,
}: SurveyBuilderCanvasProps) => {
  const { data: questions } = useGetElementByIDQuery(questionId, {
    skip: !questionId,
  });

  const QuestionComponent =
    // selectedQuestion
    /*?*/ elementComponents[questions?.type as QuestionTypeKey];
  // : SurveyWelcomeElement;

  return (
    <Box display={"flex"} flexDirection={"column"}>
      <Box
        margin={"auto"}
        width={"96%"}
        minHeight={"72vh"}
        borderRadius={"12px"}
        bgcolor={"#FFFFFF"}
        mt={"2%"}
        p={2}
        sx={{ transition: "minWidth 1s ease-in-out , opacity 1s ease-in-out" }}
      >
        <Box
          sx={{
            margin: "auto",
            width: "96%",
            height: "100%",
          }}
        >
          {/* Element view */}
          {questions?.type ? (
            <QuestionComponent
              qID={questions?.questionID}
              qNO={questions?.order?.toString()}
              qText={questions?.text}
              qDescription={questions?.description}
              qType={questions?.type}
            />
          ) : (
            <SurveyWelcomeElement display={display} />
          )}
        </Box>
      </Box>
      {/* <Box mt={4} mb={2} display={"flex"} justifyContent={"center"}>
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
      </Box> */}
    </Box>
  );
};

export default SurveyBuilderCanvas;
