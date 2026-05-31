import { useEffect, useRef, useState } from "react";

import { Box, IconButton, TextField, Typography } from "@mui/material";
import { MdAdd } from "react-icons/md";

import {
  useCreateNewOptionMutation,
  useDeleteOptionMutation,
  useGetOptionsOfQuestionQuery,
} from "../../../app/slices/optionApiSlice";
import useAuth from "../../../hooks/useAuth";
import { useToast } from "../../../hooks/useToast";
import { MAX_TIMED_CHOICE_OPTIONS } from "../../../utils/constants";
import { showToast } from "../../../utils/showToast";
import { ElementProps, OptionType } from "../../../utils/types";
import { TimedChoiceTimerPreview } from "../Elements/TimedChoiceTimerPreview";

import { TimedChoiceOptionCard } from "./TimedChoiceOptionCard";

export const TimedChoiceResponse = ({ qID, display }: ElementProps) => {
  const { can } = useAuth();

  const canCreate = can("CREATE_OPTION");
  const canEdit = can("UPDATE_OPTION");
  const canDelete = can("DELETE_OPTION");

  const { data: options = [] as OptionType[] } = useGetOptionsOfQuestionQuery(
    qID!,
  );

  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [createNewOption, { isError, error }] = useCreateNewOptionMutation();
  const [deleteOption] = useDeleteOptionMutation();

  /**
   * Auto-resizes the option input as the creator types or pastes option labels.
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
   * Adds timed choice options in bulk, but only up to the strict 2-option v1 limit.
   */
  const handleAddOptions = async () => {
    const lines = inputValue
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length === 0) return;

    const available = MAX_TIMED_CHOICE_OPTIONS - options.length;

    if (available <= 0) {
      showToast.info("Timed choice supports exactly 2 options.");
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
          `Only ${available} option(s) added. Timed choice allows 2 options.`,
        );
      }
    } catch (err) {
      console.error("Timed choice add options error:", err);
      showToast.error("Failed to add timed choice options.");
    }
  };

  /**
   * Deletes one timed choice option using the existing option delete mutation.
   */
  const handleDeleteOption = async (optionID: string) => {
    if (!canDelete) return;

    try {
      await deleteOption(optionID).unwrap();
    } catch (error) {
      console.error("Timed choice option delete error:", error);
      showToast.error("Failed to delete timed choice option.");
    }
  };

  const canAddMore = options.length < MAX_TIMED_CHOICE_OPTIONS;

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
        <TimedChoiceTimerPreview />

        <Box
          sx={{
            display: "flex",
            flexDirection: display === "mobile" ? "column" : "row",
            gap: 2,
          }}
        >
          {options.map((option, index) => (
            <TimedChoiceOptionCard
              key={option.optionID}
              option={option}
              index={index}
              canEdit={canEdit}
              canDelete={canDelete}
              onDelete={handleDeleteOption}
            />
          ))}

          {options.length === 0 && (
            <Box
              sx={{
                width: "100%",
                border: "1px dashed #CBD5E1",
                borderRadius: 3,
                p: 3,
                textAlign: "center",
                bgcolor: "#F8FAFC",
              }}
            >
              <Typography sx={{ fontSize: 14, color: "#64748B" }}>
                Add 2 options for this timed choice question.
              </Typography>
            </Box>
          )}
        </Box>

        <Typography
          sx={{
            fontSize: 13,
            textAlign: "right",
            color:
              options.length === MAX_TIMED_CHOICE_OPTIONS
                ? "#16A34A"
                : "#64748B",
          }}
        >
          {options.length}/{MAX_TIMED_CHOICE_OPTIONS} timed choice options
        </Typography>

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
              placeholder="Type or paste options, one per line…"
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
              onClick={handleAddOptions}
              disabled={!canAddMore || inputValue.trim() === ""}
              aria-label="Add timed choice options"
              sx={{
                position: "absolute",
                right: 8,
                bottom: 7,
                width: 34,
                height: 34,
                borderRadius: "50%",
                bgcolor: "#EA580C",
                color: "white",
                boxShadow: "0 6px 16px rgba(234,88,12,0.25)",
                "&:hover": { bgcolor: "#C2410C" },
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
