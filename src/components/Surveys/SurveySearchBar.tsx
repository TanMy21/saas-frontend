import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import { FaTag } from "react-icons/fa";

import { useAppTheme } from "../../theme/useAppTheme";
import { SurveySearchBarProps } from "../../utils/types";

const SurveySearchBar = ({
  search,
  matchMode,
  setMatchMode,
  tagOnly,
  setTagOnly,
  setSearch,
}: SurveySearchBarProps) => {
  const { primary, brand, shadows, background, grey } = useAppTheme();

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
        InputLabelProps={{ style: { color: grey[900] } }}
        sx={{
          mb: 1,
          margin: "auto",
          width: "98%",
          height: "96%",
          backgroundColor: background.paper,
          borderRadius: 3,
          border: "1px solid",
          borderColor: grey[300],
          // boxShadow: 1,
          transition: "all 0.2s",
          boxShadow: shadows[10],
          "& .MuiFilledInput-root": {
            height: "100%",
            borderRadius: 3,
            backgroundColor: background.soft1,
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
              <SearchIcon sx={{ color: grey[600], mb: "56%" }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {/* AND/OR Toggle Group */}
              <Box
                sx={{
                  display: "flex",
                  backgroundColor: background.paper,
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
                        matchMode === "AND" ? background.soft4 : "transparent",
                      color: matchMode === "AND" ? primary.dark : primary.main,
                      fontSize: "12px",
                      fontWeight: "bold",
                      "&:hover": {
                        backgroundColor:
                          matchMode === "AND"
                            ? background.soft4
                            : "transparent",
                        color: primary.main,
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
                        matchMode === "OR" ? background.soft4 : "transparent",
                      color: matchMode === "OR" ? primary.dark : primary.main,
                      fontSize: "12px",
                      fontWeight: "bold",
                      "&:hover": {
                        backgroundColor:
                          matchMode === "OR" ? background.soft4 : "transparent",
                        color:  primary.main,
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
                    backgroundColor: tagOnly ? background.soft4 : "transparent",
                    color: tagOnly ? primary.dark : primary.main,
                    "&:hover": {
                      backgroundColor: tagOnly ? background.soft4 : "transparent",
                      color: primary.dark,
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
