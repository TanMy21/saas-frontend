import { Box, Typography } from "@mui/material";
import { ArrowUp, CloudUpload, Image } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

const UploadImageAnimation = () => {
  return (
    <AnimatePresence>
      <Box
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
          sx={{
            bgcolor: "#ffffff",
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
            sx={{
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: { xs: "22vmin", sm: "16vmin", md: "12vmin" },
              aspectRatio: "1 / 1",
              minWidth: 84,
              maxWidth: 120,
              borderRadius: 2,
            }}
          >
            <CloudUpload
              size={48}
              style={{
                color: "#6b7280",
                position: "absolute",
                top: 8,
                opacity: 0.5,
              }}
            />

            <motion.div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "absolute",
              }}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: -50, opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowUp size={24} style={{ color: "#3b82f6" }} />
              <Image size={32} style={{ color: "#3b82f6", marginTop: 4 }} />
            </motion.div>
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
