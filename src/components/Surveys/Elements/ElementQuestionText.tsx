import { useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import { FaArrowRightLong } from "react-icons/fa6";
import { ElementProps } from "../../../utils/types";
import { useUpdateElementTextMutation } from "../../../app/slices/elementApiSlice";

const ElementQuestionText = ({
  qID,
  qNO,
  qText,
  qType,
  display,
}: ElementProps) => {
  const [text, setText] = useState(qText);
  const [isEditing, setIsEditing] = useState(false);

  const qFontSize = display === "mobile" ? "20px" : "36px";
  const descritptionFontSize = display === "mobile" ? "16px" : "20px";
  const qWhiteSpace = display === "mobile" ? "normal" : "normal";

  const nonOrderableTypes = ["INSTRUCTIONS", "EMAIL_CONTACT"];

  const isNonOrderableType = nonOrderableTypes.includes(qType!);

  const [updateElementText] = useUpdateElementTextMutation();

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleBlur = () => {
    updateElementText({ questionID: qID, text });
    setIsEditing(false);
  };

  return (
    <>
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        sx={{
          minWidth: "70%",
          maxWidth: "100%",
          padding: "1%",
        }}
      >
        <Box
          display={"flex"}
          flexDirection={"row"}
          // margin={"auto"}
          sx={{
            minWidth: "70%",
            maxWidth: "96%",
            padding: "2%",
          }}
        >
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            mr={1}
            sx={{ width: "auto" }}
          >
            <Typography
              variant="h4"
              fontWeight={"bold"}
              color={"black"}
              mt={1}
              sx={{ fontSize: "24px" }}
            >
              {qNO}
            </Typography>
          </Box>
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            mr={2}
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
                }}
              >
                {qText}
              </Typography>
            )}
          </Box>
        </Box>
        <Box sx={{ marginLeft: "20%" }}>
          <Typography
            fontStyle={"italic"}
            fontFamily={
              "BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif"
            }
            sx={{
              whiteSpace: qWhiteSpace,
              width: "100%",
              fontSize: descritptionFontSize,
              color: "#888888",
            }}
          >
            {"Description (optional)"}
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default ElementQuestionText;
