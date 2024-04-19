import { useState } from "react";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { ElementProps } from "../../../utils/types";
import { FaArrowRightLong } from "react-icons/fa6";
import { MdAdd } from "react-icons/md";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import ClearIcon from "@mui/icons-material/Clear";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

const RankElement = ({ qNO }: ElementProps) => {
  const [rankNumber, setRankNumber] = useState(["Rank 1"]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleDoubleClick = (index: number) => {
    setEditingIndex(index);
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const newChoices = [...rankNumber];
    newChoices[index] = event.target.value;
    setRankNumber(newChoices);
  };

  const handleBlur = () => {
    setEditingIndex(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  const addRank = () => {
    if (rankNumber.length <= 10) {
      const nextRank = rankNumber.length + 1;
      setRankNumber([...rankNumber, `Rank ${nextRank}`]);
    }
  };

  const deleteRank = (indexToRemove: number) => {
    setRankNumber((currentElements) =>
      currentElements.filter((_, index) => index !== indexToRemove)
    );
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    const newRanks = Array.from(rankNumber);
    const [removed] = newRanks.splice(source.index, 1);
    newRanks.splice(destination.index, 0, removed);

    setRankNumber(newRanks);
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
      <Box display={"flex"} flexDirection={"row"} sx={{ marginTop: "8%" }}>
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
              {rankNumber.map((rank, index) => (
                <Draggable
                  key={rank}
                  draggableId={rank.toString()}
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
                        key={rank}
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
                          onDoubleClick={() => handleDoubleClick(index)}
                          sx={{ flexGrow: 1, cursor: "pointer" }}
                        >
                          {editingIndex === index ? (
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              type="text"
                              value={rank}
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
                              sx={{ fontSize: "16px" }}
                              onClick={handleClick}
                            >
                              {rank}
                            </Typography>
                          )}
                        </Box>
                        <IconButton
                          className="close-button"
                          onClick={() => deleteRank(index)}
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
          {rankNumber.length < 10 && (
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
