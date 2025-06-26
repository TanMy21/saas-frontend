import { type ReactNode, useMemo, useState } from "react";

import { Box, Slider } from "@mui/material";

import { RootState } from "../../../app/store";
import { useAppSelector } from "../../../app/typedReduxHooks";
import { Mark, StaticSliderConfig } from "../../../utils/types";

import { CustomTrackContainer } from "./CustomTrackContainer";

const STATIC_CONFIG: StaticSliderConfig = {
  tick: {
    minSize: 8,
    increment: 2,
  },
  segment: {
    minThickness: 4,
    increment: 2,
  },
  gap: 8,
};

const generateMarks = (minValue: number, maxValue: number): Mark[] => {
  const marks: Mark[] = [];
  for (let i = minValue; i <= maxValue; i++) {
    marks.push({
      value: i,
      label: `${i}`,
    });
  }
  return marks;
};

const valueToPercent = (value: number, min: number, max: number): number => {
  if (max === min) {
    return 0;
  }
  return ((value - min) * 100) / (max - min);
};

const getTickSize = (index: number): number =>
  STATIC_CONFIG.tick.minSize + index * STATIC_CONFIG.tick.increment;

const getSegmentThickness = (index: number): number =>
  STATIC_CONFIG.segment.minThickness + index * STATIC_CONFIG.segment.increment;

const getSegmentBackground = (
  index: number,
  currentValue: number,
  totalSegments: number,
  marks: Mark[]
): string => {
  const progress = index / totalSegments;
  const isActive = marks[index].value < currentValue;

  if (!isActive) {
    return "#F0F4F8";
  }

  if (progress <= 0.25) {
    return "linear-gradient(to right, #D2DEFF, #6596FE)";
  } else if (progress <= 0.5) {
    return "#6596FE";
  } else if (progress <= 0.75) {
    return "linear-gradient(to right, #6596FE, #3777FE)";
  } else {
    return "linear-gradient(to right, #3777FE, #1E3A8A)";
  }
};

const ProgressiveSlider = () => {
  const question = useAppSelector(
    (state: RootState) => state.question.selectedQuestion
  );

  const { questionID, questionPreferences } = question || {};

  const { minValue, maxValue } = questionPreferences?.uiConfig || {
    minValue: 1,
    maxValue: 5,
  };

  const marks = useMemo(
    () => generateMarks(minValue ?? 1, maxValue ?? 5),
    [minValue, maxValue]
  );

  const min = minValue ?? 1;
  const max = maxValue ?? 5;

  const [value, setValue] = useState<number>(Math.ceil((min + max) / 2));

  const handleSliderChange = (
    event: Event,
    newValue: number | number[]
  ): void => {
    setValue(newValue as number);
  };

  const sliderElements = useMemo(() => {
    const segments: ReactNode[] = [];
    const visibleTicks: ReactNode[] = [];
    const labels: ReactNode[] = [];

    marks.forEach((mark: Mark, i: number) => {
      const percent = valueToPercent(mark.value, min, max);
      const tickSize = getTickSize(i);

      visibleTicks.push(
        <Box
          key={`tick-${mark.value}`}
          sx={{
            position: "absolute",
            left: `${percent}%`,
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: tickSize,
            height: tickSize,
            borderRadius: "50%",
            backgroundColor: mark.value <= value ? "#3777FE" : "#F0F4F8",
            boxShadow: value === mark.value ? `0 0 0 4px #D2DEFF` : "none",
            transition: "background-color 0.2s ease, box-shadow 0.2s ease",
          }}
        />
      );

      labels.push(
        <Box
          key={`label-${mark.value}`}
          sx={{
            position: "absolute",
            left: `${percent}%`,
            transform: "translateX(-50%)",
            textAlign: "center",
            fontSize: "0.8rem",
            whiteSpace: "nowrap",
            fontWeight: value === mark.value ? "bold" : "normal",
            color: value === mark.value ? "primary.main" : "text.secondary",
            transition: "font-weight 0.2s, color 0.2s",
          }}
        >
          {mark.label}
        </Box>
      );

      if (i < marks.length - 1) {
        const nextTickSize = getTickSize(i + 1);
        const segmentThickness = getSegmentThickness(i);
        const startPercent = valueToPercent(mark.value, min, max);
        const endPercent = valueToPercent(marks[i + 1].value, min, max);

        segments.push(
          <Box
            key={`segment-${i}`}
            sx={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              height: segmentThickness,
              background: getSegmentBackground(
                i,
                value,
                marks.length - 1,
                marks
              ),
              borderRadius: `${segmentThickness / 2}px`,
              left: `calc(${startPercent}% + ${tickSize / 2}px + ${STATIC_CONFIG.gap}px)`,
              width: `calc(${endPercent - startPercent}% - ${tickSize / 2}px - ${nextTickSize / 2}px - ${STATIC_CONFIG.gap * 2}px)`,
            }}
          />
        );
      }
    });

    return { segments, visibleTicks, labels };
  }, [value, min, max, marks]);

  return (
    <Box sx={{ width: "100%", py: 4, px: 2 }}>
      <Box sx={{ position: "relative", height: "40px", mb: 3 }}>
        <CustomTrackContainer>
          {sliderElements.segments}
          {sliderElements.visibleTicks}
        </CustomTrackContainer>

        <Slider
          aria-label="Progressive Slider"
          value={value}
          min={min}
          max={max}
          step={1}
          marks={marks}
          onChange={handleSliderChange}
          sx={{
            position: "relative",
            zIndex: 1,
            "& .MuiSlider-track, & .MuiSlider-rail, & .MuiSlider-mark, & .MuiSlider-markLabel":
              {
                display: "none",
              },
            "& .MuiSlider-thumb": {
              height: 0,
              width: 0,
              "&:hover, &.Mui-focusVisible, &.Mui-active": {
                boxShadow: "none",
              },
            },
          }}
        />

        <Box sx={{ position: "relative", height: "20px" }}>
          {sliderElements.labels}
        </Box>
      </Box>
    </Box>
  );
};

export default ProgressiveSlider;
