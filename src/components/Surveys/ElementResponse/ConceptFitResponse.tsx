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
} from "../../../app/slices/optionApiSlice";
import useAuth from "../../../hooks/useAuth";
import { useToast } from "../../../hooks/useToast";
import {
  MAX_CONCEPT_ATTRIBUTES,
  MIN_RECOMMENDED_ATTRIBUTES,
} from "../../../utils/constants";
import { showToast } from "../../../utils/showToast";
import { ElementProps, OptionType } from "../../../utils/types";

import { ConceptAttributeRow } from "./ConceptAttributeRow";
import { ConceptFitPreview } from "./ConceptFitPreview";

export const ConceptFitResponse = ({ qID, display }: ElementProps) => {
  const { can } = useAuth();

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

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        mt: 3,
      }}
    >
      <Box
        sx={{
          width: display === "mobile" ? "92%" : "72%",
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        <ConceptFitPreview firstAttribute={localOptions[0]?.text} />

        <Typography
          sx={{
            fontSize: 13,
            color: hasMinimumRecommended ? "#64748B" : "#B45309",
            textAlign: "right",
          }}
        >
          {localOptions.length}/{MAX_CONCEPT_ATTRIBUTES} attributes
          {!hasMinimumRecommended
            ? ` · Recommended minimum: ${MIN_RECOMMENDED_ATTRIBUTES}`
            : ""}
        </Typography>

        <Box
          sx={{
            border: "1px solid #E2E8F0",
            borderRadius: 2,
            bgcolor: "#F8FAFC",
            p: 1.5,
            maxHeight: 340,
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <DragDropContext
            onDragEnd={(result) => {
              if (!canReorder) return;
              handleDragEnd(result);
            }}
          >
            <Droppable droppableId={`concept-fit-attributes-${qID}`}>
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
                  {localOptions.map((option, index) => (
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
                          {...provided.dragHandleProps}
                          sx={{
                            outline: "none",
                            "&:focus": { outline: "none" },
                            "&:focus-visible": { outline: "none" },
                          }}
                        >
                          <ConceptAttributeRow
                            option={option}
                            index={index}
                            canReorder={canReorder}
                            canEdit={canEdit}
                            canDelete={canDelete}
                            onDelete={handleDeleteAttribute}
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

          {localOptions.length === 0 && (
            <Typography
              sx={{
                fontSize: 14,
                color: "#64748B",
                textAlign: "center",
                py: 3,
              }}
            >
              Add attribute words like Premium, Elegant, Cheap, or Trustworthy.
            </Typography>
          )}
        </Box>

        {canCreate && (
          <Box
            sx={{
              position: "relative",
              width: "100%",
              px: 1,
              pt: 0.75,
              pb: 0.75,
              border: "1px solid #E2E8F0",
              borderRadius: 2,
              bgcolor: "#FFFFFF",
            }}
          >
            <TextField
              multiline
              minRows={1}
              disabled={!canAddMore}
              inputRef={textareaRef}
              placeholder="Type or paste attributes, one per line…"
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
              onClick={handleAddAttributes}
              disabled={!canAddMore || inputValue.trim() === ""}
              aria-label="Add concept fit attributes"
              sx={{
                position: "absolute",
                right: 8,
                bottom: 7,
                width: 34,
                height: 34,
                borderRadius: "50%",
                bgcolor: "#0891B2",
                color: "white",
                boxShadow: "0 6px 16px rgba(8,145,178,0.25)",
                "&:hover": { bgcolor: "#0E7490" },
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
      </Box>
    </Box>
  );
};
