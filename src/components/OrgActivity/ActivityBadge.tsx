import { Box, Tooltip } from "@mui/material";

const neutralStyle = {
  bgcolor: "#F1F5F9",
  color: "#475569",
  borderColor: "#E2E8F0",
};

const statusStyles: Record<string, typeof neutralStyle> = {
  ACTIVE: {
    bgcolor: "#ECFDF5",
    color: "#047857",
    borderColor: "#A7F3D0",
  },
  EXPIRED: neutralStyle,
  REVOKED: {
    bgcolor: "#FFF1F2",
    color: "#BE123C",
    borderColor: "#FECDD3",
  },
};

type ActivityBadgeProps = {
  value: string | null | undefined;
  kind: "status" | "event";
};

export default function ActivityBadge({ value, kind }: ActivityBadgeProps) {
  const rawValue = value?.trim() ?? "";
  const label = rawValue
    ? rawValue
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (character) => character.toUpperCase())
    : "—";
  const isStatus = kind === "status";
  const colors = isStatus
    ? statusStyles[rawValue.toUpperCase()] ?? neutralStyle
    : {
        bgcolor: "rgba(0,116,235,0.06)",
        color: "primary.dark",
        borderColor: "rgba(0,116,235,0.14)",
      };

  return (
    <Tooltip title={rawValue}>
      <Box
        component="span"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          verticalAlign: "middle",
          gap: 0.75,
          minHeight: 28,
          maxWidth: isStatus ? "100%" : 280,
          px: 1.25,
          py: 0.5,
          border: "1px solid",
          borderRadius: 1,
          fontSize: "0.75rem",
          fontWeight: 600,
          lineHeight: 1.5,
          ...colors,
        }}
      >
        {isStatus && rawValue && (
          <Box
            component="span"
            aria-hidden="true"
            sx={{
              width: 6,
              height: 6,
              flexShrink: 0,
              borderRadius: "50%",
              bgcolor: "currentColor",
            }}
          />
        )}
        <Box
          component="span"
          sx={{
            minWidth: 0,
            whiteSpace: isStatus ? "nowrap" : "normal",
            overflowWrap: "anywhere",
          }}
        >
          {label}
        </Box>
      </Box>
    </Tooltip>
  );
}
