import { useEffect, useRef, useState } from "react";

import { Box, Typography } from "@mui/material";

import { useUpdateQuestionPreferenceUIConfigMutation } from "../../../app/slices/elementApiSlice";
import { updateQuestionField } from "../../../app/slices/elementSlice";
import { RootState } from "../../../app/store";
import { useAppDispatch, useAppSelector } from "../../../app/typedReduxHooks";
import useAuth from "../../../hooks/useAuth";
import {
  DEFAULT_CONCEPT_FIT_LEFT_TEXT,
  DEFAULT_CONCEPT_FIT_RIGHT_TEXT,
  DEFAULT_TIMER_SECONDS,
  timerDrain,
} from "../../../utils/constants";
import { showToast } from "../../../utils/showToast";
import { QuestionUIConfig } from "../../../utils/types";

import { ConceptFitEditableResponseBox } from "./ConceptFitEditableResponseBox";

export const ConceptFitPreview = ({
  firstAttribute,
}: {
  firstAttribute?: string;
}) => {
  const dispatch = useAppDispatch();

  const { can } = useAuth();
  const canEditQuestion = can("UPDATE_QUESTION");

  const question = useAppSelector(
    (state: RootState) => state.question.selectedQuestion,
  );

  const questionID = question?.questionID;
  const uiConfig = question?.questionPreferences?.uiConfig || {};

  const [updateQuestionPreferenceUIConfig, { isLoading: isSavingConceptFit }] =
    useUpdateQuestionPreferenceUIConfigMutation();

  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [leftText, setLeftText] = useState(
    uiConfig.conceptFitLeftText || DEFAULT_CONCEPT_FIT_LEFT_TEXT,
  );

  const [rightText, setRightText] = useState(
    uiConfig.conceptFitRightText || DEFAULT_CONCEPT_FIT_RIGHT_TEXT,
  );

  const timeLimitMs =
    questionID && typeof uiConfig.timeLimitMs === "number"
      ? uiConfig.timeLimitMs
      : DEFAULT_TIMER_SECONDS * 1000;

  const timeLimitSeconds = Math.max(1, Math.round(timeLimitMs / 1000));

  /**
   * Hydrates inline response labels when the selected question changes.
   */
  useEffect(() => {
    setLeftText(uiConfig.conceptFitLeftText || DEFAULT_CONCEPT_FIT_LEFT_TEXT);
    setRightText(
      uiConfig.conceptFitRightText || DEFAULT_CONCEPT_FIT_RIGHT_TEXT,
    );
  }, [questionID, uiConfig.conceptFitLeftText, uiConfig.conceptFitRightText]);

  /**
   * Updates selected question uiConfig immediately so the preview stays live.
   */
  const updateConceptFitPreview = (
    partialUiConfig: Partial<QuestionUIConfig>,
  ) => {
    dispatch(
      updateQuestionField({
        key: "questionPreferences",
        value: {
          ...question?.questionPreferences,
          uiConfig: {
            ...uiConfig,
            ...partialUiConfig,
          },
        } as any,
      }),
    );
  };

  /**
   * Saves the editable Concept Fit labels through the existing uiConfig endpoint.
   */
  const saveConceptFitLabels = async (
    nextLeftText: string,
    nextRightText: string,
  ) => {
    if (!questionID || !canEditQuestion) return;

    const safeLeftText = nextLeftText.trim() || DEFAULT_CONCEPT_FIT_LEFT_TEXT;

    const safeRightText =
      nextRightText.trim() || DEFAULT_CONCEPT_FIT_RIGHT_TEXT;

    const nextUiConfig = {
      ...uiConfig,
      conceptFitLeftText: safeLeftText,
      conceptFitRightText: safeRightText,
    };

    try {
      await updateQuestionPreferenceUIConfig({
        questionID,
        uiConfig: nextUiConfig,
      }).unwrap();
    } catch (error) {
      console.error("Concept fit labels update error:", error);
      showToast.error("Failed to update concept fit labels.");
    }
  };

  /**
   * Handles inline label edits and debounces the existing uiConfig mutation.
   */
  const handleConceptFitLabelChange = (
    side: "left" | "right",
    nextValue: string,
  ) => {
    if (!canEditQuestion) return;

    const nextLeftText = side === "left" ? nextValue : leftText;
    const nextRightText = side === "right" ? nextValue : rightText;

    setLeftText(nextLeftText);
    setRightText(nextRightText);

    updateConceptFitPreview({
      conceptFitLeftText: nextLeftText,
      conceptFitRightText: nextRightText,
    });

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      saveConceptFitLabels(nextLeftText, nextRightText);
    }, 700);
  };

  /**
   * Clears pending label save when preview unmounts.
   */
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Box
      sx={{
        border: "1px solid #A5F3FC",
        bgcolor: "#ECFEFF",
        borderRadius: 3,
        p: 2,
        opacity: isSavingConceptFit ? 0.92 : 1,
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: 2,
        }}
      >
        <ConceptFitEditableResponseBox
          keyLabel="E"
          value={leftText}
          placeholder={DEFAULT_CONCEPT_FIT_LEFT_TEXT}
          disabled={!canEditQuestion}
          onChange={(value) => handleConceptFitLabelChange("left", value)}
        />

        <Box
          sx={{
            minWidth: 130,
            borderRadius: 2,
            bgcolor: "#FFFFFF",
            border: "1px solid #E2E8F0",
            px: 2,
            py: 2,
            textAlign: "center",
            boxShadow: "0 8px 22px rgba(15,23,42,0.06)",
          }}
        >
          <Typography sx={{ fontSize: 18, fontWeight: 900, color: "#0F172A" }}>
            {firstAttribute || "Premium"}
          </Typography>
        </Box>

        <ConceptFitEditableResponseBox
          keyLabel="I"
          value={rightText}
          placeholder={DEFAULT_CONCEPT_FIT_RIGHT_TEXT}
          disabled={!canEditQuestion}
          onChange={(value) => handleConceptFitLabelChange("right", value)}
        />
      </Box>
    </Box>
  );
};
