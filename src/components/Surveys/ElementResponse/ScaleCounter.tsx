import { useState } from "react";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Box, IconButton, Typography } from "@mui/material";
import { AnimatePresence, motion } from "motion/react";

import { RootState } from "../../../app/store";
import { useAppSelector } from "../../../app/typedReduxHooks";

const ScaleCounter = () => {
  const question = useAppSelector(
    (state: RootState) => state.question.selectedQuestion
  );

  const { questionID, questionPreferences } = question || {};

  const minValue = questionPreferences?.uiConfig?.minValue ?? 1;
  const maxValue = questionPreferences?.uiConfig?.maxValue ?? 5;

  const [count, setCount] = useState<number>(minValue);

  const [direction, setDirection] = useState(1);

  const increment = () => {
    if (count < maxValue) {
      setDirection(1);
      setCount(count + 1);
    }
  };

  const decrement = () => {
    if (count > minValue) {
      setDirection(-1);
      setCount(count - 1);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      y: direction > 0 ? 15 : -15,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      y: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      y: direction < 0 ? 15 : -15,
      opacity: 0,
    }),
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 4,
        fontFamily: "sans-serif",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        }}
      >
        <IconButton
          onClick={decrement}
          disabled={count === minValue}
          aria-label="Decrement"
          size="large"
        >
          <ArrowBackIosIcon fontSize="inherit" />
        </IconButton>

        <Box
          sx={{
            width: 80,
            height: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={count}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                y: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              style={{ position: "absolute" }}
            >
              <Typography
                variant="h2"
                component="div"
                sx={{ fontWeight: "bold" }}
              >
                {count}
              </Typography>
            </motion.div>
          </AnimatePresence>
        </Box>

        <IconButton
          onClick={increment}
          disabled={count === maxValue}
          aria-label="Increment"
          size="large"
        >
          <ArrowForwardIosIcon fontSize="inherit" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ScaleCounter;
