import { useEffect, useState } from "react";

import { Box } from "@mui/material";
import { shallowEqual } from "react-redux";

import { RootState } from "../../app/store";
import { useAppSelector } from "../../app/typedReduxHooks";
import { elementComponents } from "../../utils/elementsConfig";
import { QuestionTypeKey, SurveyBuilderCanvasProps } from "../../utils/types";

import ElementBackgroundPreferencesButtons from "./ElementBackgroundPreferencesButtons";
import ElementBackgroundPreferencesRemoveButtons from "./ElementBackgroundPreferencesRemoveButtons";
import QuestionBackgroundColor from "./ElementSettings/ElementSettingsComponents/QuestionBackgroundColor";

const SurveyBuilderCanvas = ({ display }: SurveyBuilderCanvasProps) => {
  const [colorAnchorEl, setColorAnchorEl] = useState<HTMLElement | null>(null);
  const [refreshKey, setRefreshKey] = useState(false);

  const question = useAppSelector(
    (state: RootState) => state.question.selectedQuestion,
    shallowEqual
  );
  const backgroundColor =
    question?.questionPreferences?.questionBackgroundColor;

  const templateUrl = question?.questionPreferences?.questionImageTemplateUrl;
  const templateImage = question?.questionPreferences?.questionImageTemplate;

  const backgroundImage =
    templateImage && templateUrl ? `url(${templateUrl})` : "none";

  const QuestionComponent =
    elementComponents[question?.type as QuestionTypeKey];
  const boxKey = `${backgroundColor}_${backgroundImage}_${refreshKey}`;
  useEffect(() => {
    if (backgroundColor === null) {
      setRefreshKey((prev) => !prev);
    }
    if (backgroundImage) {
      setRefreshKey((prev) => !prev);
    }
  }, [backgroundColor, backgroundImage]);
  return (
    <Box
      key={boxKey}
      sx={{
        display: "flex",
        flexDirection: "column",
        margin: "auto",
        width: "96%",
        height: { md: "70vh", xl: "72vh" },
        // height: "auto",
        flexGrow: 1,
        borderRadius: "24px",
        bgcolor: "#FFFFFF",
        border: "3px solid #E0E0E0",
        boxShadow: " 0 4px 20px rgba(0, 0, 0, 0.08)",
        mt: "1%",
        mb: "2%",
        p: 2,
        transition:
          "background-image 0.5s ease-in-out, background-color 0.5s ease-in-out, minWidth 1s ease-in-out , opacity 1s ease-in-out",
        position: "relative",
        backgroundColor: backgroundColor,
        backgroundImage: backgroundImage,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        overflowX: "hidden",
        overflowY: "auto",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <ElementBackgroundPreferencesButtons
        questionID={question?.questionID!}
        colorAnchorEl={colorAnchorEl}
        setColorAnchorEl={setColorAnchorEl}
      />
      <ElementBackgroundPreferencesRemoveButtons
        questionID={question?.questionID!}
        templateImage={templateImage!}
        questionBackgroundColor={
          question?.questionPreferences?.questionBackgroundColor!
        }
      />
      <QuestionBackgroundColor
        questionID={question?.questionID!}
        colorAnchorEl={colorAnchorEl}
        setColorAnchorEl={setColorAnchorEl}
      />
      <Box
        sx={{
          margin: "auto",
          width: "96%",
          // height: "100%",
        }}
      >
        {/* Element view */}
        {question?.type && (
          <QuestionComponent
            qID={question?.questionID}
            qNO={question?.order?.toString()}
            qText={question?.text}
            qDescription={question?.description}
            qType={question?.type}
            qImage={question?.questionImage}
            // qSettings={question?.config}
            display={display}
          />
        )}
      </Box>
    </Box>
  );
};

export default SurveyBuilderCanvas;
