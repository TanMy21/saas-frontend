import { useState } from "react";
import { ElementProps } from "../../../utils/types";
import { Box, Button, TextField, Typography } from "@mui/material";

const EndScreenElement = ({ qText, display }: ElementProps) => {
  const [text, setText] = useState("Say Bye!");
  const [isEditing, setIsEditing] = useState(false);

  const marginTopText = display === "mobile" ? "80%" : "28%";
  const fontSizeXL = display === "mobile" ? "1.6rem" : "2.8rem";

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleBlur = () => {
    // updateElementText({ questionID: qID, text });
    setIsEditing(false);
  };
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      margin={"auto"}
      width={"84%"}
      height={"100%"}
      zIndex={20}
    >
      <Box
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"center"}
        width={"100%"}
        sx={{
          marginTop: marginTopText,
        }}
      >
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          width={"72%"}
          margin={"auto"}
          onDoubleClick={handleDoubleClick}
        >
          {isEditing ? (
            <TextField
              id="outlined-basic"
              type="text"
              value={qText ? qText : text}
              onChange={handleChange}
              onBlur={handleBlur}
              sx={{
                backgroundColor: "transparent",
                fontStyle: "italic",
                fontSize: "3.75rem",
                width: "100%",
                "& .MuiInputBase-input": {
                  fontSize: "2rem",
                },
                fontFamily:
                  "BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: "none",
                  },
                  "&:hover fieldset": {
                    border: "none",
                  },
                  "&.Mui-focused fieldset": {
                    border: "none",
                  },
                },
              }}
            />
          ) : (
            <Typography
              fontStyle={"italic"}
              fontFamily={
                "BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif"
              }
              sx={{
                whiteSpace: "wrap",
                width: "100%",
                textAlign: "justify",
                lineHeight: "1",
                fontSize: fontSizeXL,
                wordSpacing: "1px",
              }}
            >
              {qText ? qText : text}
            </Typography>
          )}
        </Box>
      </Box>
      <Box mt={4}>
        <Button
          sx={{
            backgroundColor: "#0445AF",
            mr: 2,
            mb: 4,
            textTransform: "capitalize",
            "&:hover": {
              backgroundColor: "#0445AF",
            },
          }}
          variant="contained"
          size="large"
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default EndScreenElement;
