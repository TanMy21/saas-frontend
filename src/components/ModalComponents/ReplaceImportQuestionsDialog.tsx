import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

interface ReplaceImportQuestionsDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  questionCount: number;
}

export const ReplaceImportQuestionsDialog = ({
  open,
  onClose,
  onConfirm,
  questionCount,
}: ReplaceImportQuestionsDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "14px",
          padding: 1,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>
        Replace existing questions?
      </DialogTitle>

      <DialogContent>
        <Typography sx={{ fontSize: 18, color: "#475569" }}>
          This will remove <strong>{questionCount}</strong>{" "}
          {questionCount === 1 ? "question" : "questions"} from the survey and
          replace them with the imported ones.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 2, pb: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            textTransform: "none",
            color: "#334155",
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={onConfirm}
          sx={{
            textTransform: "none",
            backgroundColor: "#DC2626",
            color: "#FFFFFF",
            "&:hover": {
              backgroundColor: "#B91C1C",
            },
          }}
        >
          Replace questions
        </Button>
      </DialogActions>
    </Dialog>
  );
};
