import { useState } from "react";

import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { Box, Button, TextField } from "@mui/material";

import { useSurveyCanvasRefetch } from "../../context/BuilderRefetchCanvas";
import { ImportQuestionModalInputFieldProps } from "../../utils/types";

import ImportQuestionModalPlaceholderTxt from "./ImportQuestionModalPlaceholderTxt";

const ImportQuestionModalInputField = ({
  surveyID,
  isLoading,
  importQuestions,
  importText,
  setImportText,
  setImportBtnClicked,
  handleClose,
}: ImportQuestionModalInputFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const refetchCanvas = useSurveyCanvasRefetch();

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setImportText(event.target.value);
  };

  const handleImport = async () => {
    try {
      setImportBtnClicked(true);
      // const questionsGenerated =

      if (importText.trim().length === 0) {
        return;
      }

      await importQuestions({
        surveyID,
        value: importText,
      }).unwrap();
      setImportText("");
      refetchCanvas();
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: "12px",
        border: "1px solid",
        width: "98%",
        height: "98%",
        margin: "auto",
        borderColor: isFocused ? "#6366F1" : "#CBD5E1",
        boxShadow: isFocused
          ? "0 4px 6px rgba(99, 102, 241, 0.1)"
          : "0 1px 3px rgba(0,0,0,0.05)",
        transition: "all 0.2s",
        "&:hover": {
          borderColor: isFocused ? "#6366F1" : "#94A3B8",
        },
        padding: "4px",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          height: "100%",
          overflow: "auto",
          padding: "4px",
        }}
      >
        <TextField
          value={importText}
          onChange={handleChange}
          multiline
          // minRows={16}
          variant="outlined"
          fullWidth
          placeholder=""
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          sx={{
            height: "100%",
            "& .MuiOutlinedInput-root": {
              height: "100%",
              alignItems: "stretch",
              borderRadius: "12px",
              "& fieldset": { border: "none" },
            },
            "& .MuiInputBase-inputMultiline": {
              height: "100%",
              padding: "4px",
              color: "#475569",
              fontSize: "16px",
              lineHeight: "1.5",
              resize: "none",
              overflow: "auto",
              boxSizing: "border-box",
            },
            "& textarea": {
              padding: "4px",
              color: "#475569",
              resize: "none",
              fontSize: "16px",
              lineHeight: "1.5",
              "& textarea::placeholder": {
                whiteSpace: "pre-line",
              },
            },
          }}
          inputProps={{ style: { overflow: "auto" } }}
          InputLabelProps={{ shrink: false }}
        />
      </Box>
      {/* Placeholder Overlay */}
      {importText.length === 0 && <ImportQuestionModalPlaceholderTxt />}
      {/* Upload Button */}
      <Box
        sx={{
          position: "absolute",
          bottom: 8,
          right: 8,
        }}
      >
        <Button
          onClick={handleImport}
          type="submit"
          disabled={isLoading}
          sx={{
            borderRadius: "50%",
            backgroundColor: "#005BC4",
            color: "#FFFFFF",
            position: "absolute",
            bottom: "16px",
            right: "16px",
            width: "36px",
            height: "36px",
            minWidth: "36px",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: "#005BC4",
              color: "#FFFFFF",
              transform: "scale(1.2)",
            },
          }}
          aria-label="upload file"
        >
          <ArrowUpwardIcon fontSize="small" />
        </Button>
      </Box>
    </Box>
  );
};

export default ImportQuestionModalInputField;
