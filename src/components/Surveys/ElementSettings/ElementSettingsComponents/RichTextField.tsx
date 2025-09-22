import { Box } from "@mui/material";

import { RichTextFieldProps } from "../../../../utils/types";

import EditablePlainText from "./EditablePlainText";

export function RichTextField({
  value,
  onChange,
  placeholder,
  height = 42,
  sx,
  id = "rich-text-field",
  blockEnter = true,
}: RichTextFieldProps) {
  return (
    <Box
      sx={{
        borderRadius: "8px",
        height,
        width: { md: "92%" },
        fontSize: "15px",
        backgroundColor: "#F3F4F6",
        color: "#1F2937",
        px: 1.5,
        display: "flex",
        alignItems: "center",
        transition: "background-color 0.2s ease",
        "&:hover": { backgroundColor: "#E5E7EB" },
        "&:focus-within": { backgroundColor: "#E0E7FF" },
        ...sx,
      }}
    >
      <EditablePlainText
        id={id}
        value={value ?? ""}
        placeholder={placeholder}
        blockEnter={blockEnter}
        onChange={(nextPlain) => onChange?.(nextPlain)}
        sx={undefined}
      />
    </Box>
  );
}
