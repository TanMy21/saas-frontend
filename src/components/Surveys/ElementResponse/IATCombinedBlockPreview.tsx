import { Box, Typography } from "@mui/material";

import { useUpdateQuestionPreferenceUIConfigMutation } from "../../../app/slices/elementApiSlice";
import { updateQuestionField } from "../../../app/slices/elementSlice";
import { RootState } from "../../../app/store";
import { useAppDispatch, useAppSelector } from "../../../app/typedReduxHooks";
import useAuth from "../../../hooks/useAuth";
import { IATCombinedBlockPreviewProps } from "../../../types/surveyBuilderTypes";
import { getIATUiConfig } from "../../../utils/iatUtils";
import { showToast } from "../../../utils/showToast";

import { IATCombinedSideCard } from "./IATCombinedSideCard";

export const IATCombinedBlockPreview = ({
  centerStimulus,
}: IATCombinedBlockPreviewProps) => {
  const { can } = useAuth();
  const canEditQuestion = can("UPDATE_QUESTION");
  const dispatch = useAppDispatch();

  const question = useAppSelector(
    (state: RootState) => state.question.selectedQuestion,
  );

  const questionID = question?.questionID;
  const uiConfig = getIATUiConfig(question?.questionPreferences?.uiConfig);

  const [updateQuestionPreferenceUIConfig] =
    useUpdateQuestionPreferenceUIConfigMutation();

  /**
   * Updates the local Redux preview immediately and persists the changed IAT labels.
   * The canvas editor and settings panel both write to the same uiConfig fields.
   */
  const updateIATInlineLabel = async (
    key: "iatBrandA" | "iatBrandB" | "iatThemeA" | "iatThemeB",
    label: string,
  ) => {
    if (!canEditQuestion || !questionID) return;

    const cleanLabel = label.trim();

    if (!cleanLabel) {
      showToast.error("Label cannot be empty.");
      return;
    }

    const nextUiConfig = {
      ...question?.questionPreferences?.uiConfig,
      [key]: {
        ...uiConfig[key],
        label: cleanLabel,
      },
    };

    dispatch(
      updateQuestionField({
        key: "questionPreferences",
        value: {
          ...question?.questionPreferences,
          uiConfig: nextUiConfig,
        } as any,
      }),
    );

    try {
      await updateQuestionPreferenceUIConfig({
        questionID,
        uiConfig: nextUiConfig,
      }).unwrap();
    } catch (error) {
      console.error("IAT inline label update error:", error);
      showToast.error("Failed to update IAT label.");
    }
  };

  return (
    <Box
      sx={{
        border: "1px solid #FBCFE8",
        bgcolor: "#FDF2F8",
        borderRadius: 3,
        p: 2,
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr auto 1fr" },
          alignItems: "center",
          gap: 2,
        }}
      >
        <IATCombinedSideCard
          keyLabel={uiConfig.iatLeftKey}
          brandLabel={uiConfig.iatBrandA.label}
          themeLabel={uiConfig.iatThemeA.label}
          canEdit={canEditQuestion}
          onBrandUpdate={(value) => updateIATInlineLabel("iatBrandA", value)}
          onThemeUpdate={(value) => updateIATInlineLabel("iatThemeA", value)}
        />

        <Box
          sx={{
            minWidth: { xs: "100%", sm: 150 },
            borderRadius: 2,
            bgcolor: "#FFFFFF",
            border: "1px solid #E2E8F0",
            px: 2,
            py: 2.5,
            textAlign: "center",
            boxShadow: "0 8px 22px rgba(15,23,42,0.06)",
          }}
        >
          <Typography sx={{ fontSize: 20, fontWeight: 900, color: "#0F172A" }}>
            {centerStimulus || "Add attributes"}
          </Typography>
        </Box>

        <IATCombinedSideCard
          keyLabel={uiConfig.iatRightKey}
          brandLabel={uiConfig.iatBrandB.label}
          themeLabel={uiConfig.iatThemeB.label}
          canEdit={canEditQuestion}
          onBrandUpdate={(value) => updateIATInlineLabel("iatBrandB", value)}
          onThemeUpdate={(value) => updateIATInlineLabel("iatThemeB", value)}
        />
      </Box>
    </Box>
  );
};
