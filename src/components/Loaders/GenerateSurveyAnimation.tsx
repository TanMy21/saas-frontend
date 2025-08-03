import { Box } from "@mui/material";
import { motion } from "motion/react";

const PRIMARY_COLOR = "#32B8FF";
const SECONDARY_COLOR = "#6C5CE7";
const GLOW_COLOR = "#6C5CE7";

const GenerateSurveyAnimation = () => {
  const layers = Array.from({ length: 6 }, (_, i) => i);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 128,
        height: 128,
      }}
    >
      <Box sx={{ position: "relative", width: 96, height: 96 }}>
        {layers.map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              border: "2px solid",
              borderColor: i % 2 === 0 ? PRIMARY_COLOR : SECONDARY_COLOR,
              borderRadius: "50%",
              transform: `scale(${1 - i * 0.15})`,
              boxSizing: "border-box",
            }}
            initial={{
              opacity: 0,
              rotateX: 0,
              rotateY: 0,
            }}
            animate={{
              opacity: [0, 0.7, 0],
              rotateX: [0, 180, 360],
              rotateY: [0, 360, 720],
              filter: [
                `drop-shadow(0 0 5px ${i % 2 === 0 ? PRIMARY_COLOR : SECONDARY_COLOR})`,
                `drop-shadow(0 0 15px ${i % 2 === 0 ? PRIMARY_COLOR : SECONDARY_COLOR})`,
                `drop-shadow(0 0 5px ${i % 2 === 0 ? PRIMARY_COLOR : SECONDARY_COLOR})`,
              ],
            }}
            transition={{
              duration: 3,
              delay: i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Central hologram core */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          animate={{
            rotateZ: [0, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <motion.div
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: GLOW_COLOR,
              boxShadow: "0 0 10px " + GLOW_COLOR,
            }}
            animate={{
              scale: [0.5, 1.5, 0.5],
              boxShadow: [
                `0 0 10px ${GLOW_COLOR}`,
                `0 0 30px ${GLOW_COLOR}`,
                `0 0 10px ${GLOW_COLOR}`,
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </Box>
    </Box>
  );
};

export default GenerateSurveyAnimation;
