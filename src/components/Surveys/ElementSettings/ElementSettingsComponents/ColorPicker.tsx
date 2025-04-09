import { useState } from "react";

import { Box, Popover } from "@mui/material";
import { Chrome } from "@uiw/react-color";

import { ColorPickerProps } from "../../../../utils/types";

const ColorPicker = ({ color, setColor }: ColorPickerProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          width: 32,
          height: 32,
          borderRadius: 4,
          backgroundColor: color,
          border: "1px solid #E0E0E0",
          cursor: "pointer",
        }}
      />

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box sx={{ p: 2 }}>
          <Chrome
            color={color}
            onChange={(color) => setColor(color.hex)}
            style={{ boxShadow: "none" }}
          />
        </Box>
      </Popover>
    </Box>
  );
};

export default ColorPicker;
