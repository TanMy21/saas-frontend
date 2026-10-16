import { Paper, Stack, styled, Typography } from "@mui/material";
import {
  ArrowDownUp,
  Compass,
  FileInput,
  ListPlus,
  MousePointer2,
  RefreshCw,
  ScanEye,
  Sparkles,
  SquarePen,
  type LucideIcon,
} from "lucide-react";

const Box = styled("div")({});

const capabilities: Record<
  string,
  { icon: LucideIcon; label: string; description: string }
> = {
  "Import questions": {
    icon: FileInput,
    label: "Import questions",
    description: "Bring in questions and options you already have.",
  },
  "Generate new questions": {
    icon: Sparkles,
    label: "Generate questions",
    description: "Turn a topic or research goal into questions.",
  },
  "Append a batch": {
    icon: ListPlus,
    label: "Add more questions",
    description: "Add a new batch to your existing survey.",
  },
  "Replace all ordinary questions": {
    icon: RefreshCw,
    label: "Replace all questions",
    description: "Prepare a fresh set of ordinary questions.",
  },
  "Replace selected questions": {
    icon: SquarePen,
    label: "Replace selected questions",
    description: "Update chosen questions at their current positions.",
  },
  "Propose a bulk semantic or complete-flow reorder": {
    icon: ArrowDownUp,
    label: "Reorder your survey",
    description: "Group questions or propose a complete survey flow.",
  },
  "Preview proposed questions or order changes": {
    icon: ScanEye,
    label: "Review before applying",
    description: "Check questions and order changes before approving.",
  },
  "Guide you around the survey builder": {
    icon: Compass,
    label: "Find your way around",
    description: "Get help finding the right builder controls.",
  },
};

const AssistantCapabilities = ({
  items,
  footer,
}: {
  items: { title: string; description: string }[];
  footer: string;
}) => (
  <Paper
    component="section"
    aria-label="Survey assistant capabilities"
    variant="outlined"
    sx={{
      width: "100%",
      minWidth: 0,
      borderColor: "#E2E8F0",
      borderRadius: 2.5,
      overflow: "hidden",
      containerType: "inline-size",
      boxSizing: "border-box",
    }}
  >
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{ p: 1.5, backgroundColor: "#F5F7FF" }}
    >
      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          width: 32,
          height: 32,
          flexShrink: 0,
          color: "#4F46E5",
          backgroundColor: "#E0E7FF",
          borderRadius: 2,
        }}
      >
        <Sparkles size={17} aria-hidden="true" />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          component="p"
          sx={{
            color: "#0F172A",
            fontSize: "var(--assistant-chat-font-title, 15px)",
            fontWeight: 600,
            lineHeight: 1.4,
          }}
        >
          Build with the assistant
        </Typography>
        <Typography
          sx={{
            mt: 0.25,
            color: "#64748B",
            fontSize: "var(--assistant-chat-font-secondary, 13px)",
            lineHeight: 1.5,
          }}
        >
          From your first question to a survey ready for review.
        </Typography>
      </Box>
    </Stack>

    <Box
      as="ul"
      sx={{
        m: 0,
        p: 1,
        listStyle: "none",
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr)",
        gap: 0.25,
        "@container (min-width: 520px)": {
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          columnGap: 1,
        },
      }}
    >
      {items.map((item) => {
        const capability = capabilities[item.title];
        const Icon = capability?.icon ?? Sparkles;

        return (
          <Stack
            component="li"
            key={item.title}
            direction="row"
            spacing={1}
            alignItems="flex-start"
            sx={{ minWidth: 0, p: 0.9 }}
          >
            <Box
              sx={{
                display: "grid",
                placeItems: "center",
                width: 28,
                height: 28,
                mt: 0.15,
                flexShrink: 0,
                color: "#6366F1",
                backgroundColor: "#EEF2FF",
                borderRadius: 1.5,
              }}
            >
              <Icon size={15} aria-hidden="true" />
            </Box>
            <Box sx={{ minWidth: 0, overflowWrap: "anywhere" }}>
              <Typography
                component="p"
                sx={{
                  color: "#334155",
                  fontSize: "var(--assistant-chat-font-primary, 14px)",
                  fontWeight: 600,
                  lineHeight: 1.45,
                }}
              >
                {capability?.label ?? item.title}
              </Typography>
              <Typography
                component="p"
                sx={{
                  mt: 0.2,
                  color: "#64748B",
                  fontSize: "var(--assistant-chat-font-secondary, 13px)",
                  lineHeight: 1.5,
                }}
              >
                {capability?.description ?? item.description}
              </Typography>
            </Box>
          </Stack>
        );
      })}
    </Box>

    {footer && (
      <Stack
        direction="row"
        spacing={0.8}
        alignItems="flex-start"
        sx={{
          mx: 1.5,
          mb: 1.5,
          p: 1,
          borderRadius: 1.5,
          backgroundColor: "#F8FAFC",
        }}
      >
        <MousePointer2
          size={15}
          aria-hidden="true"
          style={{ flexShrink: 0, marginTop: 3, color: "#64748B" }}
        />
        <Box sx={{ minWidth: 0 }}>
          <Typography
            component="p"
            sx={{
              color: "#475569",
              fontSize: "var(--assistant-chat-font-label, 12px)",
              fontWeight: 600,
              lineHeight: 1.5,
            }}
          >
            For individual questions
          </Typography>
          <Typography
            component="p"
            sx={{
              mt: 0.3,
              color: "#64748B",
              fontSize: "var(--assistant-chat-font-secondary, 13px)",
              lineHeight: 1.5,
              overflowWrap: "anywhere",
            }}
          >
            {footer}
          </Typography>
        </Box>
      </Stack>
    )}
  </Paper>
);

export default AssistantCapabilities;
