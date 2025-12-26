import { Box, Chip, Drawer, IconButton, Typography } from "@mui/material";
import { X } from "lucide-react";

import { calculateDropOff, severitySx } from "../../utils/utils";

export const DetailDrawer = ({ open, onClose, question, totalStarts }: any) => {
  if (!question) return null;

  const { dropped, rate } = calculateDropOff(
    question.reached,
    question.answered
  );

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: { xs: "100vw", sm: 480 }, p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Box>
            <Chip
              label={`${question.number} • ${question.type}`}
              size="small"
            />
            <Typography variant="h6" fontWeight={700} mt={1}>
              {question.text}
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <X size={20} />
          </IconButton>
        </Box>

        <Box
          sx={{
            p: 2,
            border: "2px solid",
            borderRadius: 2,
            mb: 4,
            ...severitySx(rate),
          }}
        >
          <Typography variant="body2">Drop-off Rate</Typography>
          <Typography variant="h4" fontWeight={700}>
            {rate.toFixed(1)}%
          </Typography>
          <Typography variant="body2">({dropped} users lost)</Typography>
        </Box>

        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
          Answer Distribution
        </Typography>

        {question.distribution.map((d: any, i: number) => (
          <Box key={i} sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2">{d.label}</Typography>
              <Typography variant="body2">{d.percent}%</Typography>
            </Box>
            <Box sx={{ height: 8, bgcolor: "#e5e7eb", borderRadius: 4 }}>
              <Box
                sx={{
                  height: "100%",
                  width: `${d.percent}%`,
                  bgcolor: "#6366f1",
                  borderRadius: 4,
                }}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Drawer>
  );
};
