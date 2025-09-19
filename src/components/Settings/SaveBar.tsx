import { Box, Stack, Typography } from "@mui/material";
import { Check } from "lucide-react";

import CancelButton from "./CancelButton";
import GradientButton from "./GradientButton";

export default function SaveBar({
  loading,
  success,
  onSave,
  onCancel,
}: {
  loading: boolean;
  success: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <Box
      sx={{
        borderTop: "1px solid",
        borderColor: "divider",
        px: 4,
        py: 3,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          {success && (
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ color: "success.main" }}
            >
              <Check size={16} />
              <Typography variant="body2" fontWeight={600}>
                Settings saved successfully!
              </Typography>
            </Stack>
          )}
        </Box>

        <Stack direction="row" spacing={1.5}>
          <CancelButton onClick={onCancel}>Cancel</CancelButton>
          <GradientButton loading={loading} onClick={onSave} sx={{ px: 3 }}>
            Save
          </GradientButton>
        </Stack>
      </Stack>
    </Box>
  );
}
