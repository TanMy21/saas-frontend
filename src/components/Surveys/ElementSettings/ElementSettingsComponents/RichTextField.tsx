import { useCallback } from "react";

import { Box } from "@mui/material";

import { RichTextFieldProps } from "../../../../utils/types";
import { EditableLine } from "../../Elements/EditableLine";

export function RichTextField({
  value,
  onChange,
  placeholder,
  height = 42,
  sx,
  inputSx,
  id = "rich-text-field",
  contentKey,
  blockEnter = true,
}: RichTextFieldProps) {
  // We use EditableLine with "always active" so it's directly editable here.
  // If you prefer click-to-edit, you can manage an internal active state.

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Typical single-line behavior: prevent Enter from inserting <br>
    if (e.key === "Enter") {
      e.preventDefault();
    }
  }, []);

  return (
    <Box
      sx={{
        // Mimic your TextField visual style (filled, rounded, hover/focus bg)
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
      <EditableLine
        active // always editable in settings panel
        value={value ?? ""}
        contentKey={contentKey}
        placeholder={placeholder}
        onStartEdit={() => {
          /* always active; noop */
        }}
        onChange={(nextHTML) => onChange?.(nextHTML)} // preserve HTML
        onKeyDown={handleKeyDown}
        textFieldId={id ?? "rich-text-field"}
        cursorWhenActive="text"
        // match your input font styles so <strong>/<em>/<u> inherit
        textFieldSx={{
          fontFamily: `"Inter", "Segoe UI", "Roboto", sans-serif`,
          fontSize: "15px",
          lineHeight: 1.5,
          width: "100%",
          whiteSpace: "nowrap",
          overflow: "hidden", // ✅ keep everything on one line
          "& *": {
            whiteSpace: "nowrap", // ✅ ensure <strong>/<em>/<u> also stay inline
          },
          ...inputSx,
        }}
        typographySx={{
          whiteSpace: "nowrap", // ✅ also apply for display mode
          overflow: "hidden",
        }} // unused in active mode
      />
    </Box>
  );
}
