import { useEffect, useState } from "react";

import ExpandMore from "@mui/icons-material/ExpandMore";
import {
  Box,
  Button,
  Collapse,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

import Logo from "../../../public/Logo.png";
import { navItems } from "../../utils/utils";

const Header = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      if (scrollY < 100) {
        setIsVisible(true);
      } else if (scrollY > heroHeight - 200) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDropdown = (name: string) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  const closeDropdowns = () => setActiveDropdown(null);

  return (
    <>
      {/* Header Bar */}
      <Box
        component="header"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1300,
          py: 1,
          backdropFilter: "blur(10px)",
          backgroundColor: "white",
          borderBottom: "1px solid #e5e7eb",
          boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
          transition: "transform 0.3s ease, opacity 0.3s ease",
          transform: isVisible ? "translateY(0)" : "translateY(-100%)",
          opacity: isVisible ? 1 : 0,
        }}
      >
        <Container
          disableGutters
          maxWidth={false}
          sx={{
            width: "92%",
            margin: "0 auto",
            // border: "2px solid green",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            {/* Logo */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                width: "20%",
                // border: "2px solid red",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: 48,
                  height: 48,
                  // border: "2px solid blue",
                }}
              >
                <img
                  src={Logo}
                  alt="Logo"
                  style={{ width: "80%", height: "80%" }}
                />
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  color: "#007FC8",
                  fontStyle: "italic",
                  letterSpacing: "-0.5px",
                  ml: "-2%",
                }}
              >
                eedflo
              </Typography>
            </Box>

            {/* Nav Items */}
            <Box
              sx={{
                display: { xs: "none", lg: "flex" },
                width: "28%",
                // border: "2px solid blue",
                alignItems: "center",
                gap: 4,
              }}
            >
              {navItems.map((item) => (
                <Box key={item.name} sx={{ position: "relative" }}>
                  <Button
                    onClick={() =>
                      item.hasDropdown ? toggleDropdown(item.name) : undefined
                    }
                    sx={{
                      color: "rgba(0, 0, 0, 0.7)",
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: "1rem",
                      "&:hover": { color: "#fff" },
                    }}
                    endIcon={
                      item.hasDropdown && (
                        <ExpandMore
                          sx={{
                            transform:
                              activeDropdown === item.name
                                ? "rotate(180deg)"
                                : "rotate(0)",
                            transition: "transform 0.2s ease",
                            fontSize: 20,
                          }}
                        />
                      )
                    }
                  >
                    {item.name}
                  </Button>
                </Box>
              ))}
            </Box>

            {/* Actions */}
            <Box display="flex" alignItems="center" gap={4}>
              <Link
                to="/login"
                style={{
                  textDecoration: "none",
                  color: "rgba(0, 0, 0, 0.7)",
                  textTransform: "none",
                  fontWeight: 700,
                }}
              >
                Login
              </Link>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#6366f1",
                  color: "#fff",
                  textTransform: "none",
                  px: 3,
                  borderRadius: 4,
                  "&:hover": {
                    backgroundColor: "#4f46e5",
                  },
                }}
              >
                Request Demo
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Dropdown Overlay */}
      <Collapse in={!!activeDropdown}>
        {activeDropdown && (
          <Box
            onClick={closeDropdowns}
            sx={{
              position: "fixed",
              inset: 0,
              zIndex: 1200,
              backgroundColor: "transparent",
            }}
          >
            <Paper
              elevation={8}
              onClick={(e) => e.stopPropagation()}
              sx={{
                position: "absolute",
                top: "64px",
                left: 0,
                right: 0,
                bgcolor: "#ffffff", // white background
                borderBottom: "1px solid #e0e0e0",
                py: 4,
              }}
            >
              <Container maxWidth="lg">
                {/* Sub-items Grid */}
                <Grid container spacing={4}>
                  {navItems
                    .find((item) => item.name === activeDropdown)
                    ?.items?.map((subItem, i) => (
                      <Grid item xs={12} sm={6} md={3} key={i}>
                        <Button
                          fullWidth
                          sx={{
                            display: "block",
                            textAlign: "left",
                            p: 2,
                            borderRadius: 2,
                            color: "text.primary",
                            bgcolor: "grey.50",
                            border: "1px solid #f0f0f0",
                            boxShadow: "none",
                            "&:hover": {
                              bgcolor: "grey.100",
                              borderColor: "primary.light",
                            },
                          }}
                        >
                          <Typography
                            fontWeight={600}
                            gutterBottom
                            color="text.primary"
                          >
                            {subItem}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Discover how Feedflo can transform your{" "}
                            {subItem.toLowerCase()} workflow
                          </Typography>
                        </Button>
                      </Grid>
                    ))}
                </Grid>

                {/* CTA Section */}
                <Box
                  mt={6}
                  pt={4}
                  borderTop="1px solid #e0e0e0"
                  display="flex"
                  flexDirection={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  gap={3}
                >
                  <Box>
                    <Typography color="text.primary" fontWeight={600}>
                      Ready to get started?
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      See how Feedflo can transform your organization
                    </Typography>
                  </Box>
                  <Box display="flex" gap={2}>
                    <Button
                      variant="contained"
                      sx={{
                        textTransform: "none",
                        bgcolor: "primary.main",
                        color: "#fff",
                        "&:hover": {
                          bgcolor: "primary.dark",
                        },
                      }}
                    >
                      Request Demo
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{
                        textTransform: "none",
                        borderColor: "grey.300",
                        color: "text.primary",
                        "&:hover": {
                          bgcolor: "grey.100",
                          borderColor: "primary.main",
                          color: "primary.main",
                        },
                      }}
                    >
                      Learn More
                    </Button>
                  </Box>
                </Box>
              </Container>
            </Paper>
          </Box>
        )}
      </Collapse>
    </>
  );
};

export default Header;
