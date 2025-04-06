import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import { FaTag } from "react-icons/fa";

import { SurveySearchBarProps } from "../../utils/types";

const SurveySearchBar = ({
  search,
  matchMode,
  setMatchMode,
  tagOnly,
  setTagOnly,
  setSearch,
}: SurveySearchBarProps) => {
  // const inputRef = useRef<HTMLInputElement>(null);

  // const handleClear = () => {
  //   setSearch("");
  //   inputRef.current?.focus();
  // };

  return (
    <>
      <TextField
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={
          tagOnly
            ? matchMode === "OR"
              ? "Search surveys by tag(s) only..."
              : "Search surveys by all matching tag(s)..."
            : matchMode === "OR"
              ? "Search surveys by title or tag(s)..."
              : "Search surveys by title and tag(s)..."
        }
        variant="filled"
        InputLabelProps={{ style: { color: "gray" } }}
        sx={{
          mb: 1,
          margin: "auto",
          width: "98%",
          height: "96%",
          backgroundColor: "white",
          borderRadius: 3,
          border: "1px solid",
          borderColor: "grey.200",
          // boxShadow: 1,
          transition: "all 0.2s",
          boxShadow: "0 0 0 2px rgba(124, 58, 237, 0.2)",
          "& .MuiFilledInput-root": {
            height: "100%",
            borderRadius: 3,
            backgroundColor: "#F8F9FF",
            borderBottom: "none !important",
            alignItems: "center",
            paddingTop: "0px",
            paddingBottom: "0px",
            "& input": {
              padding: "12px 0px",
            },
            "&:before, &:after": {
              display: "none",
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "grey.600", mb: "56%" }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {/* AND/OR Toggle Group */}
              <Box
                sx={{
                  display: "flex",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  height: "24px",
                  padding: "4px",
                  boxShadow: 1,

                  border: "1px solid #E6E8EC",
                  mr: 1,
                }}
              >
                <Tooltip title="Match Any (AND)">
                  <IconButton
                    onClick={() => setMatchMode("AND")}
                    sx={{
                      padding: "6px",
                      borderRadius: "6px",
                      backgroundColor:
                        matchMode === "AND" ? "#EDE9FE" : "transparent",
                      color: matchMode === "AND" ? "#7C39ED" : "#777E8B",
                      fontSize: "12px",
                      fontWeight: "bold",
                      "&:hover": {
                        backgroundColor:
                          matchMode === "AND" ? "#EDE9FE" : "transparent",
                        color: "#7B39ED",
                      },
                    }}
                  >
                    AND
                  </IconButton>
                </Tooltip>
                <Tooltip title="Match All (OR)">
                  <IconButton
                    onClick={() => setMatchMode("OR")}
                    sx={{
                      padding: "6px",
                      borderRadius: "6px",
                      backgroundColor:
                        matchMode === "OR" ? "#EDE9FE" : "transparent",
                      color: matchMode === "OR" ? "#7C39ED" : "#777E8B",
                      fontSize: "12px",
                      fontWeight: "bold",
                      "&:hover": {
                        backgroundColor:
                          matchMode === "OR" ? "#EDE9FE" : "transparent",
                        color: "#7B39ED",
                      },
                    }}
                  >
                    OR
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Tag-only toggle */}
              <Tooltip
                title={tagOnly ? "Tag-only search" : "Title + Tag search"}
              >
                <IconButton
                  onClick={() => setTagOnly((prev) => !prev)}
                  sx={{
                    padding: "6px",
                    borderRadius: "6px",
                    backgroundColor: tagOnly ? "#EDE9FE" : "transparent",
                    color: tagOnly ? "#7C39ED" : "#777E8B",
                    "&:hover": {
                      backgroundColor: tagOnly ? "#EDE9FE" : "transparent",
                      color: "#7B39ED",
                    },
                  }}
                >
                  <FaTag size={18} />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />
    </>
  );
};

export default SurveySearchBar;
