import { Box, Typography } from "@mui/material";

import { IATCombinedSideCardProps } from "../../../types/surveyBuilderTypes";

import { IATInlineEditableText } from "./IATInlineEditableText";

export const IATCombinedSideCard = ({
  keyLabel,
  brandLabel,
  themeLabel,
  canEdit,
  onBrandUpdate,
  onThemeUpdate,
}: IATCombinedSideCardProps) => {
  return (
    <Box
      sx={{
        border: "1px solid #F9A8D4",
        borderRadius: 2,
        bgcolor: "#FFFFFF",
        p: 1.5,
        textAlign: "center",
        minHeight: 104,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 0.5,
      }}
    >
      <Typography sx={{ fontSize: 16, color: "#64748B", mb: 0.5 }}>
        {keyLabel}
      </Typography>

      <IATInlineEditableText
        value={brandLabel}
        canEdit={canEdit}
        fontSize={15}
        fontWeight={900}
        color="#0F172A"
        onSave={onBrandUpdate}
      />

      <Typography sx={{ fontSize: 13, color: "#94A3B8", fontWeight: 800 }}>
        +
      </Typography>

      <IATInlineEditableText
        value={themeLabel}
        canEdit={canEdit}
        fontSize={14}
        fontWeight={800}
        color="#BE185D"
        onSave={onThemeUpdate}
      />
    </Box>
  );
};
