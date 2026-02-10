import { useEffect, useState } from "react";

import { Box, Typography } from "@mui/material";

import { BinaryChartProps } from "../../../utils/insightTypes";

export const BinaryChart = ({ question }: BinaryChartProps) => {
  const [animate, setAnimate] = useState(false);

  const { result } = question;

  // animation on mount/change
  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 80);
    return () => clearTimeout(t);
  }, [result?.left?.count, result?.right?.count]);

  const total = result?.left?.count + result?.right?.count || 0;

  const yesPercent = total > 0 ? (result?.left?.count / total) * 100 : 0;
  const noPercent = total > 0 ? (result?.right?.count / total) * 100 : 0;

  // Singular or plural
  const responseLabel = (count: number) =>
    count === 1 ? "response" : "responses";

  // Edge-case: 100% domination
  const yesWidth = yesPercent === 100 ? "100%" : `${yesPercent}%`;
  const noWidth = noPercent === 100 ? "100%" : `${noPercent}%`;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 720,
        padding: 3,
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
        // border:"2px solid black",
      }}
    >
      <Box
        sx={{
          display: "flex",
          height: 88,
          borderRadius: 999,
          overflow: "hidden",
          bgcolor: "grey.100",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}
      >
        {/* YES */}
        <Box
          sx={{
            width: animate ? yesWidth : "50%",
            transition: "width 0.9s cubic-bezier(0.2,0.8,0.2,1)",
            bgcolor: "primary.main",
            color: "primary.contrastText",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {yesPercent >= 15 && (
            <Typography fontSize={22} fontWeight={700}>
              {yesPercent.toFixed(1)}%
            </Typography>
          )}
        </Box>

        {/* NO */}
        <Box
          sx={{
            width: animate ? noWidth : "50%",
            transition: "width 0.9s cubic-bezier(0.2,0.8,0.2,1)",
            bgcolor: "error.light",
            color: "error.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {noPercent >= 15 && (
            <Typography fontSize={22} fontWeight={700}>
              {noPercent.toFixed(1)}%
            </Typography>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          px: 1,
        }}
      >
        {/* Yes legend */}
        <Box>
          <Typography fontSize={14} fontWeight={600}>
            {result?.left?.label || "Yes"}
          </Typography>
          <Typography fontSize={12} color="text.secondary">
            {result?.left?.count.toLocaleString()}{" "}
            {responseLabel(result?.left?.count)} ({Math.round(yesPercent)}%)
          </Typography>
        </Box>

        {/* No legend */}
        <Box textAlign="right">
          <Typography fontSize={14} fontWeight={600}>
            {result?.right?.label || "No"}
          </Typography>
          <Typography fontSize={12} color="text.secondary">
            {result?.right?.count.toLocaleString()}{" "}
            {responseLabel(result?.right?.count)} ({Math.round(noPercent)}%)
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
