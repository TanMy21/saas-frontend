import { Box, Typography } from "@mui/material";

import { useAppTheme } from "../../theme/useAppTheme";
import { SurveyCardMetricIndicatorProps } from "../../utils/types";

const GridSurveyCardMetricIndicator = ({
  value,
  title,
}: SurveyCardMetricIndicatorProps) => {
  const { background, textStyles } = useAppTheme();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: { md: "44%", xl: "48%" },
        height: { md: "96%", xl: "100%" },
        border: "none",
        backgroundColor: background.softGrey,
        borderRadius: 3,
        gap: 0.5,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "auto",
          width: "96%",
          height: "68%",
          paddingTop: "8px",
          // border: "2px solid red",
        }}
      >
        <Typography sx={textStyles.metricLabelValue}>{value}</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "auto",
          width: "96%",
          height: "32%",
          paddingBottom: "10px",
          // border: "2px solid blue",
        }}
      >
        <Typography sx={textStyles.metricLabelTitle}>{title}</Typography>
      </Box>
    </Box>
  );
};

export default GridSurveyCardMetricIndicator;
