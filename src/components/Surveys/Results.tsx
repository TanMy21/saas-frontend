import { useState } from "react";

import { AppBar, Box, Tab, Tabs } from "@mui/material";

import ResultInsights from "./ResultInsights";
import ResultResponses from "./ResultResponses";

const Results = () => {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  let content;

  if (value === 0) {
    content = <ResultInsights />;
  } else if (value === 1) {
    content = <ResultResponses />;
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1%",
          width: "100%",
          height: "100%",
          // border: "2px solid black",
        }}
      >
        <Box sx={{ width: "100%", height: "48px" }}>
          <AppBar
            position="static"
            elevation={0}
            sx={{
              m: "0px",
              bgcolor: "white",
              borderBottom: 1,
              borderColor: "#EDEDED",
              width: "100%",
              height: "48px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                // margin: "auto",
                width: "60%",
                height: "100%",
                // border: "2px solid red",
              }}
            >
              <Tabs
                value={value}
                centered
                onChange={handleChange}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  height: "100%",
                  width: "60%",
                  fontSize: "16px",
                  color: "black",
                  ".MuiTabs-indicator": {
                    height: "2px",
                    backgroundColor: "black",
                  },
                  "& .MuiButtonBase-root": {
                    minHeight: "32px",
                  },
                  "& .MuiTab-root": {
                    textTransform: "capitalize",
                  },
                  // border: "2px solid blue",
                }}
              >
                <Tab
                  label="Insights"
                  value={0}
                  sx={{
                    fontWeight: 600,
                    color: "black",
                    "& .MuiTab-iconWrapper": {
                      color: "black",
                    },
                  }}
                />
                <Tab
                  label="Responses"
                  value={1}
                  sx={{
                    fontWeight: 600,
                    color: "black",
                    "& .MuiTab-iconWrapper": {
                      color: "black",
                    },
                  }}
                />
              </Tabs>
            </Box>
          </AppBar>
        </Box>
        <Box
          sx={{ width: "100%", height: "84vh" /* border: "2px solid red"*/ }}
        >
          {content}
        </Box>
      </Box>
    </>
  );
};

export default Results;
