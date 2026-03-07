import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Typography, TextField, Button } from "@mui/material";
import { Sparkles } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useParams } from "react-router-dom";

type AppendFormData = {
  numberOfQuestions: number;
  description?: string;
};

type Props = {
  onBack: () => void;
  onGenerate: () => void;
  generateSurvey: any;
  setOpenGenerate?: (open: boolean) => void;
};

export const GenerateSurveyAppendForm = ({
  onBack,
  onGenerate,
  generateSurvey,
  setOpenGenerate,
}: Props) => {
  const { surveyID } = useParams();

  const { control, handleSubmit } = useForm<AppendFormData>({
    defaultValues: {
      numberOfQuestions: 3,
      description: "",
    },
  });

  const onSubmit = async (data: AppendFormData) => {
    try {
      onGenerate(); // switch modal to loading state

      await generateSurvey({
        surveyID: surveyID!,
        inputText: data.description,
        numberOfQuestions: data.numberOfQuestions,
        questionTypes: [], //let the backend decide question types for append.
        mode: "APPEND",
      }).unwrap();
      setOpenGenerate?.(false);
    } catch (error) {
      console.error("Append generation failed", error);
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* Back */}
      <Box
        onClick={onBack}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          cursor: "pointer",
          color: "#64748b",
          "&:hover": { color: "#1e293b" },
        }}
      >
        <ArrowBackIcon fontSize="small" />
        <Typography fontSize={14}>Back</Typography>
      </Box>

      <Typography fontWeight={600} fontSize={16}>
        Generate Additional Questions
      </Typography>

      {/* Question Count */}
      <Box sx={{ mb: 1 }}>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: 15,
            color: "#374151",
            mb: 1,
          }}
        >
          Number of Questions
        </Typography>
        <Controller
          name="numberOfQuestions"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              fullWidth
              sx={{
                background: "#f5f7fa",
                borderRadius: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },
              }}
              inputProps={{
                min: 1,
                max: 50,
                step: 1,
                style: { fontSize: 16 },
              }}
            />
          )}
        />
      </Box>

      {/* Context Refinement */}
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Refine Context (optional)"
            multiline
            minRows={3}
            variant="outlined"
            sx={{
              borderRadius: 3,
              background: "#f5f7fa",
              mt: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
            }}
            placeholder="Example: Focus more on usability or pricing feedback..."
            fullWidth
          />
        )}
      />

      {/* Info Box */}
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: "#eff6ff",
          border: "1px solid #bfdbfe",
        }}
      >
        <Typography fontSize={13} color="#1d4ed8">
          New questions will be appended to the end of the survey.
        </Typography>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          pt: 2,
        }}
      >
        <Button
          onClick={onBack}
          sx={{
            px: 3,
            py: 1.3,
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
          sx={{
            px: 4,
            py: 1.3,
            fontSize: 15,
            fontWeight: 600,
            color: "#fff",
            background: "linear-gradient(90deg, #0074EB 0%, #005BC4 100%)",
            borderRadius: 2,
            boxShadow: "0 2px 8px 0 rgba(59,130,246,0.13)",
            transition: "all 0.18s",
            "&:hover": {
              background: "linear-gradient(90deg, #0074EB 0%, #005BC4 100%)",
            },
          }}
          startIcon={<Sparkles size={18} />}
          onClick={handleSubmit(onSubmit)}
        >
          Generate & Append
        </Button>
      </Box>
    </Box>
  );
};
