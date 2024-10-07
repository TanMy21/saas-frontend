import { Box, Container, Typography } from "@mui/material";

const EmailNotVerified = () => {
  return (
    <Container component="main" maxWidth="xs" sx={{ marginTop: "12%" }}>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography>Email Not Verified.</Typography>
      </Box>
    </Container>
  );
};

export default EmailNotVerified;
