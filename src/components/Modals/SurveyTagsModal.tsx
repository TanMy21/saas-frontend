import { useRef, useState } from "react";

import { Box, Button, Chip, Modal, TextField, Typography } from "@mui/material";

import { useUpdateSurveyTagsMutation } from "../../app/slices/surveysApiSlice";
import { SurveyTagsModalProps } from "../../utils/types";

const SurveyTagsModal = ({ open, onClose, survey }: SurveyTagsModalProps) => {
  const { surveyID, surveyTag } = survey;
  const [tags, setTags] = useState<string[]>(surveyTag || []);
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const MAX_TAGS = 5;

  const [updateSurveyTags, { isLoading, isSuccess, error, isError }] =
    useUpdateSurveyTagsMutation();

  const handleAddTag = () => {
    const trimmedValue = inputValue.trim().toLowerCase();

    if (!trimmedValue) return;

    const normalizedTags = tags.map((tag) => tag.trim().toLowerCase());

    if (normalizedTags.includes(trimmedValue)) {
      setErrorMessage(`"${trimmedValue}" has already been added.`);
      return;
    }

    if (tags.length >= MAX_TAGS) {
      setErrorMessage(`You can only add up to ${MAX_TAGS} tags.`);
      return;
    }

    setTags([...tags, trimmedValue]);
    setInputValue("");
    setErrorMessage("");

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      await updateSurveyTags({ surveyID, tags }).unwrap();
      onClose();
    } catch (error) {
      console.error("Failed to update tags", error);
    }
    onClose();
  };

  const remainingTags = MAX_TAGS - tags.length;
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography
          id="modal-modal-title"
          variant="h6"
          fontWeight="bold"
          mb={2}
        >
          Survey Tags
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            inputRef={inputRef}
            fullWidth
            size="small"
            placeholder={
              remainingTags > 0
                ? `Add a tag (${remainingTags} remaining)`
                : "Maximum tags reached"
            }
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={tags.length >= MAX_TAGS}
          />
          <Button
            variant="contained"
            onClick={handleAddTag}
            disabled={tags.length >= MAX_TAGS || !inputValue.trim()}
            sx={{
              width: "20%",
              height: "80%",
              p: 1,
              backgroundColor: "#752FEC",
              color: "white",
              fontWeight: "bold",
              "&.MuiButton-root:hover": {
                bgcolor: "#752FEC",
              },
              textTransform: "capitalize",
              borderRadius: 2,
            }}
          >
            Add
          </Button>
        </Box>

        {errorMessage && (
          <Typography variant="body2" color="error" mt={1} mb={1}>
            {errorMessage}
          </Typography>
        )}

        {tags.length > 0 ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 2 }}>
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                onDelete={() => handleRemoveTag(index)}
              />
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" mb={2}>
            No tags added yet. You can add up to {MAX_TAGS} tags.
          </Typography>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mt: 1,
          }}
        >
          <Button
            variant="text"
            onClick={onClose}
            sx={{
              width: "16%",
              height: "80%",
              p: 1,
              backgroundColor: "#E4E2E2",
              color: "black",
              fontWeight: "bold",
              "&.MuiButton-root:hover": {
                bgcolor: "#E4E2E2",
              },
              textTransform: "capitalize",
              borderRadius: 2,
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="text"
            size="small"
            disabled={isLoading}
            sx={{
              width: "28%",
              height: "100%",
              p: "9px",
              backgroundColor: "#752FEC",
              color: "white",
              fontWeight: "bold",
              "&.MuiButton-root:hover": {
                bgcolor: "#752FEC",
              },
              textTransform: "capitalize",
              borderRadius: 2,
            }}
            onClick={handleSave}
          >
            {isLoading ? "Saving Tags..." : "Save Tags"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SurveyTagsModal;
