import { useEffect, useState } from "react";

import { Box, Container, Grid, Paper, Typography } from "@mui/material";

const StatsSection = () => {
  const [animatedStats, setAnimatedStats] = useState({
    created: 0,
    users: 0,
  });

  const finalStats = {
    created: 100,
    users: 1000,
  };

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);

      setAnimatedStats({
        created: Math.floor(finalStats.created * easeOutProgress),
        users: Math.floor(finalStats.users * easeOutProgress),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedStats(finalStats);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <Box
      component="section"
      sx={{
        display: "flex",
        width: "80%",
        height: "240px",
        margin: "auto",
        // border: "2px solid green",
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box textAlign="center" mb={6}>
          <Typography
            variant="body1"
            sx={{
              maxWidth: 600,
              mx: "auto",
              color: "text.secondary",
              fontSize: "1.4rem",
            }}
          >
            Ready to close the feedback loop? Feedflo is built for that
          </Typography>
        </Box>

        {/* Top 2 Stats Cards */}
        <Grid
          container
          spacing={4}
          justifyContent="center"
          sx={{ maxWidth: 800, mx: "auto", mb: 10 }}
        >
          {[
            {
              label: "Surveys Created",
              value: animatedStats.created,
              desc: "some desription here",
            },
            {
              label: "Submissions",
              value: animatedStats.users,
              desc: "some description here",
            },
          ].map((stat, i) => (
            <Grid item xs={12} md={6} key={i}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  textAlign: "center",
                  borderRadius: 4,
                  transition: "all 0.3s ease",
                  backgroundColor: "#f8fafc",
                  "&:hover": {
                    borderColor: "primary.main",
                    backgroundColor: "#ffffff",
                    boxShadow: 6,
                  },
                  border: "1px solid #dbeafe",
                }}
              >
                <Typography
                  variant="h3"
                  component="div"
                  sx={{
                    fontWeight: "bold",
                    color: "primary.main",
                    mb: 2,
                    fontFamily: "monospace",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {formatNumber(stat.value)}+
                </Typography>
                <Typography variant="h6" fontWeight={600} mb={1}>
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default StatsSection;
