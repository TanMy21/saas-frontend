import { useEffect, useRef, useState } from "react";

import {
  Box,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
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
  DROPDOWN_WARNING_COUNT,
  MAX_DROPDOWN_OPTIONS,
} from "../../../utils/constants";
import { showToast } from "../../../utils/showToast";
import { ElementProps, OptionType } from "../../../utils/types";

import { DropdownOptionRow } from "./DropdownOptionRow";

const DropdownResponse = ({ qID, display }: ElementProps) => {
  const { can } = useAuth();

  const canCreate = can("CREATE_OPTION");
  const canReorder = can("REORDER_OPTION");
  const canDelete = can("DELETE_OPTION");
  const canEdit = can("UPDATE_OPTION");

  const { data: options = [] as OptionType[] } = useGetOptionsOfQuestionQuery(
    qID!,
  );

  const [localOptions, setLocalOptions] = useState<OptionType[]>(options);
  const [inputValue, setInputValue] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [createNewOption, { isError, error }] = useCreateNewOptionMutation();
  const [updateOptionOrder] = useUpdateOptionOrderMutation();
  const [deleteOption] = useDeleteOptionMutation();

  /**
   * Keeps local drag/drop state synced with server options after fetching or mutation refresh.
   */
  useEffect(() => {
    setLocalOptions(options);
  }, [options]);

  /**
   * Auto-resizes the bulk option input as the creator types/pastes multiple lines.
   */
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [inputValue]);

  /**
   * Adds dropdown options in bulk.
   * Each pasted line becomes one option until the 100-option dropdown limit is reached.
   */
  const handleAddOptions = async () => {
    const lines = inputValue
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length === 0) return;

    const available = MAX_DROPDOWN_OPTIONS - (localOptions?.length ?? 0);

    if (available <= 0) {
      showToast.info("Dropdown option limit reached (100 options).");
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
          `Only ${available} option(s) added because the dropdown limit is 100.`,
        );
      }
    } catch (err) {
      console.error("Dropdown add options error:", err);
      showToast.error("Failed to add dropdown options.");
    }
  };

  /**
   * Reorders dropdown options using the existing option-order mutation.
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
      .catch((err) => console.error("Dropdown order update error:", err));
  };

  const handleDeleteOption = async (optionID: string) => {
    if (!canDelete) return;

    try {
      await deleteOption(optionID).unwrap();
    } catch (error) {
      console.error("Dropdown option delete error:", error);
      showToast.error("Failed to delete dropdown option.");
    }
  };

  useToast({
    isError,
    error,
    errorFallbackMessage: "Something went wrong.",
  });

  const hasManyOptions = localOptions.length >= DROPDOWN_WARNING_COUNT;

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 3,
      }}
    >
      <Box
        sx={{
          width: display === "mobile" ? "92%" : "62%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* Dropdown participant preview */}
        <TextField
          select
          fullWidth
          value=""
          variant="outlined"
          SelectProps={{
            displayEmpty: true,
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              bgcolor: "#FFFFFF",
            },
          }}
        >
          <MenuItem value="" disabled>
            Select an option
          </MenuItem>

          {localOptions.slice(0, 20).map((option) => (
            <MenuItem key={option.optionID} value={option.optionID}>
              {option.text}
            </MenuItem>
          ))}

          {localOptions.length > 20 && (
            <MenuItem disabled>
              + {localOptions.length - 20} more option(s)
            </MenuItem>
          )}
        </TextField>

        <Typography
          sx={{
            fontSize: 13,
            color: hasManyOptions ? "#B45309" : "#64748B",
            textAlign: "right",
          }}
        >
          {localOptions.length}/{MAX_DROPDOWN_OPTIONS} dropdown options
          {hasManyOptions
            ? " · Long dropdowns may be harder for participants to scan."
            : ""}
        </Typography>

        {/* Compact option manager */}
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
            <Droppable droppableId={`dropdown-options-${qID}`}>
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
                          <DropdownOptionRow
                            option={option}
                            index={index}
                            canReorder={canReorder}
                            canEdit={canEdit}
                            canDelete={canDelete}
                            onDelete={handleDeleteOption}
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
              No dropdown options yet.
            </Typography>
          )}
        </Box>

        {/* Bulk add input */}
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
              disabled={localOptions.length >= MAX_DROPDOWN_OPTIONS}
              inputRef={textareaRef}
              placeholder="Type or paste dropdown options, one per line…"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
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
              onClick={handleAddOptions}
              disabled={
                localOptions.length >= MAX_DROPDOWN_OPTIONS ||
                inputValue.trim() === ""
              }
              aria-label="Add dropdown options"
              sx={{
                position: "absolute",
                right: 8,
                bottom: 7,
                width: 34,
                height: 34,
                borderRadius: "50%",
                bgcolor: "#7C3AED",
                color: "white",
                boxShadow: "0 6px 16px rgba(124,58,237,0.25)",
                "&:hover": { bgcolor: "#6D28D9" },
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

export default DropdownResponse;
