import { useState } from "react";

import { Box, TextField, Typography } from "@mui/material";

import { useUpdateOptionTextandValueMutation } from "../../app/slices/optionApiSlice";
import { MediaElementCardProps, OptionType } from "../../utils/types";

const MediaElementCardContent = ({ text, option }: MediaElementCardProps) => {
  const [editingID, setEditingID] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");

  const [updateOptionTextandValue] = useUpdateOptionTextandValueMutation();

  const handleDoubleClick = (option: OptionType) => {
    setEditingID(option.optionID);
    setEditText(option.value);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(event.target.value);
  };

  const handleBlur = async () => {
    await updateOptionTextandValue({
      optionID: editingID,
      value: editText,
    });
    setEditingID(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexGrow: 1,
        flexDirection: "row",
        gap: "4px",
        width: "84%",
        minHeight: "16%",
        overflow: "hidden",
        marginBottom: "4px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "16%",
          height: "24px",
          border: "2px solid #E4BD34",
          bgcolor: "white",
          borderRadius: "2px",
          marginRight: "2px",
        }}
      >
        <Typography variant="subtitle2">{text}</Typography>
      </Box>
      <Box
        sx={{
          width: "76%",
          minHeight: "96%",
        }}
      >
        <Box
          onDoubleClick={() => handleDoubleClick(option)}
          sx={{
            flex: 1,
            height: "100%",
            display: "flex",
            justifyContent: "start",
            alignItems: "flex-start",
            cursor: "pointer",
          }}
        >
          {" "}
          {editingID === option.optionID ? (
            <TextField
              id="outlined-basic"
              variant="outlined"
              type="text"
              value={editText}
              onChange={handleChange}
              onBlur={handleBlur}
              autoFocus
              InputProps={{
                sx: {
                  height: "100%",
                  padding: "0px",
                  "& input": {
                    padding: "4px 8px",
                  },
                },
              }}
              sx={{
                backgroundColor: "transparent",
                width: "100%",
                height: "100%",
                "& .MuiOutlinedInput-root": {
                  height: "100%",
                  "& fieldset": {
                    border: "none",
                  },
                },
              }}
            />
          ) : (
            <Typography
              sx={{
                fontSize: "16px",
                whiteSpace: "normal",
                wordBreak: "break-word",
                width: "96%",
                padding: "4px",
              }}
              onClick={handleClick}
            >
              {option.value}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default MediaElementCardContent;
