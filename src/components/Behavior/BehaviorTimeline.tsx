import { Box, Typography } from "@mui/material";

import { BehaviorTimelineProps } from "../../types/behaviorTypes";
import { behaviorEventConfig } from "../../utils/constants";
import { formatDuration, formatTimestamp } from "../../utils/utils";

export function BehaviorTimeline({ timeline }: BehaviorTimelineProps) {
  const flattened = timeline
    .flatMap((q) =>
      q.events.map((e) => ({
        ...e,
        questionOrder: q.questionOrder,
      })),
    )
    .sort(
      (a, b) =>
        (a.atMs ?? Number.MAX_SAFE_INTEGER) -
        (b.atMs ?? Number.MAX_SAFE_INTEGER),
    );

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {flattened.map((event, index) => {
        const config = behaviorEventConfig[event.type];
        const Icon = config.icon;
        const isLast = index === flattened.length - 1;

        return (
          <Box
            key={`${event.type}-${index}`}
            sx={{
              position: "relative",
              display: "flex",
              gap: 2,
              mb: 3,
            }}
          >
            {!isLast && (
              <Box
                sx={{
                  position: "absolute",
                  left: 15,
                  top: 32,
                  width: 2,
                  height: "100%",
                  bgcolor: "#E5E7EB",
                }}
              />
            )}

            {/* Icon */}
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ...config.sx,
              }}
            >
              <Icon size={16} />
            </Box>

            {/* Content */}
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography fontWeight={600}>
                  Q{event.questionOrder} · {config.label}
                </Typography>

                <Typography fontFamily="monospace" color="text.secondary">
                  {formatTimestamp(event.atMs)}
                </Typography>
              </Box>

              {event.durationMs && (
                <Box
                  sx={{
                    mt: 1,
                    display: "inline-block",
                    px: 1,
                    py: 0.25,
                    borderRadius: 1,
                    bgcolor: "#F3F4F6",
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  Duration: {formatDuration(event.durationMs)}
                </Box>
              )}

              {event.count && (
                <Box
                  sx={{
                    mt: 1,
                    fontSize: 12,
                    color: "text.secondary",
                  }}
                >
                  Occurred {event.count} times
                </Box>
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
