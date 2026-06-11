import { useEffect, useRef, useState } from "react";

import { Box, IconButton, TextField, Typography } from "@mui/material";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "react-beautiful-dnd";
import { MdAdd } from "react-icons/md";

import {
  useCreateNewOptionMutation,
  useDeleteOptionMutation,
  useGetOptionsOfQuestionQuery,
  useUpdateOptionOrderMutation,
  useUpdateOptionTextandValueMutation,
} from "../../../app/slices/optionApiSlice";
import useAuth from "../../../hooks/useAuth";
import { useToast } from "../../../hooks/useToast";
import { IATStimulusManagerProps } from "../../../types/surveyBuilderTypes";
import {
  MAX_IAT_STIMULI,
  MIN_RECOMMENDED_IAT_STIMULI,
} from "../../../utils/constants";
import { showToast } from "../../../utils/showToast";
import { OptionType } from "../../../utils/types";

import { IATStimulusRow } from "./IATStimulusRow";

export const IATStimulusManager = ({
  qID,
  display,
}: IATStimulusManagerProps) => {
  const isMobile = display === "mobile";

  const { can } = useAuth();

  const canCreate = can("CREATE_OPTION");
  const canEdit = can("UPDATE_OPTION");
  const canDelete = can("DELETE_OPTION");
  const canReorder = can("REORDER_OPTION");

  const { data: options = [] as OptionType[] } = useGetOptionsOfQuestionQuery(
    qID!,
    {
      skip: !qID,
    },
  );

  const [localStimuli, setLocalStimuli] = useState<OptionType[]>(options);
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [createNewOption, { isError, error }] = useCreateNewOptionMutation();
  const [deleteOption] = useDeleteOptionMutation();
  const [updateOptionOrder] = useUpdateOptionOrderMutation();
  const [updateOptionTextandValue] = useUpdateOptionTextandValueMutation();

  /**
   * Keeps local drag/drop state synced with server-fetched stimuli.
   */
  useEffect(() => {
    const sorted = [...options].sort((a, b) => (a.order || 0) - (b.order || 0));
    setLocalStimuli(sorted);
  }, [options]);

  /**
   * Auto-resizes the bulk stimulus input.
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

  const canAddMore = localStimuli.length < MAX_IAT_STIMULI;
  const hasMinimumRecommended =
    localStimuli.length >= MIN_RECOMMENDED_IAT_STIMULI;

  /**
   * Adds IAT stimuli in bulk.
   * Each non-empty line becomes one option row.
   */
  const handleAddStimuli = async () => {
    if (!qID || !canCreate) return;

    const lines = inputValue
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length === 0) return;

    const available = MAX_IAT_STIMULI - localStimuli.length;

    if (available <= 0) {
      showToast.info("IAT supports up to 30 stimuli.");
      return;
    }

    const batch = lines.slice(0, available).map((text) => ({
      text,
      value: text,
    }));

    try {
      await createNewOption({
        questionID: qID,
        options: batch,
      }).unwrap();

      setInputValue("");

      if (lines.length > available) {
        showToast.info(
          `Only ${available} stimulus item(s) added because the limit is 30.`,
        );
      }
    } catch (error) {
      console.error("IAT add stimuli error:", error);
      showToast.error("Failed to add IAT stimuli.");
    }
  };

  /**
   * Updates one stimulus text and keeps value aligned with text.
   */
  const handleUpdateStimulus = async (option: OptionType, nextText: string) => {
    if (!canEdit) return;

    const cleanText = nextText.trim();

    if (!cleanText) {
      showToast.error("Stimulus cannot be empty.");
      return;
    }

    if (cleanText === option.text) return;

    try {
      await updateOptionTextandValue({
        optionID: option.optionID,
        text: cleanText,
        value: cleanText,
      }).unwrap();
    } catch (error) {
      console.error("IAT stimulus update error:", error);
      showToast.error("Failed to update stimulus.");
    }
  };

  /**
   * Deletes one IAT stimulus option.
   */
  const handleDeleteStimulus = async (optionID: string) => {
    if (!canDelete) return;

    try {
      await deleteOption(optionID).unwrap();
    } catch (error) {
      console.error("IAT stimulus delete error:", error);
      showToast.error("Failed to delete stimulus.");
    }
  };

  /**
   * Reorders IAT stimuli using existing option order mutation.
   */
  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    if (!canReorder || !destination || source.index === destination.index) {
      return;
    }

    const reordered = Array.from(localStimuli);
    const [moved] = reordered.splice(source.index, 1);

    reordered.splice(destination.index, 0, moved);

    const reorderedWithOrder = reordered.map((option, idx) => ({
      ...option,
      order: idx + 1,
    }));

    setLocalStimuli(reorderedWithOrder);

    try {
      await updateOptionOrder({ options: reorderedWithOrder }).unwrap();
    } catch (error) {
      console.error("IAT stimulus order update error:", error);
      showToast.error("Failed to update stimulus order.");
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "#FFFFFF",
        p: isMobile ? 1.5 : 2,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 700,
            color: hasMinimumRecommended ? "#64748B" : "#B45309",
            whiteSpace: "nowrap",
          }}
        >
          {localStimuli.length}/{MAX_IAT_STIMULI}
        </Typography>
      </Box>

      <Box
        sx={{
          border: "1px solid #E2E8F0",
          borderRadius: 2,
          bgcolor: "#F8FAFC",
          p: 1.5,
          maxHeight: 340,

          // Allows scrolling when content is taller than maxHeight.
          overflowY: "auto",
          overflowX: "hidden",

          // Firefox: hides scrollbar but keeps scroll behavior.
          scrollbarWidth: "none",

          // IE/old Edge: hides scrollbar but keeps scroll behavior.
          msOverflowStyle: "none",

          // Chrome/Safari/Edge: hides scrollbar but keeps scroll behavior.
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId={`iat-stimuli-${qID}`}>
            {(provided) => (
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                {localStimuli.map((option, index) => (
                  <Draggable
                    key={option.optionID}
                    draggableId={option.optionID}
                    index={index}
                    isDragDisabled={!canReorder}
                  >
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        sx={{
                          outline: "none",
                          "&:focus": { outline: "none" },
                          "&:focus-visible": { outline: "none" },
                        }}
                      >
                        <IATStimulusRow
                          option={option}
                          index={index}
                          canEdit={canEdit}
                          canDelete={canDelete}
                          canReorder={canReorder}
                          dragHandleProps={provided.dragHandleProps}
                          onUpdate={handleUpdateStimulus}
                          onDelete={handleDeleteStimulus}
                        />
                      </Box>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>

        {localStimuli.length === 0 && (
          <Typography
            sx={{
              fontSize: 14,
              color: "#64748B",
              textAlign: "center",
              py: 3,
            }}
          >
            Add words like Premium, Cheap, Modern, Risky, Brand A, or Brand B.
          </Typography>
        )}
      </Box>

      {canCreate && !isMobile && (
        <Box
          sx={{
            position: "relative",
            width: "94%",
            mx: "auto",
            mt: 1,
            px: 1,
            pt: 0.75,
            pb: 0.75,  
            bgcolor: "#FFFFFF",
          }}
        >
          <TextField
            multiline
            minRows={1}
            disabled={!canAddMore}
            inputRef={textareaRef}
            placeholder="Type or paste stimuli, one per line…"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: {
                bgcolor: "transparent",
                lineHeight: 1.6,
                fontSize: 15,
                color: "inherit",
                pr: 5,
              },
            }}
            sx={{
              width: "100%",
              "& .MuiInputBase-root": {
                bgcolor: "transparent",
              },
            }}
          />

          <IconButton
            onClick={handleAddStimuli}
            disabled={!canAddMore || inputValue.trim() === ""}
            aria-label="Add IAT stimuli"
            sx={{
              position: "absolute",
              right: 8,
              bottom: 7,
              width: 34,
              height: 34,
              borderRadius: "50%",
              bgcolor: "#BE185D",
              color: "white", 
              "&:hover": { bgcolor: "#9D174D" },
              "&.Mui-disabled": {
                bgcolor: "#CBD5E1",
                color: "white",
              },
            }}
          >
            <MdAdd size={20} />
          </IconButton>
        </Box>
      )}

      {!hasMinimumRecommended && (
        <Typography sx={{ fontSize: 12, color: "#B45309", lineHeight: 1.5 }}>
          Recommended minimum: {MIN_RECOMMENDED_IAT_STIMULI} stimuli for a
          useful preview.
        </Typography>
      )}
    </Box>
  );
};
