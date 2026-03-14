import { useEffect, useState } from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";

import { useMutateQuestionTypeMutation } from "../../../../app/slices/elementApiSlice";
import { updateQuestionField } from "../../../../app/slices/elementSlice";
import { RootState } from "../../../../app/store";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../app/typedReduxHooks";
import { orderedElementTypes } from "../../../../utils/constants";
import { elementIcons, questionTypes } from "../../../../utils/elementsConfig";
import { QuestionType } from "../../../../utils/types";
import { willLoseOptions } from "../../../../utils/utils";

import { MutateConfirmationDialog } from "./MutateConfirmationDialog";

export const QuestionTypeMutationSettings = () => {
  const question = useAppSelector(
    (state: RootState) => state.question.selectedQuestion,
  );

  const dispatch = useAppDispatch();

  const { questionID, type } = question || {};
  const optionCount = question?.options?.length ?? 0;

  const [mutateQuestionType, { isLoading }] = useMutateQuestionTypeMutation();

  const [pendingType, setPendingType] = useState<QuestionType | null>(null);
  const [displayType, setDisplayType] = useState<QuestionType | "">(
    (type as QuestionType) || "",
  );

  // Order defined by orderedElementTypes.
  const availableTypes = orderedElementTypes
    .map((t) => questionTypes.find((q) => q.type === t))
    .filter(Boolean);

  useEffect(() => {
    setDisplayType((type as QuestionType) || "");
  }, [type, questionID]);

  const applyType = async (targetType: QuestionType) => {
    const previousType = (type as QuestionType) || "";

    try {
      if (!questionID) return;

      setDisplayType(targetType);

      await mutateQuestionType({
        questionID,
        targetType,
      }).unwrap();

      dispatch(
        updateQuestionField({
          key: "type",
          value: targetType,
        }),
      );

      setPendingType(null);
    } catch (error) {
      // Revert local UI if mutation fails.
      setDisplayType(previousType);
      console.error(error);
    }
  };

  // Triggered when the dropdown changes.
  const changeType = async (newType: QuestionType) => {
    if (!questionID || newType === type) return;

    if (type && willLoseOptions(type as QuestionType, newType, optionCount)) {
      setPendingType(newType);
      return;
    }

    await applyType(newType);
  };

  return (
    <>
      <Accordion
        sx={{
          width: "100%",
          backgroundColor: "#FFFFFF",
          borderTop: "1px solid #E0E0E0",
          boxShadow: "none",
        }}
        disableGutters
        elevation={0}
        square
        defaultExpanded
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              fontWeight: 600,
              color: "#453F46",
            }}
          >
            {/* Show the currently displayed type icon instantly */}
            {isLoading ? (
              <CircularProgress size={18} />
            ) : displayType ? (
              elementIcons[displayType]
            ) : null}

            <Tooltip title="Change the question type">
              <Typography>Question Type</Typography>
            </Tooltip>
          </Box>
        </AccordionSummary>

        <AccordionDetails sx={{ px: { md: 1, xl: 1 }, pb: 2 }}>
          <Box
            sx={{
              width: "96%",
              marginLeft: "2%",
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            <FormControl size="small">
              <Select
                value={displayType || ""}
                disabled={isLoading}
                onChange={(e) => changeType(e.target.value as QuestionType)}
              >
                {availableTypes.map((q) => (
                  <MenuItem key={q!.type} value={q!.type}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      {q!.icon}
                      {q!.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </AccordionDetails>
      </Accordion>

      <MutateConfirmationDialog
        pendingType={pendingType}
        setPendingType={setPendingType}
        applyType={applyType}
      />
    </>
  );
};
