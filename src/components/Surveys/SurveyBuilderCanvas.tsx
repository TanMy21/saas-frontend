import { useState } from "react";

import { Box } from "@mui/material";
import { AnimatePresence, motion } from "motion/react";

import { RootState } from "../../app/store";
import { useAppSelector } from "../../app/typedReduxHooks";
import { elementComponents } from "../../utils/elementsConfig";
import { QuestionTypeKey, SurveyBuilderCanvasProps } from "../../utils/types";
import DevicePreview from "../DevicePreview";

import ElementBackgroundPreferencesButtons from "./ElementBackgroundPreferencesButtons";
import ElementBackgroundPreferencesRemoveButtons from "./ElementBackgroundPreferencesRemoveButtons";
import QuestionBackgroundColor from "./ElementSettings/ElementSettingsComponents/QuestionBackgroundColor";

const SurveyBuilderCanvas = ({
  display,
  canvasQuestion,
}: SurveyBuilderCanvasProps) => {
  const [colorAnchorEl, setColorAnchorEl] = useState<HTMLButtonElement | null>(
    null,
  );

  const selectedQuestion = useAppSelector(
    (state: RootState) => state.question.selectedQuestion,
  );

  // const question =
  //   selectedQuestion?.questionID === canvasQuestion?.questionID
  //     ? selectedQuestion
  //     : canvasQuestion;

  const question = selectedQuestion ?? canvasQuestion;

  const questionType = question?.type as QuestionTypeKey;
  const backgroundColor =
    question?.questionPreferences?.questionBackgroundColor ?? "#ffffff";

  const templateUrl = question?.questionPreferences?.questionImageTemplateUrl;
  const templateImage = question?.questionPreferences?.questionImageTemplate;

  const backgroundImage =
    templateImage && templateUrl ? `url(${templateUrl})` : "none";

  const QuestionComponent =
    elementComponents[question?.type as QuestionTypeKey];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        margin: "auto",
        width: "96%",
        height: { md: "70vh", xl: "72vh" },
        flexGrow: 1,
        borderRadius: "24px",
        // back: "#FFFFFF",
        border: "3px solid #E0E0E0",
        boxShadow: " 0 4px 20px rgba(0, 0, 0, 0.08)",
        mt: "1%",
        mb: "2%",
        p: display === "mobile" ? 0.5 : 2,
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
      <DevicePreview display={display}>
        {questionType !== "THREE_D" && (
          <>
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
          </>
        )}
        <Box
          sx={{
            margin: "auto",
            width: "96%",
            // height: "100%",
          }}
        >
          <AnimatePresence mode="wait">
            {question?.type && (
              <motion.div
                key={question?.questionID}
                /** Enter animation */
                initial={{ opacity: 0, y: 24 }}
                /** Final state */
                animate={{ opacity: 1, y: 0 }}
                /** Exit animation */
                exit={{ opacity: 0, y: -24 }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
                style={{ width: "100%" }}
              >
                {/* Element view */}
                {question?.type && (
                  <QuestionComponent
                    key={question?.questionID}
                    qID={question?.questionID}
                    qNO={question?.order?.toString()}
                    qText={question?.text}
                    qDescription={question?.description}
                    qType={question?.type}
                    qImage={question?.questionImage}
                    // qSettings={question?.config}
                    display={display}
                    showQuestion={question?.Model3D?.showQuestion}
                  />
                )}{" "}
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </DevicePreview>
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          width: "100%",
          height: "48px",
          pointerEvents: "none",
          zIndex: 2,
          boxShadow: "0 -18px 24px -16px rgba(0,0,0,0.35) inset",
        }}
      />
    </Box>
  );
};

export default SurveyBuilderCanvas;
