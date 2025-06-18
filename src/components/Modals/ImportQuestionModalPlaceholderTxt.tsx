import { Box, Typography } from "@mui/material";

import { useAppTheme } from "../../theme/useAppTheme";

const ImportQuestionModalPlaceholderTxt = () => {
  const { grey } = useAppTheme();
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        color: "#475569",
        pointerEvents: "none",
        fontSize: "16px",
        lineHeight: 1.7,
        px: 2,
        py: 2,
        whiteSpace: "pre-line",
        padding: "16px",
        overflowY: "auto",
      }}
    >
      {/* Instructions */}
      <Typography variant="body2" sx={{ fontWeight: 500, color: grey[700] }}>
        1. Import questions{"\n"}
        2. Add questions followed by their options{"\n"}
        3. Edit and adjust formatting later{"\n"}
      </Typography>

      {/* Example header */}
      <Typography sx={{ fontWeight: 600, mt: 2, color: grey[700] }}>
        Example:
      </Typography>

      {/* Example 1 */}
      <Typography sx={{ mt: 1, color: grey[700] }}>
        How satisfied are you with our customer service?
      </Typography>
      {/* Indented options */}
      <Box sx={{ pl: 2, color: grey[700] }}>
        <Typography sx={{ color: grey[700] }}>A) Very satisfied</Typography>
        <Typography sx={{ color: grey[700] }}>B) Satisfied</Typography>
        <Typography sx={{ color: grey[700] }}>C) Neutral</Typography>
        <Typography sx={{ color: grey[700] }}>D) Dissatisfied</Typography>
        <Typography sx={{ color: grey[700] }}>E) Very dissatisfied</Typography>
      </Box>

      {/* 'or' */}
      <Typography
        sx={{
          textAlign: "center",
          fontSize: "18px",
          fontWeight: 500,
          my: 1,
          color: grey[700],
        }}
      >
        or
      </Typography>

      {/* Example 2 */}
      <Typography sx={{ color: grey[700] }}>
        How satisfied are you with our customer service?
      </Typography>
      {/* Indented options without labels */}
      <Box sx={{ pl: 2 }}>
        <Typography sx={{ color: grey[700] }}>Very satisfied</Typography>
        <Typography sx={{ color: grey[700] }}>Satisfied</Typography>
        <Typography sx={{ color: grey[700] }}>Neutral</Typography>
        <Typography sx={{ color: grey[700] }}>Dissatisfied</Typography>
        <Typography sx={{ color: grey[700] }}>Very dissatisfied</Typography>
      </Box>
    </Box>
  );
};

export default ImportQuestionModalPlaceholderTxt;
