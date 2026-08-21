import type { ReactElement } from "react";
import { useRef, useState } from "react";

import {
  Button,
  ButtonBase,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import {
  BrainCircuit,
  Check,
  ChevronDown,
  CircleDot,
  Hash,
  Image,
  ListChecks,
  ListOrdered,
  Shapes,
  SlidersHorizontal,
  TextCursorInput,
  Timer,
  ToggleLeft,
  type LucideIcon,
} from "lucide-react";

import type {
  AssistantMessage,
  AssistantQuestionType,
  AssistantThread,
} from "../../../../types/surveyBuilderAssistant.types";
import { isAssistantThreadReadOnly } from "../surveyBuilderAssistantLifecycle";

const Box = styled("div")({});

interface QuestionTypeOption {
  type: AssistantQuestionType;
  label: string;
  description: string;
  icon: LucideIcon;
  advanced?: boolean;
}

const GENERATION_QUESTION_TYPE_OPTIONS: QuestionTypeOption[] = [
  {
    type: "RADIO",
    label: "Single choice",
    description: "Select one option",
    icon: CircleDot,
  },
  {
    type: "MULTIPLE_CHOICE",
    label: "Multiple choice",
    description: "Select multiple options",
    icon: ListChecks,
  },
  {
    type: "DROPDOWN",
    label: "Dropdown",
    description: "Select from a dropdown",
    icon: ChevronDown,
  },
  {
    type: "TEXT",
    label: "Text",
    description: "Enter a written response",
    icon: TextCursorInput,
  },
  {
    type: "NUMBER",
    label: "Number",
    description: "Enter a numeric response",
    icon: Hash,
  },
  {
    type: "RANGE",
    label: "Range",
    description: "Select a value on a scale",
    icon: SlidersHorizontal,
  },
  {
    type: "RANK",
    label: "Ranking",
    description: "Rank options by preference",
    icon: ListOrdered,
  },
  {
    type: "BINARY",
    label: "Binary",
    description: "Choose between two responses",
    icon: ToggleLeft,
  },
  {
    type: "MEDIA",
    label: "Media",
    description: "Respond to visual or media content",
    icon: Image,
    advanced: true,
  },
  {
    type: "TIMED_CHOICE",
    label: "Timed choice",
    description: "Choose between two options within a time limit",
    icon: Timer,
    advanced: true,
  },
  {
    type: "CONCEPT_FIT",
    label: "Concept fit",
    description: "Evaluate how well attributes fit a concept",
    icon: Shapes,
    advanced: true,
  },
  {
    type: "IAT",
    label: "IAT",
    description: "Implicit association testing",
    icon: BrainCircuit,
    advanced: true,
  },
];

const BASIC_QUESTION_TYPES = GENERATION_QUESTION_TYPE_OPTIONS.filter(
  (option) => !option.advanced,
);
const ADVANCED_QUESTION_TYPES = GENERATION_QUESTION_TYPE_OPTIONS.filter(
  (option) => option.advanced,
);

export interface GenerationQuestionTypePickerProps {
  disabled?: boolean;
  onSubmit: (questionTypes: AssistantQuestionType[]) => void | Promise<void>;
  onChooseForMe: () => void | Promise<void>;
}

const QuestionTypeGrid = ({
  disabled,
  options,
  selectedTypes,
  onToggle,
}: {
  disabled: boolean;
  options: QuestionTypeOption[];
  selectedTypes: AssistantQuestionType[];
  onToggle: (questionType: AssistantQuestionType) => void;
}): ReactElement => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr)",
      gap: 0.75,
      "@container (min-width: 500px)": {
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      },
    }}
  >
    {options.map((option) => {
      const isSelected = selectedTypes.includes(option.type);
      const Icon = option.icon;

      return (
        <ButtonBase
          key={option.type}
          disabled={disabled}
          aria-label={`${option.label}: ${option.description}`}
          aria-pressed={isSelected}
          onClick={() => onToggle(option.type)}
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "flex-start",
            gap: 1,
            minWidth: 0,
            minHeight: 72,
            p: 1,
            border: "1px solid",
            borderColor: isSelected ? "#818CF8" : "#E2E8F0",
            borderRadius: 2,
            color: "#0F172A",
            backgroundColor: isSelected ? "#F5F3FF" : "#FFFFFF",
            textAlign: "left",
            transition:
              "border-color 150ms ease, background-color 150ms ease, box-shadow 150ms ease",
            "&:hover": {
              borderColor: isSelected ? "#6366F1" : "#CBD5E1",
              backgroundColor: isSelected ? "#EEF2FF" : "#F8FAFC",
            },
            "&:focus-visible": {
              outline: "2px solid #6366F1",
              outlineOffset: 2,
            },
            "&.Mui-disabled": { opacity: 0.55 },
          }}
        >
          <Box
            sx={{
              display: "grid",
              placeItems: "center",
              width: 28,
              height: 28,
              flexShrink: 0,
              borderRadius: 1.5,
              color: isSelected ? "#4F46E5" : "#64748B",
              backgroundColor: isSelected ? "#E0E7FF" : "#F1F5F9",
            }}
          >
            <Icon size={15} aria-hidden="true" />
          </Box>

          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Stack direction="row" spacing={0.6} alignItems="center">
              <Typography
                sx={{
                  minWidth: 0,
                  color: "#0F172A",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  lineHeight: 1.35,
                }}
              >
                {option.label}
              </Typography>

              {option.advanced && (
                <Chip
                  label="Advanced"
                  size="small"
                  sx={{
                    height: 17,
                    color: "#6D28D9",
                    backgroundColor: "#EDE9FE",
                    fontSize: "0.54rem",
                    fontWeight: 700,
                    "& .MuiChip-label": { px: 0.65 },
                  }}
                />
              )}
            </Stack>

            <Typography
              sx={{
                mt: 0.25,
                color: "#64748B",
                fontSize: "0.65rem",
                lineHeight: 1.4,
              }}
            >
              {option.description}
            </Typography>
          </Box>

          {isSelected && (
            <Box
              sx={{
                display: "grid",
                placeItems: "center",
                width: 18,
                height: 18,
                flexShrink: 0,
                borderRadius: "50%",
                color: "#FFFFFF",
                backgroundColor: "#4F46E5",
              }}
            >
              <Check size={12} strokeWidth={3} aria-hidden="true" />
            </Box>
          )}
        </ButtonBase>
      );
    })}
  </Box>
);

export const GenerationQuestionTypePicker = ({
  disabled = false,
  onSubmit,
  onChooseForMe,
}: GenerationQuestionTypePickerProps): ReactElement | null => {
  const [selectedTypes, setSelectedTypes] = useState<AssistantQuestionType[]>(
    [],
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const submitInFlightRef = useRef(false);

  const isDisabled = disabled || isSubmitted;

  const handleToggle = (questionType: AssistantQuestionType) => {
    if (isDisabled) return;

    setSelectedTypes((current) =>
      current.includes(questionType)
        ? current.filter((type) => type !== questionType)
        : [...current, questionType],
    );
  };

  const handleSubmit = async () => {
    if (isDisabled || submitInFlightRef.current || selectedTypes.length === 0) {
      return;
    }

    submitInFlightRef.current = true;
    setIsSubmitted(true);
    await onSubmit(selectedTypes);
  };

  const handleChooseForMe = async () => {
    if (isDisabled || submitInFlightRef.current) return;

    submitInFlightRef.current = true;
    setIsSubmitted(true);
    await onChooseForMe();
  };

  if (isSubmitted) return null;

  const selectedCount = selectedTypes.length;

  return (
    <Paper
      variant="outlined"
      sx={{
        width: "100%",
        p: 1.5,
        borderColor: "#DDE3EC",
        borderRadius: 2.5,
        backgroundColor: "#FFFFFF",
        boxShadow: "0 4px 14px rgba(15, 23, 42, 0.05)",
        boxSizing: "border-box",
        containerType: "inline-size",
      }}
    >
      <Typography
        sx={{ color: "#0F172A", fontSize: "0.8rem", fontWeight: 750 }}
      >
        Choose question types
      </Typography>
      <Typography
        sx={{
          mt: 0.3,
          color: "#64748B",
          fontSize: "0.69rem",
          lineHeight: 1.45,
        }}
      >
        Select one or more types to include in the generated survey.
      </Typography>

      <Box sx={{ mt: 1.25 }}>
        <QuestionTypeGrid
          disabled={isDisabled}
          options={BASIC_QUESTION_TYPES}
          selectedTypes={selectedTypes}
          onToggle={handleToggle}
        />
      </Box>

      <Stack
        direction="row"
        alignItems="center"
        spacing={0.75}
        sx={{ mt: 1.5, mb: 0.75 }}
      >
        <Typography
          sx={{
            color: "#475569",
            fontSize: "0.64rem",
            fontWeight: 750,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Advanced
        </Typography>
        <Box sx={{ height: 1, flex: 1, backgroundColor: "#E2E8F0" }} />
      </Stack>

      <QuestionTypeGrid
        disabled={isDisabled}
        options={ADVANCED_QUESTION_TYPES}
        selectedTypes={selectedTypes}
        onToggle={handleToggle}
      />

      <Typography
        sx={{
          mt: 0.9,
          color: "#64748B",
          fontSize: "0.64rem",
          lineHeight: 1.45,
        }}
      >
        Advanced settings can be refined later in the survey canvas.
      </Typography>

      <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mt: 1.35 }}>
        <Button
          variant="contained"
          disabled={isDisabled || selectedCount === 0}
          onClick={() => void handleSubmit()}
          sx={{
            minHeight: 34,
            flex: "1 1 180px",
            borderRadius: 2,
            backgroundColor: "#4F46E5",
            boxShadow: "none",
            textTransform: "none",
            fontSize: "0.72rem",
            fontWeight: 700,
            "&:hover": { backgroundColor: "#4338CA", boxShadow: "none" },
          }}
        >
          {disabled ? (
            <CircularProgress size={14} color="inherit" />
          ) : (
            `Continue with ${selectedCount} ${selectedCount === 1 ? "type" : "types"}`
          )}
        </Button>

        <Button
          variant="outlined"
          disabled={isDisabled}
          onClick={() => void handleChooseForMe()}
          sx={{
            minHeight: 34,
            flex: "0 1 auto",
            borderColor: "#CBD5E1",
            borderRadius: 2,
            color: "#475569",
            textTransform: "none",
            fontSize: "0.72rem",
            fontWeight: 650,
            "&:hover": { borderColor: "#94A3B8", backgroundColor: "#F8FAFC" },
          }}
        >
          Choose for me
        </Button>
      </Stack>
    </Paper>
  );
};

interface GenerationQuestionTypePickerSlotProps {
  message: AssistantMessage;
  latestCompletedAssistantMessageID: string | null;
  thread: AssistantThread | null;
  canSendMessages: boolean;
  isGenerating: boolean;
  isSending: boolean;
  sendMessage: (message: string) => Promise<void>;
}

export const GenerationQuestionTypePickerSlot = ({
  message,
  latestCompletedAssistantMessageID,
  thread,
  canSendMessages,
  isGenerating,
  isSending,
  sendMessage,
}: GenerationQuestionTypePickerSlotProps): ReactElement | null => {
  const workflowState = thread?.workflowState;
  const shouldDisplay =
    message.role === "ASSISTANT" &&
    message.status === "COMPLETED" &&
    message.messageID === latestCompletedAssistantMessageID &&
    workflowState?.activeMode === "GENERATE" &&
    workflowState.missingFields?.includes("QUESTION_TYPES") === true &&
    !isAssistantThreadReadOnly(thread) &&
    thread?.stage !== "COMMITTED" &&
    !isGenerating &&
    !isSending &&
    canSendMessages;

  if (!shouldDisplay) return null;

  return (
    <GenerationQuestionTypePicker
      disabled={isGenerating || isSending}
      onSubmit={(questionTypes) =>
        sendMessage(
          `For generation, use these question types: ${questionTypes.join(", ")}.`,
        )
      }
      onChooseForMe={() =>
        sendMessage("Choose the most appropriate question types for me.")
      }
    />
  );
};
