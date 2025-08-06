import { useEffect, useState } from "react";

import { Box, Button, Container, Grid, Typography } from "@mui/material";

import { features } from "../../utils/utils";

const Features = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const cycleDuration = 6000;
  const transitionDuration = 200;

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(0);
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveFeature((current) => (current + 1) % features.length);
        setIsTransitioning(false);
      }, transitionDuration);
    }, cycleDuration);

    const progressInterval = setInterval(() => {
      setProgress((prev) =>
        prev >= 100 ? 100 : prev + 100 / (cycleDuration / 50)
      );
    }, 50);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, []);

  const handleTabClick = (index: number) => {
    setActiveFeature(index);
    setProgress(0);
    setIsTransitioning(false);
  };

  const currentFeature = features[activeFeature];
  const IconComponent = currentFeature.icon;

  return (
    <Box
      sx={{
        height: "600px",
        background: "white",
        py: 12,
      }}
    >
      <Container maxWidth="lg">
        {/* Tabs */}
        <Box display="flex" justifyContent="center" mb={8}>
          <Box display="flex" gap={8}>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = activeFeature === index;

              return (
                <Button
                  key={feature.id}
                  onClick={() => handleTabClick(index)}
                  sx={{
                    position: "relative",
                    width: 140,
                    height: 48,
                    borderRadius: 4,
                    textTransform: "none",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    py:4,
                    color: isActive ? "#fff" : "text.secondary",
                    bgcolor: isActive ? "primary.main" : "#fff",
                    boxShadow: isActive ? 4 : 1,
                    transform: isActive ? "scale(1.1)" : "scale(1)",
                    transition: "all 0.3s ease",
                    overflow: "hidden",
                    "&:hover": {
                      bgcolor: isActive ? "primary.dark" : "grey.100",
                    },
                  }}
                >
                  {/* Progress animation background */}
                  {isActive && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        width: `${progress}%`,
                        backgroundColor: "primary.dark",
                        zIndex: 0,
                        transition: "width 0.05s linear",
                      }}
                    />
                  )}
                  <Box
                    sx={{
                      position: "relative",
                      zIndex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Icon size={24} style={{ marginBottom: 4 }} />
                    {feature.title}
                  </Box>
                </Button>
              );
            })}
          </Box>
        </Box>

        {/* Main Content */}
        <Grid
          container
          spacing={8}
          alignItems="center"
          sx={{
            opacity: isTransitioning ? 0 : 1,
            transition: "opacity 0.3s ease",
          }}
        >
          {/* Left column */}
          <Grid item xs={12} lg={6}>
            <Box display="flex" alignItems="center" gap={2} mb={4}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: "primary.main",
                  borderRadius: 4,
                  display: "flex",
                }}
              >
                <IconComponent size={32} style={{ color: "#fff" }} />
              </Box>
              <Typography variant="h4" fontWeight="bold" color="text.primary">
                {currentFeature.title}
              </Typography>
            </Box>

            <Typography variant="body1" color="text.secondary" mb={4}>
              {currentFeature.description}
            </Typography>

            <Box mb={4}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Key Benefits:
              </Typography>
              <Grid container spacing={2}>
                {[
                  "Easy to use",
                  "Fast performance",
                  "Reliable support",
                  "Scalable solution",
                ].map((benefit, i) => (
                  <Grid item xs={6} key={i}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: "primary.main",
                        }}
                      />
                      <Typography variant="body2" color="text.primary">
                        {benefit}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Button
              variant="contained"
              sx={{
                textTransform: "none",
                px: 4,
                py: 2,
                borderRadius: 2,
                fontWeight: 600,
                boxShadow: 4,
                bgcolor: "primary.main",
                "&:hover": {
                  bgcolor: "primary.dark",
                  boxShadow: 6,
                },
              }}
            >
              Learn More
            </Button>
          </Grid>

          {/* Right column */}
          <Grid item xs={12} lg={6}>
            <Box position="relative">
              <Box
                component="img"
                src={currentFeature.image}
                alt={currentFeature.title}
                sx={{
                  width: "100%",
                  height: { xs: 400, md: 500 },
                  objectFit: "cover",
                  borderRadius: 6,
                  boxShadow: 6,
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.2), transparent)",
                  borderRadius: 6,
                }}
              />

              {/* Decorative circles */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: -24,
                  left: -24,
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  bgcolor: "primary.light",
                  opacity: 0.6,
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  right: -32,
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  bgcolor: "#ddd6fe", // purple-200
                  opacity: 0.4,
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Features;
