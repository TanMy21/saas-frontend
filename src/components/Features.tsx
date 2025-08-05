import { useState } from "react";

import { Box, ButtonBase, Grid, Paper, Stack, Typography } from "@mui/material";

import { features } from "../utils/utils";

const Features = () => {
  const [activeFeature, setActiveFeature] = useState(1);
  const activeFeatureData =
    features.find((feature) => feature.id === activeFeature) || features[0];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #f8fafc, #e0f2fe)",
        py: 8,
      }}
    >
      <Box maxWidth="lg" mx="auto" px={3}>
        {/* Grid layout */}
        <Grid container spacing={6} alignItems="center">
          {/* Feature List */}
          <Grid item xs={12} lg={6}>
            <Stack spacing={3}>
              {features.map((feature) => {
                const Icon = feature.icon;
                const isActive = activeFeature === feature.id;

                return (
                  <Paper
                    key={feature.id}
                    elevation={isActive ? 6 : 1}
                    onClick={() => setActiveFeature(feature.id)}
                    onMouseEnter={() => setActiveFeature(feature.id)}
                    sx={{
                      p: 3,
                      cursor: "pointer",
                      borderRadius: 4,
                      border: isActive
                        ? "2px solid #bfdbfe"
                        : "2px solid transparent",
                      transform: isActive ? "scale(1.03)" : "scale(1)",
                      transition: "all 0.3s ease",
                      backgroundColor: isActive
                        ? "#fff"
                        : "rgba(255,255,255,0.7)",
                      "&:hover": {
                        backgroundColor: "#fff",
                        boxShadow: 4,
                      },
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: isActive ? "#2563eb" : "#dbeafe",
                          color: isActive ? "#fff" : "#2563eb",
                          display: "flex",
                        }}
                      >
                        <Icon size={24} />
                      </Box>
                      <Box>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          color={isActive ? "text.primary" : "text.secondary"}
                          mb={1}
                        >
                          {feature.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            opacity: isActive ? 1 : 0.8,
                            transition: "opacity 0.3s ease",
                          }}
                        >
                          {feature.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                );
              })}
            </Stack>
          </Grid>

          {/* Feature Image */}
          <Grid item xs={12} lg={6}>
            <Box position="relative">
              <Box
                component="img"
                src={activeFeatureData.image}
                alt={activeFeatureData.title}
                sx={{
                  width: "100%",
                  height: { xs: 400, lg: 600 },
                  objectFit: "cover",
                  borderRadius: 4,
                  boxShadow: 6,
                  transition: "opacity 0.5s ease",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.2), transparent)",
                  borderRadius: 4,
                }}
              />

              {/* Floating Badge */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: -24,
                  left: -24,
                  backgroundColor: "#fff",
                  borderRadius: 3,
                  boxShadow: 3,
                  px: 2,
                  py: 1.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    p: 1,
                    backgroundColor: "#2563eb",
                    borderRadius: 2,
                    display: "flex",
                  }}
                >
                  <activeFeatureData.icon size={20} style={{ color: "#fff" }} />
                </Box>
                <Box>
                  <Typography fontWeight={600}>
                    {activeFeatureData.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Active Feature
                  </Typography>
                </Box>
              </Box>

              {/* Decorative Circles */}
              <Box
                sx={{
                  position: "absolute",
                  top: -16,
                  right: -16,
                  width: 80,
                  height: 80,
                  bgcolor: "#bfdbfe",
                  opacity: 0.6,
                  borderRadius: "50%",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: 40,
                  left: -32,
                  width: 48,
                  height: 48,
                  bgcolor: "#ddd6fe",
                  opacity: 0.4,
                  borderRadius: "50%",
                }}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Feature indicators */}
        <Stack direction="row" spacing={1} justifyContent="center" mt={8}>
          {features.map((feature) => (
            <ButtonBase
              key={feature.id}
              onClick={() => setActiveFeature(feature.id)}
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                transition: "all 0.3s ease",
                backgroundColor:
                  activeFeature === feature.id ? "#2563eb" : "#d1d5db",
                transform:
                  activeFeature === feature.id ? "scale(1.25)" : "scale(1)",
              }}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default Features;
