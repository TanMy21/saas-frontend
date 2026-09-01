import { Box, Typography } from "@mui/material";

import type { IATUiConfig } from "../../types/surveyBuilderTypes";
import { getIATUiConfig } from "../../utils/iatUtils";

type PreviewIATCombinedBlockProps = {
  centerStimulus?: string;
  uiConfig?: unknown;
};

const PreviewIATSideCard = ({
  keyLabel,
  brandLabel,
  themeLabel,
}: {
  keyLabel: string;
  brandLabel: string;
  themeLabel: string;
}) => (
  <Box
    component="div"
    sx={{
      minWidth: 0,
      minHeight: 104,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: 0.5,
      p: 1.5,
      border: "1px solid #F9A8D4",
      borderRadius: 2,
      backgroundColor: "#FFFFFF",
      textAlign: "center",
    }}
  >
    <Typography sx={{ mb: 0.5, color: "#64748B", fontSize: 16 }}>
      {keyLabel}
    </Typography>

    <Typography
      sx={{
        maxWidth: "100%",
        color: "#0F172A",
        fontSize: 15,
        fontWeight: 900,
        lineHeight: 1.25,
        whiteSpace: "normal",
        overflowWrap: "anywhere",
      }}
    >
      {brandLabel}
    </Typography>

    <Typography sx={{ color: "#94A3B8", fontSize: 13, fontWeight: 800 }}>
      +
    </Typography>

    <Typography
      sx={{
        maxWidth: "100%",
        color: "#BE185D",
        fontSize: 14,
        fontWeight: 800,
        lineHeight: 1.25,
        whiteSpace: "normal",
        overflowWrap: "anywhere",
      }}
    >
      {themeLabel}
    </Typography>
  </Box>
);

const PreviewIATCombinedBlock = ({
  centerStimulus,
  uiConfig,
}: PreviewIATCombinedBlockProps) => {
  const config = getIATUiConfig(uiConfig as IATUiConfig | undefined);

  return (
    <Box
      component="div"
      sx={{
        p: 2,
        border: "1px solid #FBCFE8",
        borderRadius: 3,
        backgroundColor: "#FDF2F8",
      }}
    >
      <Box
        component="div"
        sx={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)",
          alignItems: "center",
          gap: 2,
        }}
      >
        <PreviewIATSideCard
          keyLabel={config.iatLeftKey}
          brandLabel={config.iatBrandA.label}
          themeLabel={config.iatThemeA.label}
        />

        <Box
          component="div"
          sx={{
            minWidth: 130,
            px: 2,
            py: 2.5,
            border: "1px solid #E2E8F0",
            borderRadius: 2,
            backgroundColor: "#FFFFFF",
            boxShadow: "0 8px 22px rgba(15,23,42,0.06)",
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              color: "#0F172A",
              fontSize: 20,
              fontWeight: 900,
              overflowWrap: "anywhere",
            }}
          >
            {centerStimulus || "Add attributes"}
          </Typography>
        </Box>

        <PreviewIATSideCard
          keyLabel={config.iatRightKey}
          brandLabel={config.iatBrandB.label}
          themeLabel={config.iatThemeB.label}
        />
      </Box>
    </Box>
  );
};

export default PreviewIATCombinedBlock;
