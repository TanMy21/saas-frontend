import { useState } from "react";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { ElementProps } from "../../../utils/types";
import { FaArrowRightLong } from "react-icons/fa6";
import { MdAdd } from "react-icons/md";
import ClearIcon from "@mui/icons-material/Clear";
import Checkbox from "@mui/joy/Checkbox";

const CheckBoxElement = ({ qNO }: ElementProps) => {
  const [choices, setChoices] = useState(["Choice A"]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleDoubleClick = (index: number) => {
    setEditingIndex(index);
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const newChoices = [...choices];
    newChoices[index] = event.target.value;
    setChoices(newChoices);
  };

  const handleBlur = () => {
    setEditingIndex(null);
  };

  const addChoice = () => {
    if (choices.length < 26) {
      const nextCharCode = "A".charCodeAt(0) + choices.length;
      const nextChoiceLetter = String.fromCharCode(nextCharCode);
      setChoices([...choices, `Choice ${nextChoiceLetter}`]);
    }
  };

  const deleteChoice = (indexToRemove: number) => {
    setChoices((currentElements) =>
      currentElements.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
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
      <Box display={"flex"} flexDirection={"row"} sx={{ marginTop: "12%" }}>
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
        >
          <Typography
            variant="h3"
            fontStyle={"italic"}
            fontFamily={
              "BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif"
            }
          >
            Your question here.
          </Typography>
        </Box>
      </Box>
      <Box display={"flex"} flexDirection={"column"} mt={4}>
        {choices.map((choice, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
              marginBottom: "12px",
              padding: "4px",
              width: "200px",
              height: "36px",
              backgroundColor: "#E5ECF7",
              borderRadius: "4px",
              border: "1px solid #003DAC",
              fontSize: "16px",
              fontWeight: "bold",
              position: "relative",
              "&:hover .close-button": {
                visibility: "visible",
              },
            }}
          >
            <Box
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              sx={{ width: "20%", height: "28px" }}
            >
              <Checkbox key={index} onClick={handleClick} />
            </Box>
            <Box sx={{ width: "70%", height: "28px" }}>
              <Box
                display={"flex"}
                flexDirection={"row"}
                alignItems={"center"}
                width={"100%"}
                height={"100%"}
                onDoubleClick={() => handleDoubleClick(index)}
                sx={{ flexGrow: 1, cursor: "pointer" }}
              >
                {editingIndex === index ? (
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    type="text"
                    value={choice}
                    onChange={(event) => handleChange(event, index)}
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
                    ml={4}
                    sx={{ fontSize: "16px" }}
                    onClick={handleClick}
                  >
                    {choice}
                  </Typography>
                )}
              </Box>
            </Box>
            <IconButton
              className="close-button"
              onClick={() => deleteChoice(index)}
              z-index={10}
              sx={{
                position: "absolute",
                top: "50%",
                right: "-12px",
                transform: "translateY(-50%)",
                visibility: "hidden",
                width: "24px",
                height: "24px",
                backgroundColor: "red", // Custom background color
                color: "white", // Custom icon color
                "&:hover": {
                  backgroundColor: "darkred",
                },
              }}
            >
              <ClearIcon />
            </IconButton>
          </Box>
        ))}
      </Box>
      <Box mt={2} mb={2}>
        {choices.length < 10 && (
          <Button
            onClick={addChoice}
            sx={{
              backgroundColor: "#0445AF",
              mr: 2,
              textTransform: "capitalize",
              "&:hover": {
                backgroundColor: "#0445AF",
              },
            }}
            variant="contained"
            size="small"
            endIcon={<MdAdd fontSize={"24px"} />}
          >
            Add Choice &nbsp;
          </Button>
        )}
      </Box>
    </Box>
  );
};
export default CheckBoxElement;
