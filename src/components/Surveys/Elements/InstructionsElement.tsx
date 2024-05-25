import {
  Box,
  Button,
  FormControl,
  IconButton,
  List,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import { ElementProps, ErrorData, OptionType } from "../../../utils/types";
import ElementQuestionText from "./ElementQuestionText";
import { MdAdd } from "react-icons/md";
import { useEffect, useState } from "react";
import {
  useCreateNewOptionMutation,
  useDeleteOptionMutation,
  useGetOptionsOfQuestionQuery,
  useUpdateOptionTextandValueMutation,
} from "../../../app/slices/optionApiSlice";
import ClearIcon from "@mui/icons-material/Clear";
import { toast } from "react-toastify";

const InstructionsElement = ({
  qID,
  qNO,
  qText,
  qType,
  display,
}: ElementProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [editingID, setEditingID] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");

  // const marginLeftListItem = display === "mobile" ? "10%" : "10%";

  const { data: options = [] as OptionType[] } = useGetOptionsOfQuestionQuery(
    qID!
  );

  const [createNewOption, { isError, error }] = useCreateNewOptionMutation();

  const [updateOptionTextandValue] = useUpdateOptionTextandValueMutation();

  const [deleteOption] = useDeleteOptionMutation();

  const addInstruction = async () => {
    const order = options ? options.length + 1 : 1;

    try {
      if (options.length < 10) {
        const nextInstructionNumber = options.length + 1;

        await createNewOption({
          questionID: qID,
          text: `Instruction ${nextInstructionNumber}`,
          value: `Instruction ${nextInstructionNumber}`,
          order,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteInstruction = async (optionID: string) => {
    try {
      await deleteOption(optionID).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditText(event.target.value);
  };

  const handleDoubleClick = (option: OptionType) => {
    setEditingID(option.optionID);
    setEditText(option.text);
  };

  const handleBlur = async () => {
    await updateOptionTextandValue({
      optionID: editingID,
      text: editText,
      value: editText,
    });
    setEditingID(null);
  };

  useEffect(() => {
    if (isError) {
      const errorData = error as ErrorData;
      if (Array.isArray(errorData.data.error)) {
        errorData.data.error.forEach((el) =>
          toast.error(el.message, {
            position: "top-right",
          })
        );
      } else {
        toast.error(errorData.data.message, {
          position: "top-right",
        });
      }
    }
  }, [isError, error, options]);

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"start"}
      alignItems={"center"}
      margin={"auto"}
      maxWidth={"100%"}
      height={"100%"}
      zIndex={20}
      // sx={{ border: "2px solid orange" }}
    >
      <Box
        display={"flex"}
        flexDirection={"row"}
        sx={{ width: "96%", marginTop: "12%" }}
      >
        <ElementQuestionText
          qID={qID}
          qNO={qNO}
          qText={qText}
          qType={qType}
          display={display}
        />
      </Box>
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        mt={4}
        sx={{ margin: "auto", width: "96%" }}
      >
        <FormControl>
          <List
            sx={{
              width: "96%",
              "--List-gap": "0.5rem",
              "--ListItem-radius": "4px",
              "--ListItemDecorator-size": "32px",
              margin: "auto",
              // border: "2px solid red",
            }}
          >
            {options.map((option, index) => (
              <ListItem
                key={option.optionID}
                sx={{
                  width: "96%",
                  display: "flex",
                  margin: "auto",
                  justifyContent: "space-around",
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "24px",
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
                  justifyContent={"space-around"}
                  alignItems={"center"}
                  width={"96%"}
                  height={"96%"}
                  // border={"2px solid darkred"}
                  margin={"auto"}
                >
                  <Box
                    display={"flex"}
                    flexDirection={"row"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    mr={2}
                    sx={{
                      width: "4%",
                      height: "100%",
                      // border: "2px solid yellow",
                    }}
                  >
                    <Typography
                      sx={{
                        display: "inline",
                        fontSize: "24px",
                        fontStyle: "bold",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {index + 1}
                    </Typography>
                    <Typography
                      sx={{
                        display: "inline",
                        marginTop: "-2%",
                        fontSize: "24px",
                        fontStyle: "bold",
                        whiteSpace: "nowrap",
                      }}
                    >
                      )
                    </Typography>
                  </Box>
                  <Box
                    display={"flex"}
                    flexDirection={"row"}
                    alignItems={"center"}
                    onDoubleClick={() => handleDoubleClick(option)}
                    sx={{
                      width: "96%",
                      height: "100%",
                      padding: "4px",
                      // border: "2px solid darkblue",
                    }}
                  >
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
                          whiteSpace: "wrap",
                          fontSize: "20px",
                          textAlign: "justify",
                          lineHeight: "1",
                        }}
                        // onClick={handleClick}
                      >
                        {option.text}
                      </Typography>
                    )}
                  </Box>
                </Box>

                {hoveredIndex === index && (
                  <IconButton
                    className="close-button"
                    onClick={() => deleteInstruction(option.optionID)}
                    z-index={20}
                    sx={{
                      position: "absolute",
                      top: "50%",
                      right: "-1px",
                      transform: "translateY(-50%)",
                      visibility: "hidden",
                      width: "28px",
                      height: "28px",
                      backgroundColor: "darkred",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "red",
                      },
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                )}
              </ListItem>
            ))}
          </List>
        </FormControl>
      </Box>
      <Box mt={2}>
        <Button
          onClick={addInstruction}
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
          endIcon={<MdAdd fontSize={"24px"} />}
        >
          Add Instruction &nbsp;
        </Button>
      </Box>
    </Box>
  );
};
export default InstructionsElement;
