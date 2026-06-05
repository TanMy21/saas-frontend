import { useEffect, useRef, useState } from "react";

import { type DropResult } from "react-beautiful-dnd";

import {
  useCreateNewOptionMutation,
  useDeleteOptionMutation,
  useGetOptionsOfQuestionQuery,
  useUpdateOptionOrderMutation,
} from "../../../app/slices/optionApiSlice";
import { RootState } from "../../../app/store";
import { useAppSelector } from "../../../app/typedReduxHooks";
import useAuth from "../../../hooks/useAuth";
import { useToast } from "../../../hooks/useToast";
import { ConceptFitStimulusLayoutProps } from "../../../types/surveyBuilderTypes";
import {
  MAX_CONCEPT_ATTRIBUTES,
  MIN_RECOMMENDED_ATTRIBUTES,
} from "../../../utils/constants";
import { showToast } from "../../../utils/showToast";
import { ElementProps, OptionType } from "../../../utils/types";

import { ConceptFitImageOnlyStimulus } from "./ConceptFitImageOnlyStimulus";
import { ConceptTextOnlyStimulus } from "./ConceptTextOnlyStimulus";

export const ConceptFitResponse = ({ qID, display, qImage }: ElementProps) => {
  const { can } = useAuth();

  const question = useAppSelector(
    (state: RootState) => state.question.selectedQuestion,
  );

  const conceptDisplayMode =
    question?.questionPreferences?.uiConfig?.conceptDisplayMode ?? "TEXT";

  const canCreate = can("CREATE_OPTION");
  const canEdit = can("UPDATE_OPTION");
  const canDelete = can("DELETE_OPTION");
  const canReorder = can("REORDER_OPTION");

  const { data: options = [] as OptionType[] } = useGetOptionsOfQuestionQuery(
    qID!,
  );

  const [localOptions, setLocalOptions] = useState<OptionType[]>(options);
  const [inputValue, setInputValue] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [createNewOption, { isError, error }] = useCreateNewOptionMutation();
  const [deleteOption] = useDeleteOptionMutation();
  const [updateOptionOrder] = useUpdateOptionOrderMutation();

  /**
   * Keeps local drag/drop state synced with server-fetched attributes.
   */
  useEffect(() => {
    setLocalOptions(options);
  }, [options]);

  /**
   * Auto-resizes the bulk attribute input.
   */
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [inputValue]);

  useToast({
    isError,
    error,
    errorFallbackMessage: "Something went wrong.",
  });

  /**
   * Adds concept-fit attributes in bulk.
   * Each line becomes one attribute word.
   */
  const handleAddAttributes = async () => {
    const lines = inputValue
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length === 0) return;

    const available = MAX_CONCEPT_ATTRIBUTES - localOptions.length;

    if (available <= 0) {
      showToast.info("Concept fit supports up to 10 attributes.");
      return;
    }

    const batch = lines
      .slice(0, available)
      .map((text) => ({ text, value: text }));

    try {
      await createNewOption({ questionID: qID!, options: batch }).unwrap();
      setInputValue("");

      if (lines.length > available) {
        showToast.info(
          `Only ${available} attribute(s) added because the limit is 10.`,
        );
      }
    } catch (err) {
      console.error("Concept fit add attributes error:", err);
      showToast.error("Failed to add concept fit attributes.");
    }
  };

  /**
   * Deletes one attribute using the existing option delete mutation.
   */
  const handleDeleteAttribute = async (optionID: string) => {
    if (!canDelete) return;

    try {
      await deleteOption(optionID).unwrap();
    } catch (error) {
      console.error("Concept fit attribute delete error:", error);
      showToast.error("Failed to delete concept fit attribute.");
    }
  };

  /**
   * Reorders attributes using the existing option order mutation.
   */
  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    if (!destination || source.index === destination.index) return;

    const reordered = Array.from(localOptions);
    const [moved] = reordered.splice(source.index, 1);

    reordered.splice(destination.index, 0, moved);

    const reorderedWithOrder = reordered.map((option, idx) => ({
      ...option,
      order: idx + 1,
    }));

    setLocalOptions(reorderedWithOrder);

    await updateOptionOrder({ options: reorderedWithOrder })
      .unwrap()
      .catch((err) => console.error("Concept fit order update error:", err));
  };

  const canAddMore = localOptions.length < MAX_CONCEPT_ATTRIBUTES;
  const hasMinimumRecommended =
    localOptions.length >= MIN_RECOMMENDED_ATTRIBUTES;

  const stimulusProps: ConceptFitStimulusLayoutProps = {
    qID,
    display,
    localOptions,
    inputValue,
    textareaRef,
    canCreate,
    canEdit,
    canDelete,
    canReorder,
    canAddMore,
    qImage,
    hasMinimumRecommended,
    setInputValue,
    handleAddAttributes,
    handleDeleteAttribute,
    handleDragEnd,
  };

  if (conceptDisplayMode === "IMAGE") {
    return <ConceptFitImageOnlyStimulus {...stimulusProps} />;
  }

  return <ConceptTextOnlyStimulus {...stimulusProps} />;
};
