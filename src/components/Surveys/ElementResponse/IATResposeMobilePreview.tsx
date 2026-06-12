import { Box, Typography } from "@mui/material";

import { useGetOptionsOfQuestionQuery } from "../../../app/slices/optionApiSlice";
import { RootState } from "../../../app/store";
import { useAppSelector } from "../../../app/typedReduxHooks";
import { getIATUiConfig, isIATOptionInGroup } from "../../../utils/iatUtils";
import { ElementProps, OptionType } from "../../../utils/types";

const IATMobileStimulusCard = ({ stimulus }: { stimulus: string }) => {
  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: 5,
        bgcolor: "#FFFFFF",
        border: "1px solid #E2E8F0",
        px: 2,
        py: 3,
        textAlign: "center",
        boxShadow: "0 18px 38px rgba(15,23,42,0.11)",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at top, rgba(0,116,235,0.08), transparent 54%)",
          pointerEvents: "none",
        }}
      />

      <Typography
        sx={{
          position: "relative",
          fontSize: 28,
          fontWeight: 950,
          color: "#0F172A",
          lineHeight: 1.1,
          wordBreak: "break-word",
        }}
      >
        {stimulus}
      </Typography>
    </Box>
  );
};

const IATMobileTapTarget = ({
  brand,
  association,
  side,
}: {
  brand: string;
  association: string;
  side: "left" | "right";
}) => {
  const isLeft = side === "left";

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 4,
        border: "1px solid",
        borderColor: isLeft ? "#BBF7D0" : "#BFDBFE",
        bgcolor: isLeft ? "#F0FDF4" : "#EFF6FF",
        px: 1.25,
        py: 1.5,
        minHeight: 112,
        textAlign: "center",
        boxShadow: "0 8px 18px rgba(15,23,42,0.06)",
      }}
    >
      <Typography
        sx={{
          position: "relative",
          fontSize: 10.5,
          fontWeight: 900,
          color: isLeft ? "#16A34A" : "#0074EB",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          mb: 0.8,
        }}
      >
        Tap
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          mt: 4,
          width: "98%",
          height: "80%",
        }}
      >
        <Typography
          sx={{
            position: "relative",
            fontSize: 20,
            fontWeight: 950,
            color: isLeft ? "#166534" : "#1D4ED8",
            lineHeight: 1.15,
            wordBreak: "break-word",
          }}
        >
          {brand}
        </Typography>

        <Typography
          sx={{
            position: "relative",
            my: 0.4,
            fontSize: 13,
            fontWeight: 950,
            color: isLeft ? "#22C55E" : "#60A5FA",
            lineHeight: 1,
          }}
        >
          +
        </Typography>

        <Typography
          sx={{
            position: "relative",
            fontSize: 16,
            fontWeight: 850,
            color: isLeft ? "#15803D" : "#2563EB",
            lineHeight: 1.15,
            wordBreak: "break-word",
          }}
        >
          {association}
        </Typography>
      </Box>
    </Box>
  );
};

export const IATMobilePreview = ({ qID, display }: ElementProps) => {
  const question = useAppSelector(
    (state: RootState) => state.question.selectedQuestion,
  );

  const uiConfig = getIATUiConfig(question?.questionPreferences?.uiConfig);

  const { data: options = [] as OptionType[] } = useGetOptionsOfQuestionQuery(
    qID!,
    {
      skip: !qID,
    },
  );

  const themeAAttributes = [...options]
    .filter((option) => isIATOptionInGroup(option.settings, "THEME_A"))
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const themeBAttributes = [...options]
    .filter((option) => isIATOptionInGroup(option.settings, "THEME_B"))
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const allAttributes = [...themeAAttributes, ...themeBAttributes];

  const previewStimulus = allAttributes[0]?.text || "Add attributes";

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: 450,
        display: "flex",
        justifyContent: "center",
        mt: 3,
      }}
    >
      <Box
        sx={{
          width: display === "mobile" ? "96%" : "76%",
          maxWidth: "96%",
          p: 2,
          borderRadius: 5,
        }}
      >
        <IATMobileStimulusCard stimulus={previewStimulus} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 3,
            mt: "48%",
          }}
        >
          <IATMobileTapTarget
            brand={uiConfig.iatBrandA.label}
            association={uiConfig.iatThemeA.label}
            side="left"
          />

          <IATMobileTapTarget
            brand={uiConfig.iatBrandB.label}
            association={uiConfig.iatThemeB.label}
            side="right"
          />
        </Box>
      </Box>
    </Box>
  );
};
