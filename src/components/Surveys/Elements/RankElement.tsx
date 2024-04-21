import { useEffect, useState } from "react";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { ElementProps, ErrorData, OptionType } from "../../../utils/types";
import { MdAdd } from "react-icons/md";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import ClearIcon from "@mui/icons-material/Clear";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ElementQuestionText from "./ElementQuestionText";
import {
  useCreateNewOptionMutation,
  useDeleteOptionMutation,
  useGetOptionsOfQuestionQuery,
  useUpdateOptionTextandValueMutation,
} from "../../../app/slices/optionApiSlice";
import { toast } from "react-toastify";

const RankElement = ({ qID, qNO, qText }: ElementProps) => {
  const [editingID, setEditingID] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");

  const { data: options = [] as OptionType[] } =
    useGetOptionsOfQuestionQuery(qID);

  const [createNewOption, { isError, error }] = useCreateNewOptionMutation();

  const [updateOptionTextandValue] = useUpdateOptionTextandValueMutation();

  const [deleteOption] = useDeleteOptionMutation();

  const handleDoubleClick = (option: OptionType) => {
    setEditingID(option.optionID);
    setEditText(option.text);
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditText(event.target.value);
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

  const addRank = async () => {
    const order = options ? options.length + 1 : 1;

    try {
      if (options.length <= 10) {
        const nextRank = options.length + 1;

        await createNewOption({
          questionID: qID,
          text: `Rank ${nextRank}`,
          value: `Rank ${nextRank}`,
          order,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteRank = async (optionID: string) => {
    try {
      await deleteOption(optionID).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { /*source, */ destination } = result;

    if (!destination) {
      return;
    }

    // const newRanks = Array.from(rankNumber);
    // const [removed] = newRanks.splice(source.index, 1);
    // newRanks.splice(destination.index, 0, removed);

    // setRankNumber(newRanks);
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
      width={"70%"}
      height={"100%"}
      zIndex={20}
    >
      <Box display={"flex"} flexDirection={"row"} sx={{ marginTop: "8%" }}>
        <ElementQuestionText qID={qID} qNO={qNO} qText={qText} />
      </Box>
      <Box>
        <Typography variant="h6" mt={1} mb={4} color={"#0A49B1"}>
          Rank the following choices in the order of preference.
        </Typography>
      </Box>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable-ranks">
          {(provided) => (
            <Box
              {...provided.droppableProps}
              ref={provided.innerRef}
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"center"}
              alignItems={"center"}
              width={"80%"}
            >
              {options.map((option, index) => (
                <Draggable
                  key={option.optionID}
                  draggableId={option.order.toString()}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      display={"flex"}
                      flexDirection={"column"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      width={"80%"}
                      sx={{
                        display: "flex",
                        marginBottom: "2%",
                        backgroundColor: snapshot.isDragging
                          ? "action.hover"
                          : "white",
                        // boxShadow: snapshot.isDragging ? 3 : 1,
                      }}
                    >
                      <Box
                        key={option.order}
                        sx={{
                          display: "flex",
                          marginTop: "1%",
                          marginBottom: "1%",
                          width: "32%",
                          height: "100%",
                          border: "2px solid #4880DE",
                          borderRadius: "4px",
                          padding: "4px",
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
                          sx={{
                            width: "28px",
                            height: "90%",
                            color: "#E5ECF7",
                          }}
                        >
                          <DragIndicatorIcon />
                        </Box>
                        <Box
                          display={"flex"}
                          flexDirection={"row"}
                          justifyContent={"center"}
                          alignItems={"center"}
                          width={"100%"}
                          height={"100%"}
                          onDoubleClick={() => handleDoubleClick(option)}
                          sx={{ flexGrow: 1, cursor: "pointer" }}
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
                              sx={{ fontSize: "16px" }}
                              onClick={handleClick}
                            >
                              {option.text}
                            </Typography>
                          )}
                        </Box>
                        <IconButton
                          className="close-button"
                          onClick={() => deleteRank(option.optionID)}
                          sx={{
                            position: "absolute",
                            top: "50%",
                            right: "12px",
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
                      </Box>
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
        <Box mt={2}>
          {options.length < 10 && (
            <Button
              onClick={addRank}
              sx={{
                backgroundColor: "#0445AF",
                mr: 1,
                mb: 2,
                textTransform: "capitalize",
                "&:hover": {
                  backgroundColor: "#0445AF",
                },
              }}
              variant="contained"
              size="small"
              endIcon={<MdAdd fontSize={"24px"} />}
            >
              Add Rank &nbsp;
            </Button>
          )}
        </Box>
      </DragDropContext>
    </Box>
  );
};
export default RankElement;
