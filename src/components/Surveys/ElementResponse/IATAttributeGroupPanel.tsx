import { useState } from "react";

import { Box, IconButton, TextField, Typography } from "@mui/material";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { MdAdd } from "react-icons/md";

import {
  useCreateNewOptionMutation,
  useDeleteOptionMutation,
  useUpdateOptionOrderMutation,
  useUpdateOptionTextandValueMutation,
} from "../../../app/slices/optionApiSlice";
import useAuth from "../../../hooks/useAuth";
import { useToast } from "../../../hooks/useToast";
import { IATAttributeGroupPanelProps } from "../../../types/surveyBuilderTypes";
import {
  MAX_IAT_ATTRIBUTES_PER_GROUP,
  MIN_IAT_ATTRIBUTES_PER_GROUP,
} from "../../../utils/constants";
import { isIATOptionInGroup } from "../../../utils/iatUtils";
import { showToast } from "../../../utils/showToast";
import { OptionType } from "../../../utils/types";

import { IATStimulusRow } from "./IATStimulusRow";

export const IATAttributeGroupPanel = ({
  qID,
  group,
  title,
  options,
  allOptions,
}: IATAttributeGroupPanelProps) => {
  const { can } = useAuth();

  const canCreate = can("CREATE_OPTION");
  const canEdit = can("UPDATE_OPTION");
  const canDelete = can("DELETE_OPTION");
  const canReorder = can("REORDER_OPTION");

  const [inputValue, setInputValue] = useState("");
  const [createNewOption, { isError, error }] = useCreateNewOptionMutation();
  const [deleteOption] = useDeleteOptionMutation();
  const [updateOptionOrder] = useUpdateOptionOrderMutation();
  const [updateOptionTextandValue] = useUpdateOptionTextandValueMutation();

  useToast({
    isError,
    error,
    errorFallbackMessage: "Something went wrong.",
  });

  console.log("Panel Options: ", options);

  const canAddMore = options.length < MAX_IAT_ATTRIBUTES_PER_GROUP;

  /**
   * Creates grouped IAT attributes.
   * Each line becomes an option row linked to THEME_A or THEME_B through Option.settings.
   */
  const handleAddAttributes = async () => {
    if (!qID || !canCreate) return;

    const lines = inputValue
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, MAX_IAT_ATTRIBUTES_PER_GROUP - options.length);

    if (lines.length === 0) return;

    console.log("In handler");

    console.log("Sending: ", lines);

    try {
      await createNewOption({
        questionID: qID,
        options: lines.map((text) => ({
          text,
          value: text,
          settings: {
            iatGroup: group,
            iatStimulusType: "ATTRIBUTE",
          },
        })),
      }).unwrap();

      console.log("Called");

      setInputValue("");
    } catch (error) {
      console.error("IAT grouped attribute create error:", error);
      showToast.error("Failed to add attributes.");
    }
  };

  /**
   * Updates the text/value of one IAT attribute option.
   * The group remains unchanged because it lives in option.settings.
   */
  const handleUpdateAttribute = async (
    option: OptionType,
    nextText: string,
  ) => {
    if (!canEdit) return;

    const cleanText = nextText.trim();

    if (!cleanText) {
      showToast.error("Attribute cannot be empty.");
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
      console.error("IAT attribute update error:", error);
      showToast.error("Failed to update attribute.");
    }
  };

  /**
   * Deletes one IAT attribute option from the selected group.
   */
  const handleDeleteAttribute = async (optionID: string) => {
    if (!canDelete) return;

    try {
      await deleteOption(optionID).unwrap();
    } catch (error) {
      console.error("IAT attribute delete error:", error);
      showToast.error("Failed to delete attribute.");
    }
  };

  /**
   * Reorders attributes inside the active group while preserving a valid global option order.
   * Because Option has a unique relatedQuestionID + order constraint, we rebuild the full option list order.
   */
  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    if (!canReorder || !destination || source.index === destination.index) {
      return;
    }

    const reorderedGroup = Array.from(options);
    const [moved] = reorderedGroup.splice(source.index, 1);
    reorderedGroup.splice(destination.index, 0, moved);

    const otherOptions = allOptions.filter(
      (option) => !isIATOptionInGroup(option.settings, group),
    );

    const themeAOptions =
      group === "THEME_A"
        ? reorderedGroup
        : otherOptions.filter((option) =>
            isIATOptionInGroup(option.settings, "THEME_A"),
          );

    const themeBOptions =
      group === "THEME_B"
        ? reorderedGroup
        : otherOptions.filter((option) =>
            isIATOptionInGroup(option.settings, "THEME_B"),
          );

    const reorderedAllOptions = [...themeAOptions, ...themeBOptions].map(
      (option, index) => ({
        ...option,
        order: index + 1,
      }),
    );

    try {
      await updateOptionOrder({ options: reorderedAllOptions }).unwrap();
    } catch (error) {
      console.error("IAT attribute reorder error:", error);
      showToast.error("Failed to reorder attributes.");
    }
  };

  return (
    <Box
      sx={{
        border: "1px solid #E2E8F0",
        borderRadius: 3,
        bgcolor: "#F8FAFC",
        p: 1.5,
        display: "flex",
        flexDirection: "column",
        gap: 1.25,
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
        <Typography sx={{ fontSize: 13, fontWeight: 900, color: "#0F172A" }}>
          {title}
        </Typography>

        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 800,
            color:
              options.length >= MIN_IAT_ATTRIBUTES_PER_GROUP
                ? "#64748B"
                : "#B45309",
          }}
        >
          {options.length}/{MAX_IAT_ATTRIBUTES_PER_GROUP/2}
        </Typography>
      </Box>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId={`iat-${group}-${qID}`}>
          {(provided) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                maxHeight: 260,
                overflowY: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              {options.map((option, index) => (
                <Draggable
                  key={option.optionID}
                  draggableId={option.optionID}
                  index={index}
                  isDragDisabled={!canReorder}
                >
                  {(provided) => (
                    <Box ref={provided.innerRef} {...provided.draggableProps}>
                      <IATStimulusRow
                        option={option}
                        index={index}
                        canEdit={canEdit}
                        canDelete={canDelete}
                        canReorder={canReorder}
                        dragHandleProps={provided.dragHandleProps}
                        onUpdate={handleUpdateAttribute}
                        onDelete={handleDeleteAttribute}
                      />
                    </Box>
                  )}
                </Draggable>
              ))}

              {provided.placeholder}

              {options.length === 0 && (
                <Typography
                  sx={{
                    fontSize: 13,
                    color: "#64748B",
                    textAlign: "center",
                    py: 2,
                  }}
                >
                  Add attributes for {title}.
                </Typography>
              )}
            </Box>
          )}
        </Droppable>
      </DragDropContext>

      {canCreate && (
        <Box sx={{ position: "relative", bgcolor: "#FFFFFF", borderRadius: 2 }}>
          <TextField
            multiline
            minRows={1}
            disabled={!canAddMore}
            value={inputValue}
            placeholder={`Add ${title} attributes, one per line…`}
            onChange={(event) => setInputValue(event.target.value)}
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: {
                fontSize: 14,
                px: 1.5,
                py: 1,
                pr: 5,
              },
            }}
            sx={{ width: "100%" }}
          />

          <IconButton
            onClick={handleAddAttributes}
            disabled={!canAddMore || inputValue.trim() === ""}
            sx={{
              position: "absolute",
              right: 6,
              bottom: 6,
              width: 32,
              height: 32,
              bgcolor: "#BE185D",
              color: "white",
              "&:hover": { bgcolor: "#9D174D" },
              "&.Mui-disabled": {
                bgcolor: "#CBD5E1",
                color: "white",
              },
            }}
          >
            <MdAdd size={18} />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};
