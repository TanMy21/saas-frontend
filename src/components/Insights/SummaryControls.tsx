import { Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { Calendar, Smartphone } from "lucide-react";

import { filterInputSx } from "../../utils/constants";
import {
  DeviceFilter,
  SummaryControlsProps,
  TimeFilter,
} from "../../utils/insightTypes";

import { InsightsFilterDropdown } from "./InsightsFilterDropdown";

export function SummaryControls({ filters, setFilters }: SummaryControlsProps) {
  return (
    <Box
      position="relative"
      top={0}
      zIndex={10}
      bgcolor="transparent"
      px={{ xs: 3, lg: 4 }}
      py={2.5}
    >
      <Box
        maxWidth={960}
        mx="auto"
        display="flex"
        flexWrap="wrap"
        gap={2}
        justifyContent="space-between"
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <InsightsFilterDropdown<TimeFilter>
            label="Time Range"
            value={filters.time}
            onChange={(v) =>
              setFilters((f) => ({
                ...f,
                time: v,
                ...(v !== "custom" ? { from: undefined, to: undefined } : {}),
              }))
            }
            options={[
              { value: "all", label: "All time" },
              { value: "month", label: "Past month" },
              { value: "week", label: "Past week" },
              { value: "custom", label: "Custom range" },
            ]}
            icon={Calendar}
          />

          {filters.time === "custom" && (
            <Box display="flex" gap={4} mt={1}>
              <DatePicker
                value={filters.from ? dayjs(filters.from) : null}
                onChange={(value) =>
                  setFilters((f) => ({
                    ...f,
                    from: value ? value.format("YYYY-MM-DD") : undefined,
                  }))
                }
                slotProps={{
                  textField: {
                    size: "small",
                    placeholder: "From date",
                    sx: {
                      width: 200,
                      ...filterInputSx,
                      "& .MuiInputAdornment-root": {
                        mt: 0.5,
                      },
                    },
                  },
                }}
              />

              <DatePicker
                value={filters.to ? dayjs(filters.to) : null}
                onChange={(value) =>
                  setFilters((f) => ({
                    ...f,
                    to: value ? value.format("YYYY-MM-DD") : undefined,
                  }))
                }
                slotProps={{
                  textField: {
                    size: "small",
                    placeholder: "To date",
                    sx: {
                      width: 200,
                      ...filterInputSx,
                      "& .MuiInputAdornment-root": {
                        mt: 0.5,
                      },
                    },
                  },
                }}
              />
            </Box>
          )}

          <InsightsFilterDropdown<DeviceFilter>
            label="Device"
            value={filters.device}
            onChange={(v) => setFilters((f) => ({ ...f, device: v }))}
            options={[
              { value: "all", label: "All devices" },
              { value: "mobile", label: "Mobile" },
              { value: "desktop", label: "Desktop" },
              { value: "tablet", label: "Tablet" },
            ]}
            icon={Smartphone}
          />
        </Box>
      </Box>
    </Box>
  );
}
