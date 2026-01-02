import { useState } from "react";

import {
  Box,
  Button,
  InputBase,
  Menu,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Calendar, ChevronDown, Filter, Download, Search } from "lucide-react";

import { SummaryControlsProps } from "../../utils/insightTypes";

export function SummaryControls({
  displayMode,
  onDisplayModeChange,
  onFilterClick,
  searchQuery,
  onSearchChange,
}: SummaryControlsProps) {
  const [dateFilter, setDateFilter] = useState("all");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <Box
      position="sticky"
      top={0}
      zIndex={10}
      borderBottom={1}
      borderColor="divider"
      bgcolor="background.paper"
      sx={{ backdropFilter: "blur(8px)" }}
      px={{ xs: 3, lg: 4 }}
      py={2}
    >
      <Box
        maxWidth={960}
        mx="auto"
        display="flex"
        flexWrap="wrap"
        gap={2}
        justifyContent="space-between"
      >
        {/* Left */}
        <Box display="flex" gap={2} alignItems="center">
          <ToggleButtonGroup
            exclusive
            size="small"
            value={displayMode}
            onChange={(_, v) => v && onDisplayModeChange(v)}
          >
            <ToggleButton value="count">#</ToggleButton>
            <ToggleButton value="percentage">%</ToggleButton>
          </ToggleButtonGroup>

          <Button
            variant="outlined"
            size="small"
            startIcon={<Calendar size={16} />}
            endIcon={<ChevronDown size={14} />}
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            {dateFilter === "all"
              ? "All time"
              : dateFilter === "month"
                ? "Past month"
                : "Custom"}
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => setDateFilter("all")}>All time</MenuItem>
            <MenuItem onClick={() => setDateFilter("month")}>
              Past month
            </MenuItem>
            <MenuItem onClick={() => setDateFilter("custom")}>
              Custom range…
            </MenuItem>
          </Menu>

          <Button
            variant="outlined"
            size="small"
            startIcon={<Filter size={16} />}
            onClick={onFilterClick}
          >
            Filters
          </Button>
        </Box>

        {/* Right */}
        <Box display="flex" gap={2} alignItems="center">
          <Box
            display="flex"
            alignItems="center"
            border={1}
            borderColor="divider"
            borderRadius={1}
            px={1}
          >
            <Search size={16} />
            <InputBase
              placeholder="Search responses…"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              sx={{ ml: 1 }}
            />
          </Box>

          <Button
            variant="outlined"
            size="small"
            startIcon={<Download size={16} />}
          >
            Export
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
