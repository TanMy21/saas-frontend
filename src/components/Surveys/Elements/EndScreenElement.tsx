import { useState } from "react";
import { ElementProps } from "../../../utils/types";
import { Box, TextField, Typography } from "@mui/material";

const EndScreenElement = ({ qText, display }: ElementProps) => {
  const [text, setText] = useState("Say Bye!");
  const [isEditing, setIsEditing] = useState(false);

  const marginTopTextXl = display === "mobile" ? "52%" : "32%";
  const marginTopTextLg = display === "mobile" ? "64%" : "36%";

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
      justifyContent={"start"}
      alignItems={"center"}
      margin={"auto"}
      width={"70%"}
      height={"100%"}
      zIndex={20}
    >
      <Box
        display={"flex"}
        flexDirection={"row"}
        sx={{
          marginTop: {
            md: marginTopTextXl,
            lg: marginTopTextLg,
            xl: marginTopTextLg,
          },
        }}
      >
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          onDoubleClick={handleDoubleClick}
        >
          {isEditing ? (
            <TextField
              id="outlined-basic"
              type="text"
              value={text}
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
                whiteSpace: "nowrap",
                width: "100%",
                fontSize: "clamp(16px, 2.2vw, 48px)",
              }}
            >
              {text}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default EndScreenElement;
