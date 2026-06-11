import { Box, Chip, Typography } from "@mui/material";

import { useGetOptionsOfQuestionQuery } from "../../../app/slices/optionApiSlice";
import { RootState } from "../../../app/store";
import { useAppSelector } from "../../../app/typedReduxHooks";
import { ElementProps, OptionType } from "../../../utils/types";

const IATMobilePreviewHeader = ({ totalStimuli }: { totalStimuli: number }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        mb: 1.75,
        gap: 1,
      }}
    >
      <Chip
        label={`${totalStimuli}/10 stimuli`}
        size="small"
        sx={{
          bgcolor: "#F8FAFC",
          color: "#475569",
          border: "1px solid #E2E8F0",
          fontWeight: 800,
          fontSize: 12,
        }}
      />
    </Box>
  );
};

const IATMobileCategoryCard = ({
  keyLabel,
  title,
  side,
}: {
  keyLabel: string;
  title: string;
  side: "left" | "right";
}) => {
  const isLeft = side === "left";

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: isLeft ? "#BBF7D0" : "#BFDBFE",
        bgcolor: isLeft ? "#F0FDF4" : "#EFF6FF",
        borderRadius: 3,
        px: 1.25,
        py: 1.35,
        minWidth: 0,
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          width: 30,
          height: 30,
          mx: "auto",
          mb: 0.75,
          borderRadius: "50%",
          bgcolor: "#FFFFFF",
          border: "1px solid",
          borderColor: isLeft ? "#86EFAC" : "#93C5FD",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: isLeft ? "#15803D" : "#2563EB",
          fontSize: 13,
          fontWeight: 900,
        }}
      >
        {keyLabel}
      </Box>

      <Typography
        sx={{
          fontSize: 13,
          fontWeight: 900,
          color: isLeft ? "#166534" : "#1D4ED8",
          wordBreak: "break-word",
          lineHeight: 1.25,
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};

const IATMobileStimulusCard = ({ stimulus }: { stimulus: string }) => {
  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: 4,
        bgcolor: "#FAFAFA",
        border: "1px solid #E2E8F0",
        px: 2,
        py: 3,
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      <Typography
        sx={{
          mt: 1,
          fontSize: 24,
          fontWeight: 950,
          color: "#0F172A",
          lineHeight: 1.15,
          wordBreak: "break-word",
        }}
      >
        {stimulus}
      </Typography>
    </Box>
  );
};

export const IATMobilePreview = ({ qID, display }: ElementProps) => {
  const question = useAppSelector(
    (state: RootState) => state.question.selectedQuestion,
  );

  const uiConfig = question?.questionPreferences?.uiConfig || {};

  const leftCategory = uiConfig.iatLeftCategoryLabel || "Left category";
  const rightCategory = uiConfig.iatRightCategoryLabel || "Right category";

  const { data: options = [] as OptionType[] } = useGetOptionsOfQuestionQuery(
    qID!,
    {
      skip: !qID,
    },
  );

  const sortedStimuli = [...options].sort(
    (a, b) => (a.order || 0) - (b.order || 0),
  );

  const previewStimulus = sortedStimuli[0]?.text || "Add stimulus";

  const totalStimuli = sortedStimuli.length;

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        mt: 3,
      }}
    >
      <Box
        sx={{
          width: display === "mobile" ? "92%" : "76%",
          maxWidth: "96%",
          p: 2,
        }}
      >
        <IATMobilePreviewHeader totalStimuli={totalStimuli} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 1.25,
            mb: 2,
          }}
        >
          <IATMobileCategoryCard
            keyLabel="E"
            title={leftCategory}
            side="left"
          />

          <IATMobileCategoryCard
            keyLabel="I"
            title={rightCategory}
            side="right"
          />
        </Box>

        <IATMobileStimulusCard stimulus={previewStimulus} />
      </Box>
    </Box>
  );
};
