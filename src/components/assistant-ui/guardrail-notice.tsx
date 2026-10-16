import type { HTMLAttributes } from "react";
import { useId } from "react";

import { Button, IconButton, Paper, Stack, Typography } from "@mui/material";
import { Info, LockKeyhole, ShieldAlert, TriangleAlert, X } from "lucide-react";

export type GuardrailNoticeTone = "refusal" | "warning" | "info" | "neutral";

export interface GuardrailNoticeProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "title" | "children"
> {
  title: string;
  explanation: string;
  policy: string;
  tone?: GuardrailNoticeTone;
  alternatives?: readonly string[];
  onPick?: (alternative: string) => void;
  disabled?: boolean;
  onDismiss?: () => void;
}

const tones = {
  refusal: {
    background: "#FEF2F2",
    border: "#FECACA",
    color: "#991B1B",
    icon: ShieldAlert,
  },
  warning: {
    background: "#FFFBEB",
    border: "#FDE68A",
    color: "#92400E",
    icon: TriangleAlert,
  },
  info: {
    background: "#EFF6FF",
    border: "#BFDBFE",
    color: "#1E40AF",
    icon: Info,
  },
  neutral: {
    background: "#F8FAFC",
    border: "#CBD5E1",
    color: "#475569",
    icon: LockKeyhole,
  },
};

// The assistant-ui standalone notice anatomy, styled for the app's MUI theme.
export function GuardrailNotice({
  title,
  explanation,
  policy,
  tone = "refusal",
  alternatives = [],
  onPick,
  disabled = false,
  onDismiss,
  role = "note",
  ...props
}: GuardrailNoticeProps) {
  const titleID = useId();
  const colors = tones[tone];
  const Icon = colors.icon;

  return (
    <Paper
      {...props}
      role={role}
      aria-labelledby={titleID}
      data-slot="guardrail-notice"
      variant="outlined"
      sx={{
        width: "100%",
        minWidth: 0,
        p: 1.5,
        borderRadius: 2.5,
        borderColor: colors.border,
        backgroundColor: colors.background,
        color: colors.color,
        fontFamily: (theme) => theme.typography.fontFamily,
        boxSizing: "border-box",
        overflowWrap: "anywhere",
      }}
    >
      <Stack direction="row" spacing={1} alignItems="flex-start">
        <Icon
          size={18}
          aria-hidden="true"
          style={{ flexShrink: 0, marginTop: 2 }}
        />
        <Stack spacing={0.6} sx={{ flex: 1, minWidth: 0 }}>
          <Stack
            direction="row"
            useFlexGap
            flexWrap="wrap"
            spacing={0.75}
            alignItems="center"
          >
            <Typography
              id={titleID}
              component="p"
              sx={{
                m: 0,
                color: "inherit",
                fontSize:
                  tone === "neutral"
                    ? "var(--assistant-chat-font-primary, 14px)"
                    : "var(--assistant-chat-font-title, 15px)",
                fontWeight: 600,
                lineHeight: 1.4,
              }}
            >
              {title}
            </Typography>
            <Typography
              component="span"
              sx={{
                color: "inherit",
                fontSize: "var(--assistant-chat-font-label, 12px)",
                fontWeight: 500,
                lineHeight: 1.4,
                border: "1px solid",
                borderColor: colors.border,
                borderRadius: 1,
                px: 0.6,
                py: 0.15,
              }}
            >
              {policy}
            </Typography>
          </Stack>
          <Typography
            component="p"
            sx={{
              m: 0,
              color: "inherit",
              fontSize: "var(--assistant-chat-font-primary, 14px)",
              fontWeight: 400,
              lineHeight: 1.5,
              whiteSpace: "pre-wrap",
            }}
          >
            {explanation}
          </Typography>
          {alternatives.length > 0 && (
            <Stack spacing={0.5} sx={{ pt: 0.4 }}>
              <Typography
                sx={{
                  color: "inherit",
                  fontSize: "var(--assistant-chat-font-label, 12px)",
                  fontWeight: 500,
                }}
              >
                Try instead
              </Typography>
              {alternatives.map((alternative) =>
                onPick ? (
                  <Button
                    key={alternative}
                    variant="outlined"
                    disabled={disabled}
                    onClick={() => onPick(alternative)}
                    sx={{
                      alignSelf: "flex-start",
                      maxWidth: "100%",
                      minHeight: 32,
                      px: 1,
                      py: 0.5,
                      borderColor: colors.border,
                      borderRadius: 1.5,
                      color: "inherit",
                      fontSize: "var(--assistant-chat-font-secondary, 13px)",
                      fontWeight: 600,
                      textAlign: "left",
                      textTransform: "none",
                      lineHeight: 1.45,
                      "&:hover": {
                        borderColor: colors.color,
                        backgroundColor: colors.background,
                      },
                    }}
                  >
                    {alternative}
                  </Button>
                ) : (
                  <Typography
                    key={alternative}
                    sx={{
                      color: "inherit",
                      fontSize: "var(--assistant-chat-font-secondary, 13px)",
                      lineHeight: 1.5,
                    }}
                  >
                    {alternative}
                  </Typography>
                ),
              )}
            </Stack>
          )}
        </Stack>
        {onDismiss && (
          <IconButton
            size="small"
            aria-label="Dismiss assistant notice"
            onClick={onDismiss}
            sx={{ p: 0.25, color: "inherit" }}
          >
            <X size={15} aria-hidden="true" />
          </IconButton>
        )}
      </Stack>
    </Paper>
  );
}
