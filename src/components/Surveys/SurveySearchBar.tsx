import { useRef, useState } from "react";

import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { Box, IconButton, InputBase } from "@mui/material";

import { SurveySearchBarProps } from "../../utils/types";

const SurveySearchBar = ({ search, setSearch }: SurveySearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    setSearch("");
    inputRef.current?.focus();
  };

  return (
    <>
      <Box position="relative">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: 2,
            border: "1px solid",
            borderColor: isFocused ? "purple.500" : "grey.200",
            boxShadow: 1,
            transition: "all 0.2s",
            ...(isFocused && {
              boxShadow: "0 0 0 2px rgba(124, 58, 237, 0.2)",
            }),
          }}
        >
          <Box
            sx={{
              pl: 1.5,
              color: "grey.500",
              display: "flex",
              alignItems: "center",
            }}
          >
            <SearchIcon sx={{ fontSize: "20px" }} />
          </Box>
          <InputBase
            inputRef={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search surveys..."
            sx={{
              flex: 1,
              px: 1.5,
              py: 1,
              color: "text.primary",
              "&::placeholder": {
                color: "grey.400",
              },
            }}
          />
          {search && (
            <IconButton
              onClick={handleClear}
              size="small"
              sx={{
                pr: 1.5,
                color: "grey.400",
                "&:hover": {
                  color: "grey.600",
                },
                transition: "color 0.2s",
              }}
            >
              <ClearIcon sx={{ fontSize: "20px" }} />
            </IconButton>
          )}
        </Box>
      </Box>
    </>
  );
};

export default SurveySearchBar;
