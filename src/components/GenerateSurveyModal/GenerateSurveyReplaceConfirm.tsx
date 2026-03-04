import { Box, Button, Typography } from "@mui/material";

export const GenerateSurveyReplaceConfirm = ({
  questionCount,
  onBack,
  onConfirm,
}: {
  questionCount: number;
  onBack: () => void;
  onConfirm: () => void;
}) => {
  return (
    <Box
      sx={{
        p: 2,
        textAlign: "center",
        gap: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Main message */}
      <Typography>
        This will replace {questionCount} existing questions.
      </Typography>

      {/* Action row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end", 
          gap: 2,
          mt: 2, 
        }}
      >
        <Button
          onClick={onBack}
          sx={{
            px: 3,
            py: 1.4,
            fontSize: 15,
            fontWeight: 500,
            marginLeft: "8%",
            color: "#374151",
            bgcolor: "#fff",
            border: "1.5px solid #e5e7eb",
            borderRadius: 2,
            transition: "all 0.18s",
            "&:hover": {
              bgcolor: "#f3f4f6",
              borderColor: "#d1d5db",
            },
          }}
        >
          Cancel
        </Button>

        <Button
          color="error"
          sx={{
            px: 4,
            py: 1,
            fontSize: 15,
            fontWeight: 600,
            color: "#fff",
            background: "#DC2626",
            borderRadius: 2,
            boxShadow: "0 2px 8px 0 rgba(59,130,246,0.13)",
            transition: "all 0.18s",
            "&:hover": {
              background: "#DC2626",
            },
          }}
          onClick={onConfirm}
        >
          Confirm & Regenerate
        </Button>
      </Box>
    </Box>
  );
};
