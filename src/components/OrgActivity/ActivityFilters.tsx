import { useId } from "react";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import { RotateCcw, Search } from "lucide-react";

type FilterField = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

type ActivityFiltersProps = {
  searchLabel: string;
  searchPlaceholder: string;
  search: string;
  onSearchChange: (value: string) => void;
  fields?: FilterField[];
  onClear: () => void;
};

function ActivityFilterField({
  label,
  placeholder,
  value,
  onChange,
  isSearch = false,
}: FilterField & { isSearch?: boolean }) {
  const inputId = useId();

  return (
    <FormControl fullWidth sx={{ minWidth: 0 }}>
      <FormLabel
        htmlFor={inputId}
        sx={{
          mb: 0.875,
          fontSize: "0.75rem",
          fontWeight: 600,
          lineHeight: 1.5,
          color: "#475569",
          "&.Mui-focused": { color: "primary.dark" },
        }}
      >
        {label}
      </FormLabel>
      <OutlinedInput
        id={inputId}
        size="small"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        startAdornment={
          isSearch ? (
            <InputAdornment position="start" sx={{ color: "#64748B" }}>
              <Search size={18} aria-hidden="true" />
            </InputAdornment>
          ) : undefined
        }
        sx={{
          height: 46,
          borderRadius: 1.5,
          bgcolor: "rgba(255,255,255,0.9)",
          fontSize: "0.875rem",
          color: "#334155",
          transition: "background-color 180ms ease, box-shadow 180ms ease",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(148,163,184,0.3)",
            transition: "border-color 180ms ease",
          },
          "&:hover": {
            bgcolor: "#fff",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(0,116,235,0.45)",
            },
          },
          "&.Mui-focused": {
            bgcolor: "#fff",
            boxShadow: "0 0 0 3px rgba(0,116,235,0.1)",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "primary.main",
              borderWidth: 1,
            },
          },
          "& input": { minWidth: 0, py: 1.25 },
          "& input::placeholder": { color: "#8492A6", opacity: 1 },
        }}
      />
    </FormControl>
  );
}

export default function ActivityFilters({
  searchLabel,
  searchPlaceholder,
  search,
  onSearchChange,
  fields = [],
  onClear,
}: ActivityFiltersProps) {
  const compact = fields.length === 1;
  const hasFields = fields.length > 0;

  return (
    <Box
      component="div"
      sx={{
        minWidth: 0,
        containerType: "inline-size",
        containerName: "activity-filters",
      }}
    >
      <Box
        component="div"
        role="search"
        aria-label={`${searchLabel} filters`}
        sx={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr)",
          gridTemplateAreas: hasFields
            ? '"search" "filters" "clear"'
            : '"search" "clear"',
          alignItems: "end",
          gap: 2,
          p: 2,
          border: "1px solid rgba(148,163,184,0.2)",
          borderRadius: 2.5,
          background: "linear-gradient(135deg, #F8FAFC 0%, #F3F7FD 100%)",
          "@container activity-filters (min-width: 560px)": {
            gridTemplateColumns: compact
              ? "minmax(0, 1fr) minmax(150px, 0.5fr) auto"
              : "minmax(0, 1fr) auto",
            gridTemplateAreas: compact
              ? '"search filters clear"'
              : hasFields
                ? '"search clear" "filters filters"'
                : '"search clear"',
          },
        }}
      >
        <Box component="div" sx={{ gridArea: "search", minWidth: 0 }}>
          <ActivityFilterField
            label={searchLabel}
            placeholder={searchPlaceholder}
            value={search}
            onChange={onSearchChange}
            isSearch
          />
        </Box>

        {hasFields && (
          <Box
            component="div"
            sx={{
              gridArea: "filters",
              minWidth: 0,
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr)",
              gap: 2,
              "@container activity-filters (min-width: 400px)": {
                gridTemplateColumns: compact
                  ? "minmax(0, 1fr)"
                  : "repeat(2, minmax(0, 1fr))",
              },
              "@container activity-filters (min-width: 760px)": {
                gridTemplateColumns: compact
                  ? "minmax(0, 1fr)"
                  : "repeat(4, minmax(0, 1fr))",
              },
            }}
          >
            {fields.map((field) => (
              <ActivityFilterField key={field.label} {...field} />
            ))}
          </Box>
        )}

        <Button
          type="button"
          onClick={onClear}
          startIcon={<RotateCcw size={16} aria-hidden="true" />}
          disableElevation
          disableRipple
          sx={{
            gridArea: "clear",
            height: 46,
            px: 2,
            borderRadius: 1.5,
            border: "1px solid rgba(0,116,235,0.08)",
            color: "primary.dark",
            bgcolor: "rgba(0,116,235,0.07)",
            fontSize: "0.8125rem",
            fontWeight: 600,
            whiteSpace: "nowrap",
            transition: "background-color 180ms ease, border-color 180ms ease",
            "&:hover": {
              bgcolor: "rgba(0,116,235,0.12)",
              borderColor: "rgba(0,116,235,0.2)",
            },
            "&.Mui-focusVisible": {
              outline: "2px solid",
              outlineColor: "primary.main",
              outlineOffset: 3,
            },
          }}
        >
          Clear filters
        </Button>
      </Box>
    </Box>
  );
}
