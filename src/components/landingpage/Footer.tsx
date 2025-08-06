import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import Logo from "../../../public/Logo.png";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        bgcolor: "#fff",
        // border: "2px solid red",
        borderTop: "1px solid #e5e7eb",
        mt: 8,
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "96%",
          margin: "0 auto",
          py: 8,
          position: "relative",
          // border: "2px solid green",
        }}
      >
        {/* Top CTA Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", lg: "center" },
            spacing: 4,
            mb: 4,
            // border: "2px solid blue",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, maxWidth: "800px" }}>
            Turn Every Response into a Game-Changing Insight
          </Typography>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#6366F1",
              px: 4,
              py: 1.5,
              borderRadius: 4,
              fontWeight: 500,
              "&:hover": { bgcolor: "#6366F1" },
            }}
          >
            Request Demo
          </Button>
        </Box>
        <Divider />
        {/* Grid Links Section */}
        <Grid
          container
          spacing={4}
          justifyContent="space-between"
          sx={{ width: "100%", margin: "auto" }}
        >
          {/* Logo */}
          <Grid item xs={12} md={2} lg={2}>
            <Box
              sx={{
                width: 48,
                height: 48,
                bgcolor: "#ffffffff",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "1.25rem",
                mb: 3,
                ml: "-16%",
              }}
            >
              <img
                src={Logo}
                alt="Logo"
                style={{ width: "80%", height: "80%" }}
              />
            </Box>
          </Grid>
          <Grid
            item
            xs={6}
            md={3}
            lg={8}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            {/* About */}
            <Grid item xs={6} md={3}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: "#6b7280",
                  mb: 2,
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                About
              </Typography>
              <Stack spacing={1}>
                {["Customers", "Company", "Blog"].map((text) => (
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

            {/* Resources */}
            <Grid item xs={6} md={3}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: "#6b7280",
                  mb: 2,
                  textTransform: "uppercase",
                  fontWeight: 700,
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
