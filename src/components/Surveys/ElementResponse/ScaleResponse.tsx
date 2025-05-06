import React, { useLayoutEffect, useRef, useState } from "react";

import { Box } from "@mui/material";

const ScaleResponse = () => {
  const [value, setValue] = useState(0);
  const containerRef = useRef(null);
  const tickRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [positions, setPositions] = useState<number[]>([]);

  const minValue = 1;
  const maxValue = 9;
  const ticks = Array.from(
    { length: maxValue - minValue + 1 },
    (_, i) => minValue + i
  );
  const tickSizes = Array.from({ length: ticks.length }, (_, i) => {
    const minSize = 8;
    const maxSize = 24;
    const progress = ticks.length === 1 ? 0 : i / (ticks.length - 1);
    const easedProgress =
      progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;
    return minSize + (maxSize - minSize) * easedProgress;
  });
  const gapSize = 8;
  const paddingSize = 16 * 2;

  const totalTickWidth = tickSizes.reduce((sum, size) => sum + size, 0);
  const totalGapWidth = gapSize * 2 * (ticks.length - 1);
  const targetSegmentWidth = 56;
  const initialTotalSegmentsWidth = targetSegmentWidth * (ticks.length - 1);

  const containerWidth =
    totalTickWidth +
    totalGapWidth +
    initialTotalSegmentsWidth +
    paddingSize +
    gapSize * 2;
  const segmentWidth =
    (containerWidth - totalTickWidth - totalGapWidth - paddingSize) /
    (ticks.length - 1);

  const getSegmentColor = (
    index: number,
    totalSegments: number,
    value: number
  ) => {
    const progress = index / totalSegments;

    if (progress <= 0.25) {
      return index < value
        ? "linear-gradient(to right, #D2DEFF, #6596FE)"
        : "#F0F4F8";
    } else if (progress <= 0.5) {
      return index < value ? "#6596FE" : "#F0F4F8";
    } else if (progress <= 0.75) {
      return index < value
        ? "linear-gradient(to right, #6596FE, #3777FE)"
        : "#F0F4F8";
    } else if (progress < 1) {
      return index < value
        ? "linear-gradient(to right, #3777FE, #1E3A8A)"
        : "#F0F4F8";
    } else {
      return "#F0F4F8";
    }
  };

  useLayoutEffect(() => {
    const newPositions = tickRefs.current.map((ref) =>
      ref ? ref.offsetLeft + ref.offsetWidth / 2 : 0
    );
    setPositions(newPositions);
  }, []);

  return (
    <Box
      ref={containerRef}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: `${containerWidth}px`,
        maxWidth: "100%",
        height: "100px",
        paddingX: 4,
        margin: "auto",
        mt: "20%",
        bgcolor: "#fff",
        border: "2px solid #E0E0E0",
        borderRadius: "50px",
        boxShadow: "0px 2px 10px rgba(0,0,0,0.05)",
        position: "relative",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
        <Box sx={{ width: `${gapSize}px`, flexShrink: 0 }} />
        {ticks.map((tick, arrayIndex) => (
          <React.Fragment key={arrayIndex}>
            <Box
              ref={(el) =>
                (tickRefs.current[arrayIndex] = el as HTMLDivElement)
              }
              sx={{
                height: `${tickSizes[arrayIndex]}px`,
                width: `${tickSizes[arrayIndex]}px`,
                aspectRatio: "1 / 1",
                flexShrink: 0,
                flexGrow: 0,
                borderRadius: "50%",
                background: arrayIndex <= value ? "#0E6CEB" : "#E5E7EB",
                transition: "all 0.3s ease, transform 0.3s ease",
                zIndex: 2,
              }}
            />
            {arrayIndex < ticks.length - 1 && (
              <Box
                sx={{
                  width: `${segmentWidth}px`,
                  flexShrink: 0,
                  flexGrow: 0,
                  marginLeft: `${gapSize}px`,
                  marginRight: `${gapSize}px`,
                  height: `${4 + arrayIndex * 1.5}px`,
                  background: getSegmentColor(
                    arrayIndex,
                    ticks.length - 1,
                    value
                  ),
                  borderRadius: 6,
                  transition: "all 0.3s ease",
                  zIndex: 2,
                }}
              />
            )}
          </React.Fragment>
        ))}
        <Box sx={{ width: `${gapSize}px`, flexShrink: 0 }} />
      </Box>

      {positions.length === ticks.length && (
        <>
          <input
            type="range"
            min={0}
            max={ticks.length - 1}
            step={1}
            value={value}
            onChange={(e) => {
              const newValue = parseInt(e.target.value);
              setValue(newValue);
              console.log("Selected value:", newValue);
            }}
            style={{
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              width: "100%",
              opacity: 0,
              zIndex: 3,
              height: "100px",
              cursor: "pointer",
            }}
          />

          {/* Thumb and Tooltip */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: `${positions[value] - 14}px`,
              transform: "translateY(-50%)",
              zIndex: 10,
              pointerEvents: "none",
              transition: "left 0.3s ease",
            }}
          >
            <Box
              sx={{
                height: window.innerWidth < 600 ? 24 : 28,
                width: window.innerWidth < 600 ? 24 : 28,
                backgroundColor: "#E0F2FE",
                border: "2px solid #0E6CEB",
                borderRadius: "50%",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
                transition: "transform 0.2s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            />
          </Box>

          {/* Labels below ticks */}
          <Box
            sx={{
              position: "absolute",
              bottom: 8,
              left: 0,
              right: 0,
              height: "20px",
              pointerEvents: "none",
            }}
          >
            {positions.map((pos, index) => (
              <Box
                key={index}
                sx={{
                  position: "absolute",
                  left: `${pos - 8}px`,
                  textAlign: "center",
                  width: "16px",
                  fontSize: index === value ? 16 : 12,
                  transition: "color 0.3s ease, font-weight 0.3s ease",
                  fontWeight: index === value ? "bold" : "normal",
                  color: index === value ? "#0E6CEB" : "#6B7280",
                }}
              >
                {index}
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default ScaleResponse;
