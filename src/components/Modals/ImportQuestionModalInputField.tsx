import { useState } from "react";

import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { Box, Button, TextField, Tooltip } from "@mui/material";
import { ReplaceAll, SquarePlus } from "lucide-react";
import toast from "react-hot-toast";

import { useSurveyCanvasRefetch } from "../../context/BuilderRefetchCanvas";
import { ImportQuestionModalInputFieldProps } from "../../utils/types";
import { ReplaceImportQuestionsDialog } from "../ModalComponents/ReplaceImportQuestionsDialog";

import ImportQuestionModalPlaceholderTxt from "./ImportQuestionModalPlaceholderTxt";

const ImportQuestionModalInputField = ({
  surveyID,
  isLoading,
  existingQuestionsCount,
  importQuestions,
  importText,
  setImportText,
  setImportBtnClicked,
  setAttemptedMode,
  handleClose,
  startTimeouts,
  clearTimeouts,
}: ImportQuestionModalInputFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [confirmReplaceOpen, setConfirmReplaceOpen] = useState(false);

  const refetchCanvas = useSurveyCanvasRefetch();

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setImportText(event.target.value);
  };

  const handleImport = async (mode: "INITIAL" | "APPEND" | "REPLACE") => {
    try {
       startTimeouts();

      setAttemptedMode(mode);
      setImportBtnClicked(true);

      if (importText.trim().length === 0) {
        return;
      }

      await importQuestions({
        surveyID,
        inputText: importText,
        mode,
      }).unwrap();

      setImportText("");
      refetchCanvas();
        toast.success("Questions imported successfully");
      handleClose();
    } catch (error) {
      clearTimeouts();
      toast.error("Failed to import questions.");
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
        {existingQuestionsCount > 0 ? (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              {/* Replace */}
              <Button
                onClick={() => setConfirmReplaceOpen(true)}
                disabled={isLoading}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  borderRadius: "8px",
                  border: "1px solid #E2E8F0",
                  color: "#475569",
                  px: 2,
                  height: 36,
                  fontWeight: 600,
                  textTransform: "none",
                  backgroundColor: "#E2E8F0",
                  "&:hover": {
                    backgroundColor: "#CBD5E1",
                    borderColor: "#CBD5E1",
                  },
                }}
              >
                <ReplaceAll size={18} />
                Replace
              </Button>

              {/* Append */}
              <Tooltip title="Append questions to survey" arrow>
                <Button
                  onClick={() => handleImport("APPEND")}
                  disabled={isLoading}
                  sx={{
                    minWidth: 40,
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: "#2563EB",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#1D4ED8",
                      transform: "scale(1.15)",
                    },
                  }}
                >
                  <SquarePlus size={20} />
                </Button>
              </Tooltip>
              <ReplaceImportQuestionsDialog
                open={confirmReplaceOpen}
                questionCount={existingQuestionsCount}
                onClose={() => setConfirmReplaceOpen(false)}
                onConfirm={() => {
                  setConfirmReplaceOpen(false);
                  handleImport("REPLACE");
                }}
              />
            </Box>
          </>
        ) : (
          <Button
            onClick={() => handleImport("INITIAL")}
            disabled={isLoading}
            sx={{
              borderRadius: "50%",
              backgroundColor: "#005BC4",
              color: "#FFFFFF",
              width: 36,
              height: 36,
              minWidth: 36,
              "&:hover": {
                backgroundColor: "#005BC4",
                transform: "scale(1.15)",
              },
            }}
          >
            <ArrowUpwardIcon fontSize="small" />
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ImportQuestionModalInputField;
