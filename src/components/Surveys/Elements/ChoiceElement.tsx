import { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { List, ListItem, RadioGroup, Radio } from "@mui/joy";
import { ElementProps, ErrorData, OptionType } from "../../../utils/types";
import { MdAdd } from "react-icons/md";
import ClearIcon from "@mui/icons-material/Clear";
import ElementQuestionText from "./ElementQuestionText";
import {
  useCreateNewOptionMutation,
  useDeleteOptionMutation,
  useGetOptionsOfQuestionQuery,
  useUpdateOptionTextandValueMutation,
} from "../../../app/slices/optionApiSlice";
import { toast } from "react-toastify";

const ChoiceElement = ({
  qID,
  qNO,
  qText,
  qDescription,
  display,
}: ElementProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [editingID, setEditingID] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");
  const [selectedOptionID, setSelectedOptionID] = useState<string | null>(null);

  const { data: options = [] as OptionType[] } = useGetOptionsOfQuestionQuery(
    qID!
  );

  const [createNewOption, { isError, error }] = useCreateNewOptionMutation();

  const [updateOptionTextandValue] = useUpdateOptionTextandValueMutation();

  const [deleteOption] = useDeleteOptionMutation();

  const addChoice = async () => {
    const order = options ? options.length + 1 : 1;

    try {
      if (options.length < 10) {
        const nextChoiceNumber = options.length + 1;

        await createNewOption({
          questionID: qID,
          text: `Choice ${nextChoiceNumber}`,
          value: `Choice ${nextChoiceNumber}`,
          order,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditText(event.target.value);
  };

  const deleteChoice = async (optionID: string) => {
    try {
      await deleteOption(optionID).unwrap();
    } catch (error) {
      console.error(error);
    }
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

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
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
      width={"98%"}
      height={"100%"}
      zIndex={20}
    >
      <Box
        display={"flex"}
        flexDirection={"row"}
        sx={{ margin: "auto", width: "98%", marginTop: "12%" }}
      >
        <ElementQuestionText
          qID={qID}
          qNO={qNO}
          qText={qText}
          qDescription={qDescription}
          display={display}
        />
      </Box>
      <Box
        display={"flex"}
        flexDirection={"column"}
        mt={4}
        sx={{
          width: "100%",
          maxWidth: "240px",
          padding: "1%",
        }}
      >
        <FormControl>
          <RadioGroup
            value={selectedOptionID}
            onChange={(event) => setSelectedOptionID(event.target.value)}
          >
            <List
              sx={{
                margin: "auto",
                width: "100%",
                // border: "2px solid blue",
                "--List-gap": "0.5rem",
                "--ListItem-radius": "4px",
                "--ListItemDecorator-size": "32px",
              }}
            >
              {options.map((option, index) => (
                <ListItem
                  variant="outlined"
                  key={option.optionID}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                    minHeight: "36px",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    border: "1px solid #003DAC",
                    color: "black",
                    width: "100%",
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
                      ml={2}
                      sx={{
                        height: "100%",
                      }}
                    >
                      <Radio
                        value={option.optionID}
                        checked={selectedOptionID === option.optionID}
                        onChange={(event) =>
                          setSelectedOptionID(event.target.value)
                        }
                        sx={{ flexGrow: 1, flexDirection: "row" }}
                        slotProps={{
                          action: ({ checked }) => ({
                            sx: () => ({
                              ...(checked && {
                                inset: -1,
                                // border: "1px solid blue",
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
                      onDoubleClick={() => handleDoubleClick(option)}
                      sx={{
                        minWidth: "90%",
                        maxWidth: "98%",
                        height: "100%",
                        padding: "4px",
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
                          ml={1}
                          sx={{ fontSize: "16px" }}
                          onClick={handleClick}
                          whiteSpace={"wrap"}
                          overflow={"hidden"}
                          textOverflow={"string"}
                        >
                          {option.text}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {hoveredIndex === index && (
                    <IconButton
                      className="close-button"
                      onClick={() => deleteChoice(option.optionID)}
                      z-index={20}
                      sx={{
                        position: "absolute",
                        top: "50%",
                        right: "-12px",
                        transform: "translateY(-50%)",
                        visibility: "hidden",
                        width: "24px",
                        height: "24px",
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
          </RadioGroup>
        </FormControl>
      </Box>
      <Box mt={2}>
        {options.length < 10 && (
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
            endIcon={<MdAdd fontSize={"24px"} />}
          >
            Add Choice &nbsp;
          </Button>
        )}
      </Box>
    </Box>
  );
};
export default ChoiceElement;
