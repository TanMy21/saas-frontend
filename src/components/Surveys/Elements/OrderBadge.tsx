import { Box, Typography } from "@mui/material";

import { OrderBadgeProps } from "../../../utils/types";



export function OrderBadge({
  show,
  sizeMD,
  sizeXL,
  color,
  fontSize,
  value,
}: OrderBadgeProps) {
  if (!show) return null;
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: { md: `${sizeMD}px`, xl: `${sizeXL}px` },
        height: { md: `${sizeMD}px`, xl: `${sizeXL}px` },
        borderRadius: "50%",
        backgroundColor: color,
        marginRight: 2,
      }}
    >
      <Typography sx={{ fontWeight: "bold", color: "white", fontSize }}>
        {value}
      </Typography>
    </Box>
  );
}
