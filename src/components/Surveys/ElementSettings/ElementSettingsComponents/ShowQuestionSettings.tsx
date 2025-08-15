import { useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";

import { useToggle3DModelQuestionVisibilityMutation } from "../../../../app/slices/elementApiSlice";
import { toggleShowQuestionfor3dType } from "../../../../app/slices/elementSlice";
import { RootState } from "../../../../app/store";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../app/typedReduxHooks";
import { useSurveyCanvasRefetch } from "../../../../context/BuilderRefetchCanvas";
import { uiConfigPreferenceSchema } from "../../../../utils/schema";
import { QuestionSetting } from "../../../../utils/types";

const ShowQuestionSettings = () => {
  const dispatch = useAppDispatch();
  const refetchCanvas = useSurveyCanvasRefetch();
  const question = useAppSelector(
    (state: RootState) => state.question.selectedQuestion
  );

  const questionID = question?.questionID;
  const showQuestion = question?.Model3D?.showQuestion;

  const [toggle3DModelQuestionVisibility] =
    useToggle3DModelQuestionVisibilityMutation();

  const { handleSubmit, control, reset } = useForm<QuestionSetting>({
    resolver: zodResolver(uiConfigPreferenceSchema),
    defaultValues: {
      showQuestion,
    },
  });

  const watchedValues = useWatch({ control });
  const [formTouched, setFormTouched] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onSubmit = async (data: QuestionSetting) => {
    try {
      const { showQuestion } = data;

      const result = await toggle3DModelQuestionVisibility({
        questionID,
        showQuestion,
      });
      if (result) {
        refetchCanvas();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const markFormTouched = () => {
    if (!formTouched) setFormTouched(true);
  };

  useEffect(() => {
    if (showQuestion !== undefined) {
      reset({ showQuestion });
    }
  }, [showQuestion, reset]);

  useEffect(() => {
    if (!formTouched) return;

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      handleSubmit(onSubmit)();
      setFormTouched(false);
    }, 1000);
  }, [watchedValues, formTouched, handleSubmit]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Accordion
        sx={{
          width: "100%",
          backgroundColor: "#FFFFFF",
          borderTop: "1px solid #E0E0E0",
          borderRadius: 0,
          boxShadow: "none",
          "&:before": { display: "none" },
          "& .MuiAccordionSummary-root": {
            borderTopLeftRadius: "0px",
            borderTopRightRadius: "0px",
          },
        }}
        defaultExpanded={false}
        disableGutters
        elevation={0}
        square
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 2,
              fontWeight: 500,
              color: "#453F46",
            }}
          >
            <CheckCircleOutlineIcon
              sx={{ color: "#752FEC", fontSize: "20px" }}
            />
            <Tooltip title="Set whether the question is shown or not">
              <Typography>Show Question</Typography>
            </Tooltip>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "96%",
              height: "80%",
              marginLeft: "4%",
              // border: "2px solid red",
            }}
          >
            <Box
              mt={1}
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "0%",
                width: "98%",
                height: "80%",
              }}
            >
              <Box sx={{ fontWeight: 500, color: "#3F3F46" }}>
                Show question
              </Box>
              <Box mt={1}>
                <Controller
                  name="showQuestion"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onChange={(event) => {
                        const value = event.target.checked;
                        field.onChange(value);
                        markFormTouched();
                        dispatch(toggleShowQuestionfor3dType(value));
                      }}
                    />
                  )}
                />
              </Box>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </form>
  );
};

export default ShowQuestionSettings;
