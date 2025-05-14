import { Box } from "@mui/material";

const ImportQuestionModalPlaceholderTxt = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        color: "text.secondary",
        pointerEvents: "none",
        fontSize: "16px",
        lineHeight: 1.7,
        whiteSpace: "pre-line",
        padding: "16px",
        overflowY: "auto",
      }}
    >
      1. Import questions{"\n"}
      2. Add questions followed by its options{"\n"}
      3. Edit and adjust formatting later{"\n\n"}
      <Box component="span" sx={{ fontWeight: 600 }}>
        Example:
      </Box>
      {"\n"}
      What is the capital of France?{"\n"}
      <Box
        component="span"
        sx={{ display: "block", marginLeft: "16px", color: "grey.500" }}
      >
        A) Paris{"\n"}
        B) London{"\n"}
        C) Berlin{"\n"}
        D) Madrid
      </Box>
      <Box
        component="span"
        sx={{
          display: "block",
          textAlign: "center",
          fontSize: "20px",
          fontWeight: 500,
          color: "grey.400",
          marginY: "8px",
        }}
      >
        or
      </Box>
      <Box component="span" sx={{ color: "grey.500" }}>
        What is the capital of France?{"\n"}
        <Box component="span" sx={{ display: "block", marginLeft: "16px" }}>
          Paris{"\n"}
          London{"\n"}
          Berlin{"\n"}
          Madrid
        </Box>
      </Box>
    </Box>
  );
};

export default ImportQuestionModalPlaceholderTxt;
