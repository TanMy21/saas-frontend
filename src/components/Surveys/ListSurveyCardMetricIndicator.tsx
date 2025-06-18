import { Box, Typography } from "@mui/material";

import { useAppTheme } from "../../theme/useAppTheme";
import { SurveyCardMetricIndicatorProps } from "../../utils/types";

const ListSurveyCardMetricIndicator = ({
  value,
  title,
}: SurveyCardMetricIndicatorProps) => {
  const { textStyles } = useAppTheme();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "20%",
        height: "96%",
        // border: "2px solid red",
      }}
    >
      <Typography sx={textStyles.listViewMetricLabelValue}>
        {value}
      </Typography>
      <Typography sx={{ ...textStyles.listViewMetricLabelTitle, mb: "8px" }}>
        {title}
      </Typography>
    </Box>
  );
};

export default ListSurveyCardMetricIndicator;
