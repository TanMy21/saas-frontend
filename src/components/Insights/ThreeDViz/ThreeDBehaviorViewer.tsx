/* eslint-disable react/no-unknown-property */
import { useState } from "react";

import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { Maximize2, X } from "lucide-react";

import { ThreeDResultBehaviorViewerProps } from "../../../types/insightTypes";

import { ThreeDBehaviorCanvas } from "./ThreeDBehaviorCanvas";

export function ThreeDBehaviorViewer({
  modelUrl,
  clickedMeshes,
  surfaceClickSamples = [],
  height = 300,
  autoRotate = true,
}: ThreeDResultBehaviorViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!modelUrl) {
    return (
      <Box
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          p: 2,
        }}
      >
        <Typography color="text.secondary" fontSize={14}>
          No 3D model preview available.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          overflow: "hidden",
          bgcolor: "background.paper",
        }}
      >
        {/* Viewer header with expand action */}
        <Box
          sx={{
            height: 42,
            px: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Typography fontSize={13} fontWeight={700}>
            Model interaction view
          </Typography>

          <Tooltip title="Expand viewer">
            <IconButton
              size="small"
              onClick={() => setIsExpanded(true)}
              sx={{
                width: 30,
                height: 30,
              }}
            >
              <Maximize2 size={16} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Normal embedded viewer */}
        <Box sx={{ height }}>
          <ThreeDBehaviorCanvas
            modelUrl={modelUrl}
            clickedMeshes={clickedMeshes}
            surfaceClickSamples={surfaceClickSamples}
            autoRotate={autoRotate}
          />
        </Box>
      </Box>

      {/* Expanded modal viewer */}
      <Dialog
        open={isExpanded}
        onClose={() => setIsExpanded(false)}
        fullWidth
        maxWidth="xl"
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
            height: { xs: "88vh", md: "86vh" },
          },
        }}
      >
        <Box
          sx={{
            height: 52,
            px: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Box>
            <Typography fontSize={15} fontWeight={700}>
              Expanded 3D interaction view
            </Typography>

            <Typography fontSize={12} color="text.secondary">
              Colored regions show interacted model areas. Blue dots show
              surface click points.
            </Typography>
          </Box>

          <Tooltip title="Close">
            <IconButton onClick={() => setIsExpanded(false)}>
              <X size={18} />
            </IconButton>
          </Tooltip>
        </Box>

        <DialogContent
          sx={{
            p: 0,
            height: "100%",
            bgcolor: "#f8fafc",
          }}
        >
          <Box sx={{ height: "calc(86vh - 52px)" }}>
            <ThreeDBehaviorCanvas
              modelUrl={modelUrl}
              clickedMeshes={clickedMeshes}
              surfaceClickSamples={surfaceClickSamples}
              autoRotate={autoRotate}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
