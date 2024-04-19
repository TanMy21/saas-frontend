import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { List, ListItem, RadioGroup, Radio } from "@mui/joy";
import { ElementProps } from "../../../utils/types";
import { FaArrowRightLong } from "react-icons/fa6";
import { MdAdd } from "react-icons/md";
import ClearIcon from "@mui/icons-material/Clear";

const ChoiceElement = ({ qNO }: ElementProps) => {
  const [choices, setChoices] = useState(["Choice 1"]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addChoice = () => {
    if (choices.length < 10) {
      const nextChoiceNumber = choices.length + 1;
      setChoices([...choices, `Choice ${nextChoiceNumber}`]);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const newChoices = [...choices];
    newChoices[index] = event.target.value;
    setChoices(newChoices);
  };

  const deleteChoice = (indexToRemove: number) => {
    setChoices((currentElements) =>
      currentElements.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleDoubleClick = (index: number) => {
    setEditingIndex(index);
  };

  const handleBlur = () => {
    setEditingIndex(null);
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
          alignItems={"start"}
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
        <FormControl>
          <RadioGroup
            aria-label="Your plan"
            name="people"
            defaultValue="Individual"
          >
            <List
              sx={{
                minWidth: 240,
                "--List-gap": "0.5rem",
                "--ListItem-radius": "4px",
                "--ListItemDecorator-size": "32px",
              }}
            >
              {choices.map((choice, index) => (
                <ListItem
                  variant="outlined"
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "16px",
                    boxShadow: "sm",
                    backgroundColor: "#E5ECF7",
                    "&:hover .close-button": {
                      visibility: "visible",
                    },
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <Box
                    display={"flex"}
                    flexDirection={"row"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    width={"96%"}
                    height={"96%"}
                  >
                    <Box
                      display={"flex"}
                      flexDirection={"row"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      mr={2}
                      sx={{
                        height: "100%",
                      }}
                    >
                      <Radio
                        value={choice}
                        sx={{ flexGrow: 1, flexDirection: "row" }}
                        slotProps={{
                          action: ({ checked }) => ({
                            sx: () => ({
                              ...(checked && {
                                inset: -1,
                                border: "1px solid blue",
                              }),
                            }),
                          }),
                        }}
                      />
                    </Box>
                    <Box
                      display={"flex"}
                      flexDirection={"row"}
                      alignItems={"center"}
                      onDoubleClick={() => handleDoubleClick(index)}
                      sx={{
                        width: "90%",
                        height: "100%",
                        padding: "4px",
                      }}
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

                  {hoveredIndex === index && (
                    <IconButton
                      className="close-button"
                      onClick={() => deleteChoice(index)}
                      z-index={20}
                      sx={{
                        position: "absolute",
                        top: "50%",
                        right: "-12px",
                        transform: "translateY(-50%)",
                        visibility: "hidden",
                        width: "24px",
                        height: "24px",
                        backgroundColor: "red",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "darkred",
                        },
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  )}
                </ListItem>
              ))}
            </List>
          </RadioGroup>
        </FormControl>
      </Box>
      <Box mt={2}>
        {choices.length < 10 && (
          <Button
            onClick={addChoice}
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
            size="small"
          >
            Add Choice &nbsp;
            <MdAdd fontSize={"24px"} />
          </Button>
        )}
      </Box>
    </Box>
  );
};
export default ChoiceElement;
