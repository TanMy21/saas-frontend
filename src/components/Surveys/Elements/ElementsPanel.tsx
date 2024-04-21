import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { Box, Typography } from "@mui/material";
import {
  ElementType,
  ElementsPanelProps,
  IconMapping,
} from "../../../utils/types";
import { elementIcons } from "../../../utils/elementsConfig";
import ElementDropDownMenu from "./ElementDropDownMenu";
import { useGetElementsForSurveyQuery } from "../../../app/slices/elementApiSlice";

const ElementsPanel = ({ surveyID, setQuestionId }: ElementsPanelProps) => {
  const { data: elements = [] as ElementType[], refetch } =
    useGetElementsForSurveyQuery(
      surveyID
      //{ pollingInterval: 1000 }
    );

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    if (source.index === destination.index) {
      return;
    }
    const newElements = Array.from(elements);
    const [moved] = newElements.splice(source.index, 1);
    newElements.splice(destination.index, 0, moved);
    // setElements(newElements);
  };

  return (
    <>
      <Box
        sx={{
          padding: "8px",
          overflowY: "scroll",
          overflowX: "hidden",
          maxWidth: { md: "82%", lg: "91%", xl: "98%" },
          maxHeight: "400px",
          "&::-webkit-scrollbar": {
            width: "10px", // Scrollbar width
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1", // Scrollbar track color
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888", // Scrollbar thumb color
            borderRadius: "10px", // Rounded corners on the scrollbar thumb
            "&:hover": {
              background: "#555", // Scrollbar thumb hover color
            },
          },
        }}
      >
        {elements.length === 0 ? null : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="elements">
              {(provided) => (
                <Box {...provided.droppableProps} ref={provided.innerRef}>
                  {elements.map((element, index) => (
                    <Draggable
                      key={element.questionID}
                      draggableId={element?.questionID as string}
                      index={index}
                    >
                      {(provided) => (
                        <Box
                          key={element.questionID}
                          onClick={() =>
                            element?.questionID &&
                            setQuestionId?.(element?.questionID as string)
                          }
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          display={"flex"}
                          flexDirection={"row"}
                          alignContent={"center"}
                          mb={2}
                          sx={{
                            width: { md: "92%", lg: "96%", xl: "100%" },
                            height: "44px",
                            marginLeft: "1%",
                            border: "2px dotted blue",
                            borderRadius: "8px",
                            position: "relative",
                            "&:hover .close-button": {
                              cursor: "pointer",
                              visibility: "visible",
                            },
                          }}
                        >
                          <Box
                            display={"flex"}
                            alignItems={"center"}
                            flexDirection={"row"}
                            width={"100%"}
                            height={"100%"}
                          >
                            <Box
                              display={"flex"}
                              justifyContent={"center"}
                              alignItems={"center"}
                              ml={1}
                              sx={{
                                width: "10%",
                                height: "100%",
                                "&:hover": {
                                  cursor: "pointer",
                                },
                              }}
                            >
                              <Typography fontSize={"1.6rem"} mt={1}>
                                {
                                  elementIcons[
                                    element.type as keyof IconMapping
                                  ]
                                }
                              </Typography>
                            </Box>
                            <Box
                              display={"flex"}
                              justifyContent={"center"}
                              alignItems={"center"}
                              sx={{
                                width: "10%",
                                height: "100%",
                                marginLeft: {
                                  md: "12%",
                                  lg: "8%",
                                  xl: "4%",
                                },
                                marginTop: "1%",
                                "&:hover": {
                                  cursor: "pointer",
                                },
                              }}
                            >
                              <Typography
                                color={"black"}
                                fontSize={"1.2rem"}
                                fontWeight={"bold"}
                              >
                                {element.order}
                              </Typography>
                            </Box>
                            <Box
                              display={"flex"}
                              justifyContent={"center"}
                              alignItems={"center"}
                              sx={{
                                width: { md: "50%", lg: "52%", xl: "70%" },
                                height: "100%",
                                "&:hover": {
                                  cursor: "pointer",
                                },
                              }}
                            >
                              <Typography
                                ml={1}
                                sx={{
                                  color: "black",
                                  fontSize: "14px",
                                  whiteSpace: "nowrap",
                                  textTransform: "capitalize",
                                  textOverflow: "clip",
                                  overflow: "hidden",
                                  width: "100%",
                                  "&:hover": {
                                    cursor: "pointer",
                                  },
                                }}
                              >
                                {element.text}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "12%",
                                height: "80%",
                                color: "#A4A4A4",
                              }}
                            >
                              <ElementDropDownMenu
                                refetch={refetch}
                                questionID={element.questionID!}
                              />
                            </Box>
                          </Box>
                        </Box>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </Box>
    </>
  );
};

export default ElementsPanel;
