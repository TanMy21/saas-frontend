import { useEffect, useRef, useState } from "react";

import {
  useDeleteOptionMutation,
  useUpdateOptionTextandValueMutation,
} from "../app/slices/optionApiSlice";
import { SOFT_EDIT_MESSAGES } from "../utils/constants";
import { showToast } from "../utils/showToast";
import { OptionType } from "../utils/types";

import useAuth from "./useAuth";
import { useSurveyEditLock } from "./useSurveyEditLock";

const useMediaOptionEditor = (option: OptionType) => {
  const { can } = useAuth();
  const { confirmSoftEdit } = useSurveyEditLock();

  const canEdit = can("UPDATE_OPTION");
  const canDelete = can("DELETE_OPTION");
  const canReorder = can("REORDER_OPTION");

  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [draftLabel, setDraftLabel] = useState(option.value);
  const [labelError, setLabelError] = useState("");

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [updateOptionTextandValue] = useUpdateOptionTextandValueMutation();
  const [deleteOption] = useDeleteOptionMutation();

  useEffect(() => {
    if (!isEditingLabel) {
      setDraftLabel(option.value);
    }
  }, [option.value, isEditingLabel]);

  useEffect(() => {
    if (!isEditingLabel) return;

    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);

    return () => window.clearTimeout(focusTimer);
  }, [isEditingLabel]);

  const startEditingLabel = () => {
    if (!canEdit) return;

    setLabelError("");
    setDraftLabel(option.value);
    setIsEditingLabel(true);
  };

  const cancelLabelEdit = () => {
    setDraftLabel(option.value);
    setLabelError("");
    setIsEditingLabel(false);
  };

  const changeDraftLabel = (value: string) => {
    setDraftLabel(value);
    if (labelError) setLabelError("");
  };

  const saveLabel = async () => {
    const nextValue = draftLabel.trim();

    if (!nextValue) {
      setLabelError("Name required");
      inputRef.current?.focus();
      return;
    }

    if (nextValue === option.value.trim()) {
      setIsEditingLabel(false);
      return;
    }

    if (!(await confirmSoftEdit(SOFT_EDIT_MESSAGES.OPTION_CHANGE))) return;

    try {
      await updateOptionTextandValue({
        optionID: option.optionID,
        text: nextValue,
        value: nextValue,
      }).unwrap();

      setLabelError("");
      setIsEditingLabel(false);
    } catch (error) {
      console.error("Rename media option error:", error);
      showToast.error("Failed to rename option.");
    }
  };

  const deleteChoice = async () => {
    if (!canDelete) return;
    if (!(await confirmSoftEdit(SOFT_EDIT_MESSAGES.OPTION_CHANGE))) return;

    try {
      await deleteOption(option.optionID).unwrap();
    } catch (error) {
      console.error("Delete media option error:", error);
      showToast.error("Failed to delete option.");
    }
  };

  return {
    canEdit,
    canDelete,
    canReorder,
    isEditingLabel,
    draftLabel,
    labelError,
    inputRef,
    startEditingLabel,
    cancelLabelEdit,
    changeDraftLabel,
    saveLabel,
    deleteChoice,
  };
};

export default useMediaOptionEditor;
