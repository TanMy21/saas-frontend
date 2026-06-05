import { useEffect, useRef, useState } from "react";

import type { DropResult } from "react-beautiful-dnd";

import {
  useCreateNewOptionMutation,
  useDeleteOptionMutation,
  useGetOptionsOfQuestionQuery,
  useUpdateOptionOrderMutation,
} from "../app/slices/optionApiSlice";
import { MAX_DROPDOWN_OPTIONS } from "../utils/constants";
import { showToast } from "../utils/showToast";
import { OptionType } from "../utils/types";


export const useDropdownOptions = ({
  qID,
  canDelete,
}: {
  qID: string;
  canDelete: boolean;
}) => {
  const { data: options = [] as OptionType[] } =
    useGetOptionsOfQuestionQuery(qID);

  const [localOptions, setLocalOptions] = useState<OptionType[]>(options);
  const [inputValue, setInputValue] = useState("");
  const [isCreatingReviewedOptions, setIsCreatingReviewedOptions] =
    useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [createNewOption, createState] = useCreateNewOptionMutation();
  const [updateOptionOrder] = useUpdateOptionOrderMutation();
  const [deleteOption] = useDeleteOptionMutation();

  /**
   * Keeps local drag/drop state synced with server options after fetching or mutation refresh.
   */
  useEffect(() => {
    setLocalOptions(options);
  }, [options]);

  /**
   * Auto-resizes the manual bulk input as the creator types or pastes multiple lines.
   */
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [inputValue]);

  /**
   * Creates options from manual textarea input.
   * Each non-empty line becomes one option until the dropdown reaches the 100-option limit.
   */
  const handleAddOptions = async () => {
    const lines = inputValue
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length === 0) return;

    const available = MAX_DROPDOWN_OPTIONS - localOptions.length;

    if (available <= 0) {
      showToast.info("Dropdown option limit reached (100 options).");
      return;
    }

    const batch = lines.slice(0, available).map((text) => ({
      text,
      value: text,
    }));

    try {
      await createNewOption({ questionID: qID, options: batch }).unwrap();
      setInputValue("");

      if (lines.length > available) {
        showToast.info(
          `Only ${available} option(s) added because the dropdown limit is 100.`,
        );
      }
    } catch (error) {
      console.error("Dropdown add options error:", error);
      showToast.error("Failed to add dropdown options.");
    }
  };

  /**
   * Reorders dropdown options locally first, then persists the new order through the backend.
   */
  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    if (!destination || source.index === destination.index) return;

    const reordered = Array.from(localOptions);
    const [moved] = reordered.splice(source.index, 1);

    reordered.splice(destination.index, 0, moved);

    const reorderedWithOrder = reordered.map((option, index) => ({
      ...option,
      order: index + 1,
    }));

    setLocalOptions(reorderedWithOrder);

    await updateOptionOrder({ options: reorderedWithOrder })
      .unwrap()
      .catch((error) => {
        console.error("Dropdown order update error:", error);
        showToast.error("Failed to update dropdown order.");
      });
  };

  /**
   * Deletes an existing dropdown option from the backend.
   */
  const handleDeleteOption = async (optionID: string) => {
    if (!canDelete) return;

    try {
      await deleteOption(optionID).unwrap();
    } catch (error) {
      console.error("Dropdown option delete error:", error);
      showToast.error("Failed to delete dropdown option.");
    }
  };

  /**
   * Creates already-reviewed generated options through the regular trusted option endpoint.
   */
  const createReviewedOptions = async (
    generatedOptions: { text: string; value: string; order: number }[],
  ) => {
    const cleanedOptions = generatedOptions
      .map((option) => ({
        text: option.text.trim(),
        value: option.text.trim(),
      }))
      .filter((option) => option.text);

    if (cleanedOptions.length === 0) {
      showToast.info("No generated options to add.");
      return false;
    }

    const available = MAX_DROPDOWN_OPTIONS - localOptions.length;

    if (cleanedOptions.length > available) {
      showToast.info(`Only ${available} option(s) can be added.`);
      return false;
    }

    try {
      setIsCreatingReviewedOptions(true);

      await createNewOption({
        questionID: qID,
        options: cleanedOptions,
      }).unwrap();

      showToast.success(`${cleanedOptions.length} option(s) added.`);
      return true;
    } catch (error) {
      console.error("Finalize generated dropdown options error:", error);
      showToast.error("Failed to add generated options.");
      return false;
    } finally {
      setIsCreatingReviewedOptions(false);
    }
  };

  return {
    options: localOptions,
    inputValue,
    textareaRef,
    createState,
    isCreatingReviewedOptions,
    setInputValue,
    handleAddOptions,
    handleDragEnd,
    handleDeleteOption,
    createReviewedOptions,
  };
};
