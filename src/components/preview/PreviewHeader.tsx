import {
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";

import {
  AppBar,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { Monitor, Smartphone } from "lucide-react";

export type PreviewViewport = "desktop" | "mobile";

type PreviewHeaderProps = {
  viewport: PreviewViewport;
  surveyTitle?: string;
  onViewportChange: (viewport: PreviewViewport) => void;
};

const PreviewHeader = ({
  viewport,
  surveyTitle,
  onViewportChange,
}: PreviewHeaderProps) => {
  const titleRef = useRef<HTMLElement | null>(null);
  const [isTitleTruncated, setIsTitleTruncated] = useState(false);
  const previewTitle = surveyTitle ? `${surveyTitle} preview` : "Survey preview";

  useLayoutEffect(() => {
    const titleElement = titleRef.current;
    if (!titleElement) return;

    const updateTruncation = () => {
      setIsTitleTruncated(
        titleElement.scrollWidth > titleElement.clientWidth,
      );
    };

    updateTruncation();

    const resizeObserver = new ResizeObserver(updateTruncation);
    resizeObserver.observe(titleElement);

    return () => resizeObserver.disconnect();
  }, [previewTitle]);

  const handleChange = (
    _event: MouseEvent<HTMLElement>,
    nextViewport: PreviewViewport | null,
  ) => {
    if (nextViewport) onViewportChange(nextViewport);
  };

  return (
    <AppBar
      component="header"
      position="static"
      elevation={0}
      sx={{
        height: 64,
        justifyContent: "center",
        color: "#111827",
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E5E7EB",
      }}
    >
      <Toolbar
        sx={{
          position: "relative",
          minHeight: "64px !important",
          px: { xs: 2, sm: 3 },
        }}
      >
        <Box component="div" sx={{ minWidth: 0 }}>
          <Tooltip
            title={isTitleTruncated ? previewTitle : ""}
            placement="bottom-start"
            arrow
          >
            <Typography
              ref={titleRef}
              sx={{
                maxWidth: { xs: 180, sm: 340 },
                overflow: "hidden",
                fontSize: 15,
                fontWeight: 700,
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {previewTitle}
            </Typography>
          </Tooltip>
        </Box>

        <ToggleButtonGroup
          exclusive
          value={viewport}
          onChange={handleChange}
          aria-label="Preview device"
          size="small"
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            p: 0.5,
            gap: 0.5,
            borderRadius: 999,
            backgroundColor: "#F1F3F7",
            "& .MuiToggleButtonGroup-grouped": {
              m: 0,
              px: 1.75,
              py: 0.65,
              gap: 0.75,
              border: 0,
              borderRadius: "999px !important",
              color: "#667085",
              fontSize: 13,
              fontWeight: 600,
              textTransform: "none",
              "&.Mui-selected": {
                color: "#111827",
                backgroundColor: "#FFFFFF",
                boxShadow: "0 1px 4px rgba(16, 24, 40, 0.12)",
              },
              "&.Mui-selected:hover": {
                backgroundColor: "#FFFFFF",
              },
            },
          }}
        >
          <ToggleButton value="desktop" aria-label="Desktop preview">
            <Monitor size={16} />
            Desktop
          </ToggleButton>
          <ToggleButton value="mobile" aria-label="Mobile preview">
            <Smartphone size={16} />
            Mobile
          </ToggleButton>
        </ToggleButtonGroup>
      </Toolbar>
    </AppBar>
  );
};

export default PreviewHeader;
