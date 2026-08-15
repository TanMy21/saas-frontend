import { Box, Typography } from "@mui/material";
import { AnimatePresence } from "motion/react";

import uploadAnimation from "../../assets/upload.svg";

const UploadImageAnimation = () => {
  return (
    <AnimatePresence>
      <Box
        component="div"
        sx={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Box
          component="div"
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.90)",
            borderRadius: 2,
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            px: 3,
            py: 2.5,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            maxWidth: 240,
            width: "min(92vw, 240px)",
          }}
        >
          {/* Animated icon square */}
          <Box
            component="div"
            sx={{
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: { xs: "32vmin", sm: "24vmin", md: "18vmin" },
              aspectRatio: "1 / 1",
              minWidth: 140,
              maxWidth: 200,
              borderRadius: 2,
            }}
          >
            <Box
              component="img"
              src={uploadAnimation}
              alt="Uploading image"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </Box>

          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{ color: "#374151" }}
          >
            Uploading your image...
          </Typography>
        </Box>
      </Box>
    </AnimatePresence>
  );
};

export default UploadImageAnimation;
