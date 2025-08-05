import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        bgcolor: "#fff",
        borderTop: "1px solid #e5e7eb",
        mt: 8,
      }}
    >
      <Container maxWidth="lg" sx={{ py: 8, position: "relative" }}>
        {/* Top CTA Section */}
        <Stack
          direction={{ xs: "column", lg: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", lg: "center" }}
          spacing={4}
          mb={8}
        >
          <Typography variant="h4" sx={{ fontWeight: 300, maxWidth: "600px" }}>
            Turn Every Response into a Game-Changing Insight
          </Typography>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#111827",
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 500,
              "&:hover": { bgcolor: "#1f2937" },
            }}
          >
            Request a Demo
          </Button>
        </Stack>

        {/* Grid Links Section */}
        <Grid container spacing={4} justifyContent="flex-end">
          {/* Logo */}
          <Grid item xs={12} md={2}>
            <Box
              sx={{
                width: 48,
                height: 48,
                bgcolor: "#111827",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "1.25rem",
                mb: 3,
              }}
            >
              logo
            </Box>
          </Grid>

          {/* Platform */}
          <Grid item xs={6} md={2}>
            <Typography
              variant="subtitle2"
              sx={{
                color: "#6b7280",
                mb: 2,
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              Platform
            </Typography>
            <Stack spacing={1}>
              {["Flow", "Insights", "Workflows"].map((text) => (
                <Typography
                  key={text}
                  component="a"
                  href="#"
                  sx={{
                    color: "#111827",
                    fontSize: "0.95rem",
                    textDecoration: "none",
                    "&:hover": { color: "#6b7280" },
                  }}
                >
                  {text}
                </Typography>
              ))}
            </Stack>
          </Grid>

          {/* About */}
          <Grid item xs={6} md={3}>
            <Typography
              variant="subtitle2"
              sx={{
                color: "#6b7280",
                mb: 2,
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              About
            </Typography>
            <Stack spacing={1}>
              {["Customers", "Security", "Company", "Blog"].map((text) => (
                <Typography
                  key={text}
                  component="a"
                  href="#"
                  sx={{
                    color: "#111827",
                    fontSize: "0.95rem",
                    textDecoration: "none",
                    "&:hover": { color: "#6b7280" },
                  }}
                >
                  {text}
                </Typography>
              ))}
            </Stack>
          </Grid>

          {/* About */}
          <Grid item xs={6} md={3}>
            <Typography
              variant="subtitle2"
              sx={{
                color: "#6b7280",
                mb: 2,
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              Resources
            </Typography>
            <Stack spacing={1}>
              {["Feature Request", "Privacy Policy", "Help"].map((text) => (
                <Typography
                  key={text}
                  component="a"
                  href="#"
                  sx={{
                    color: "#111827",
                    fontSize: "0.95rem",
                    textDecoration: "none",
                    "&:hover": { color: "#6b7280" },
                  }}
                >
                  {text}
                </Typography>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>

      <Divider />

      {/* Bottom copyright */}
      <Box sx={{ bgcolor: "#f9fafb", py: 3 }}>
        <Container maxWidth="lg">
          <Typography
            variant="body2"
            sx={{ textAlign: "center", color: "#6b7280", fontSize: "0.875rem" }}
          >
            &copy; 2025 Feedflo. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;
