import { Box, Button, TextField, Typography } from "@mui/material";

import { IOSSwitch } from "./Switch";

const CustomizeElement = () => {
  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "98%",
            minHeight: "100px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              marginRight: "auto",
              marginLeft: "auto",
              width: "92%",
              minHeight: "200px",
            }}
          >
            <Box mt={1}>
              <Typography
                sx={{ fontSize: "16px", color: "black", fontWeight: "bold" }}
              >
                Settings
              </Typography>
            </Box>
            <Box
              mt={1}
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography>Required</Typography>
              </Box>
              <Box>
                <IOSSwitch sx={{ m: 1 }} />
              </Box>
            </Box>
            <Box
              mt={1}
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography>Button</Typography>
                </Box>
                <Box>
                  <IOSSwitch sx={{ m: 1 }} />
                </Box>
              </Box>
              <Box mt={1}>
                <TextField
                  sx={{
                    width: "96%",
                    "& .MuiOutlinedInput-root": {
                      height: 40, // Adjusts the height of the TextField container
                      "& input": {
                        height: "100%",
                        padding: "0 14px", // Adjusts padding to keep text vertically centered
                      },
                      "& fieldset": {
                        borderWidth: 1, // Optional: Adjust border width if necessary
                      },
                    },
                    "& .MuiInputLabel-root": {
                      lineHeight: 1, // Reduces space above the label text
                      top: -4, // Adjusts label position to better fit the smaller TextField
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>
          <Box></Box>
        </Box>
        <Box sx={{ width: "100%", minHeight: "200px" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              height: "48px",
              borderTop: "1px solid #DADADA",
              borderBottom: "1px solid #DADADA",
            }}
          >
            <Box sx={{ marginLeft: "4%" }}>
              <Typography
                sx={{ fontSize: "16px", color: "black", fontWeight: "bold" }}
              >
                Image
              </Typography>
            </Box>
            <Box sx={{ marginRight: "4%" }}>
              <Button
                disableElevation
                variant="contained"
                size="small"
                sx={{
                  backgroundColor: "#E3E3E3",
                  textTransform: "capitalize",
                  color: "black",
                  "&:hover": {
                    backgroundColor: "#E3E3E3",
                    color: "black",
                  },
                }}
              >
                Add
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default CustomizeElement;
