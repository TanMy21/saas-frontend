import { useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import { FaArrowRightLong } from "react-icons/fa6";
import { ElementProps } from "../../../utils/types";
import { useUpdateElementTextMutation } from "../../../app/slices/elementApiSlice";

const ElementQuestionText = ({ qID, qNO, qText }: ElementProps) => {
  const [text, setText] = useState(qText);
  const [isEditing, setIsEditing] = useState(false);

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
        alignItems={"center"}
        mr={1}
      >
        <Typography variant="h4" fontWeight={"bold"} color={"black"} mt={1}>
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
        <Typography variant="h6" mt={1}>
          <FaArrowRightLong />
        </Typography>
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
                fontSize: "3.75rem",
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
            variant="h3"
            fontStyle={"italic"}
            fontFamily={
              "BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif"
            }
          >
            {qText}
          </Typography>
        )}
      </Box>
    </>
  );
};

export default ElementQuestionText;
