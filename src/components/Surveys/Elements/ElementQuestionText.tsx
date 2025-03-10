import { useState } from "react";

import { Box, TextField, Typography } from "@mui/material";
import { FaArrowRightLong } from "react-icons/fa6";

import {
  useUpdateElementDescriptionMutation,
  useUpdateElementTextMutation,
} from "../../../app/slices/elementApiSlice";
import { ElementProps } from "../../../utils/types";

const ElementQuestionText = ({
  qID,
  qNO,
  qText,
  qDescription,
  qType,
  display,
}: ElementProps) => {
  const [text, setText] = useState(qText);
  const [description, setDescription] = useState(qDescription);
  const [isEditing, setIsEditing] = useState(false);

  const qFontSize = display === "mobile" ? "28px" : "32px";
  const descritptionFontSize = display === "mobile" ? "16px" : "20px";
  const qWhiteSpace = display === "mobile" ? "0.1em" : "normal";

  const nonOrderableTypes = ["INSTRUCTIONS", "EMAIL_CONTACT"];

  const isNonOrderableType = nonOrderableTypes.includes(qType);

  const [updateElementText] = useUpdateElementTextMutation();
  const [updateElementDescription] = useUpdateElementDescriptionMutation();

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleChangeDescription = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleBlur = () => {
    updateElementText({ questionID: qID, text });
    setIsEditing(false);
  };

  const handleBlurDescription = () => {
    updateElementDescription({ questionID: qID, description });
    setIsEditing(false);
  };

  return (
    <>
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        sx={{
          margin: "auto",
          width: "96%",
          padding: "1%",
          // border: "2px solid red",
        }}
      >
        <Box
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"center"}
          alignContent={"center"}
          alignItems={"center"}
          sx={{
            margin: "auto",
            width: "96%",
            padding: "2%",
            // border: "2px solid green",
          }}
        >
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            mr={1}
            sx={{ width: "fit-content" }}
          >
            {isNonOrderableType ? null : (
              <Typography
                variant="h4"
                fontWeight={"bold"}
                color={"black"}
                mt={1}
                sx={{ fontSize: "24px" }}
              >
                {qNO}
              </Typography>
            )}
          </Box>
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            mr={2}
            // sx={{ border: "2px solid green" }}
          >
            {isNonOrderableType ? null : (
              <Typography variant="h6" mt={1}>
                <FaArrowRightLong />
              </Typography>
            )}
          </Box>
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            onDoubleClick={handleDoubleClick}
            // sx={{ border: "2px solid red" }}
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
                  whiteSpace: qWhiteSpace,
                  width: "100%",
                  fontSize: qFontSize,
                  textAlign: "justify",
                }}
              >
                {qText}
              </Typography>
            )}
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            margin: "auto",
            // border: "2px solid black",
          }}
        >
          <Box onDoubleClick={handleDoubleClick}>
            {isEditing ? (
              <TextField
                id="outlined-basic"
                variant="outlined"
                type="text"
                value={description}
                onChange={handleChangeDescription}
                onBlur={handleBlurDescription}
                sx={{
                  backgroundColor: "transparent",
                  "& .MuiInputBase-input": {
                    fontSize: "1.6rem",
                  },
                  "& fieldset": {
                    border: "none",
                  },
                  "&:hover fieldset": {
                    border: "none",
                  },
                  "&.Mui-focused fieldset": {
                    border: "none",
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
                  whiteSpace: qWhiteSpace,
                  width: "fit-content",
                  fontSize: descritptionFontSize,
                  color: "#888888",
                }}
              >
                {description === "" ? "Description (optional)" : description}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ElementQuestionText;
