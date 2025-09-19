import { Box, Stack, Typography, Switch } from "@mui/material";

import { LABELS } from "../../utils/constants";
import { NotificationSettings } from "../../utils/types";

export default function NotificationsTab({
  value,
  onToggle,
}: {
  value: NotificationSettings;
  onToggle: (key: keyof NotificationSettings) => void;
}) {
  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800} color="text.primary">
          Notification Preferences
        </Typography>
        <Typography color="text.secondary">
          Choose how you want to be notified about updates.
        </Typography>
      </Box>

      <Stack spacing={2.5}>
        {Object.entries(value).map(([k, v]) => {
          const key = k as keyof NotificationSettings;
          return (
            <Box
              key={k}
              sx={{
                border: "1px solid",
                borderColor: "rgba(148,163,184,0.35)",
                borderRadius: 3,
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                bgcolor: "rgba(255,255,255,0.6)",
              }}
            >
              <Box>
                <Typography fontWeight={700}>{LABELS[key].title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {LABELS[key].desc}
                </Typography>
              </Box>

              <Switch
                checked={v}
                onChange={() => onToggle(key)}
                sx={{
                  width: 46,
                  height: 28,
                  padding: 0,
                  "& .MuiSwitch-switchBase": {
                    padding: 0.5,
                    "&.Mui-checked": {
                      transform: "translateX(18px)",
                      "& .MuiSwitch-thumb": {
                        backgroundColor: "#fff",
                      },
                      "& + .MuiSwitch-track": {
                        backgroundColor: "#005BC4",
                        opacity: 1,
                      },
                    },
                  },
                  "& .MuiSwitch-thumb": {
                    boxShadow: "0 1px 2px rgba(2,6,23,0.2)",
                    width: 20,
                    height: 20,
                    backgroundColor: "#fff",
                  },
                  "& .MuiSwitch-track": {
                    borderRadius: 14,
                    opacity: 1,
                    backgroundColor: "#9ca3af",
                    transition: "background-color 200ms ease",
                  },
                }}
              />
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
