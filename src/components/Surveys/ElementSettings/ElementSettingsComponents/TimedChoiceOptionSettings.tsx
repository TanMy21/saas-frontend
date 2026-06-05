import { useEffect, useState } from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  useGetOptionsOfQuestionQuery,
  useUpdateOptionTextandValueMutation,
} from "../../../../app/slices/optionApiSlice";
import { SettingSaveState } from "../../../../types/surveyBuilderTypes";
import { MAX_TIMED_OPTION_LENGTH } from "../../../../utils/constants";
import { showToast } from "../../../../utils/showToast";
import { ElementSettingsProps, OptionType } from "../../../../utils/types";

import SettingSaveStatus from "./SettingSaveStatus";

const TimedChoiceOptionSettings = ({ qID, canEdit }: ElementSettingsProps) => {
  const { data: options = [] as OptionType[] } =
    useGetOptionsOfQuestionQuery(qID);

  const [updateOptionTextandValue, { isLoading: isSavingOption }] =
    useUpdateOptionTextandValueMutation();

  const [saveStatus, setSaveStatus] = useState<SettingSaveState>("idle");

  const sortedOptions = [...options]
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .slice(0, 2);

  const [localValues, setLocalValues] = useState<Record<string, string>>({});

  /**
   * Keeps local input state synced with fetched option rows.
   */
  useEffect(() => {
    const nextValues = sortedOptions.reduce<Record<string, string>>(
      (acc, option) => {
        acc[option.optionID] = option.text || "";
        return acc;
      },
      {},
    );

    setLocalValues(nextValues);
  }, [options]);

  /**
   * Saves text and value together for a timed-choice option.
   */
  const handleSaveOption = async (option: OptionType) => {
    if (!canEdit) return;

    const nextText = localValues[option.optionID]?.trim();

    if (!nextText) {
      setSaveStatus("error");
      showToast.error("Option text cannot be empty.");
      return;
    }

    if (nextText === option.text) {
      setSaveStatus("saved");
      return;
    }

    try {
      setSaveStatus("saving");
      await updateOptionTextandValue({
        optionID: option.optionID,
        text: nextText,
        value: nextText,
      }).unwrap();
      setSaveStatus("saved");
    } catch (error) {
      setSaveStatus("error");
      console.error("Timed choice option update error:", error);
      showToast.error("Failed to update timed choice option.");
    }
  };

  return (
    <Accordion
      defaultExpanded={false}
      disableGutters
      elevation={0}
      square
      sx={{
        width: "100%",
        m: "0 !important",
        backgroundColor: "#FFFFFF",
        borderTop: "1px solid #E0E0E0",
        borderRadius: 0,
        boxShadow: "none",
        "&:before": { display: "none" },
        "&.Mui-expanded": {
          m: "0 !important",
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="timed-choice-options-content"
        id="timed-choice-options-header"
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            fontWeight: 500,
            color: "#453F46",
          }}
        >
          <Tooltip title="Edit the two timed choice option labels">
            <Typography>Timed options</Typography>
          </Tooltip>
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ px: { md: 2, xl: 1 }, pb: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            opacity: canEdit ? 1 : 0.8,
            pointerEvents: canEdit ? "auto" : "none",
          }}
        >
          {sortedOptions.length < 2 && (
            <Typography
              sx={{ fontSize: 13, color: "#B45309", lineHeight: 1.6 }}
            >
              Timed choice needs exactly 2 options. Add missing options from the
              canvas first.
            </Typography>
          )}

          {sortedOptions.map((option, index) => {
            const label = index === 0 ? "Option A" : "Option B";
            const value = localValues[option.optionID] || "";

            return (
              <Box key={option.optionID}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "#444D5C",
                    fontSize: 13,
                    mb: 1,
                  }}
                >
                  {label}
                </Typography>

                <TextField
                  fullWidth
                  variant="standard"
                  disabled={!canEdit}
                  value={value}
                  onChange={(event) => {
                    const nextValue = event.target.value.slice(
                      0,
                      MAX_TIMED_OPTION_LENGTH,
                    );

                    setLocalValues((prev) => ({
                      ...prev,
                      [option.optionID]: nextValue,
                    }));
                  }}
                  onBlur={() => handleSaveOption(option)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleSaveOption(option);
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        sx={{ color: "#6846E5", marginBottom: 0.5 }}
                      >
                        {`${value.length}/${MAX_TIMED_OPTION_LENGTH}`}
                      </InputAdornment>
                    ),
                    disableUnderline: true,
                  }}
                  sx={{
                    "& .MuiInputBase-input": {
                      lineHeight: "1.5",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      cursor: canEdit ? "text" : "not-allowed",
                      fontFamily: `"Inter", "Segoe UI", "Roboto", sans-serif`,
                      fontWeight: 500,
                    },
                    "& .MuiInputBase-root": {
                      borderRadius: "8px",
                      height: "42px",
                      fontSize: "15px",
                      backgroundColor: "#F3F4F6",
                      color: "#1F2937",
                      px: 1.5,
                      transition: "background-color 0.2s ease",
                      "&:hover": {
                        backgroundColor: "#E5E7EB",
                      },
                      "&.Mui-focused": {
                        backgroundColor: "#FFF7ED",
                      },
                    },
                  }}
                />
              </Box>
            );
          })}

          <SettingSaveStatus state={isSavingOption ? "saving" : saveStatus} />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default TimedChoiceOptionSettings;
