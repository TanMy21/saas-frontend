import { Box, Typography } from "@mui/material";

const FlowFormNoCondition = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: "2%",
        width: "90%",
        maxHeight: "40px",
      }}
    >
      <Box sx={{ width: "24%", height: "96%" }}>
        <Typography sx={{ color: "red", fontSize: "24px", fontWeight: "bold" }}>
          No Condition
        </Typography>
      </Box>
    </Box>
  );
};

export default FlowFormNoCondition;
