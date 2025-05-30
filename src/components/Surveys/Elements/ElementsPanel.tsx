import { useCallback } from "react";

import { Box, Tooltip, Typography } from "@mui/material";
import debounce from "lodash/debounce";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import type { DropResult } from "react-beautiful-dnd";

import { useUpdateElementOrderMutation } from "../../../app/slices/elementApiSlice";
import { elementIcons } from "../../../utils/elementsConfig";
import { Element, ElementsPanelProps, IconMapping } from "../../../utils/types";

import ElementDropDownMenu from "./ElementDropDownMenu";

const ElementsPanel = ({
  elements,
  setQuestionId,
  refetch,
}: ElementsPanelProps) => {
  const [updateElementOrder /*{ isError, error }*/] =
    useUpdateElementOrderMutation();

  const nonOrderableTypes = [
    "WELCOME_SCREEN",
    "END_SCREEN",
    "INSTRUCTIONS",
    "EMAIL_CONTACT",
  ];
  let isNonOrderableType;

  const elementStartTypes = ["WELCOME_SCREEN", "INSTRUCTIONS", "EMAIL_CONTACT"];
  const orderedElementTypes = [
    "BINARY",
    "MEDIA",
    "MULTIPLE_CHOICE",
    "NUMBER",
    "RADIO",
    "RANGE",
    "RANK",
    "TEXT",
  ];

  const startElementTypeOrder: { [key: string]: number } = {
    "WELCOME_SCREEN": 1,
    "INSTRUCTIONS": 2,
    "EMAIL_CONTACT": 3,
  };

  const startElements = elements
    .filter((q) => elementStartTypes.includes(q.type))
    .sort(
      (a, b) => startElementTypeOrder[a.type] - startElementTypeOrder[b.type]
    );
  const orderedElements = elements
    .filter((e) => orderedElementTypes.includes(e.type))
    .sort((a, b) => a.order! - b.order!);

  const endElements = elements.filter((e) => e.type === "END_SCREEN");

  const displayedQuestions = [
    ...startElements,
    ...orderedElements,
    ...endElements,
  ];

  const debounceUpdateOrder = useCallback(
    debounce((newElements) => {
      const orderedElements = newElements
        .filter((e: Element) => orderedElementTypes.includes(e.type))
        .map((e: Element, index: number) => ({ ...e, order: index + 1 }));
      updateElementOrder({ questions: orderedElements })
        .unwrap()
        .then()
        .catch((error) => console.error("Order update error:", error));
    }, 500),
    [updateElementOrder]
  );

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) {
      return;
    }

    // const newElements = Array.from(displayedQuestions);
    const orderUpdatedElements = Array.from(orderedElements);
    const [moved] = orderUpdatedElements.splice(source.index, 1);
    orderUpdatedElements.splice(destination.index, 0, moved);
    // setElements(orderUpdatedElements);

    // Reorder elements
    const reorderedWithOrder = orderUpdatedElements.map((el, index) => ({
      ...el,
      order: index + 1,
    }));

    debounceUpdateOrder(reorderedWithOrder);
  };

  return (
    <>
      <Box
        sx={{
          padding: "8px",
          overflowY: "scroll",
          overflowX: "hidden",
          maxWidth: { md: "82%", lg: "92%", xl: "95%" },
          maxHeight: "400px",
          "&::-webkit-scrollbar": {
            width: "10px", // Scrollbar width
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1", // Scrollbar track color
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#61A5D2", // Scrollbar thumb color
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
                  {displayedQuestions.map((element, index) => (
                    <Draggable
                      key={element.questionID}
                      draggableId={element?.questionID}
                      index={index}
                    >
                      {(provided) => (
                        <Box
                          key={element.questionID}
                          onClick={() =>
                            element?.questionID &&
                            setQuestionId?.(element?.questionID)
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
                            border: "2px dotted #673AB7",
                            borderRadius: "10px",
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
                            gap={"4px"}
                            width={"100%"}
                            height={"100%"}
                          >
                            <Box
                              display={"flex"}
                              justifyContent={"center"}
                              alignItems={"center"}
                              flexBasis={"auto"}
                              flexGrow={1}
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

                            {!nonOrderableTypes.includes(element.type) && (
                              <Box
                                display={"flex"}
                                justifyContent={"center"}
                                alignItems={"center"}
                                flexBasis={"auto"}
                                flexGrow={1}
                                sx={{
                                  width: "10%",
                                  height: "100%",

                                  marginTop: "1%",
                                  marginLeft: "4%",
                                  "&:hover": {
                                    cursor: "pointer",
                                  },
                                }}
                              >
                                <Typography
                                  color={"black"}
                                  fontSize={"1.4rem"}
                                  fontWeight={"bold"}
                                >
                                  {element.order}
                                </Typography>
                              </Box>
                            )}
                            <Box
                              display={"flex"}
                              justifyContent={"flex-start"}
                              alignItems={"center"}
                              flexBasis={"64%"}
                              flexGrow={0}
                              maxWidth={"80%"}
                              sx={{
                                minWidth: { md: "50%", lg: "52%", xl: "64%" },
                                height: "100%",
                                "&:hover": {
                                  cursor: "pointer",
                                },
                              }}
                            >
                              <Tooltip title={element.text} placement="top">
                                <Typography
                                  ml={1}
                                  sx={{
                                    color: "black",
                                    fontSize: "14px",
                                    whiteSpace: "nowrap",
                                    textTransform: "capitalize",
                                    textOverflow: "clip",
                                    overflow: "hidden",
                                    width: "96%",
                                    "&:hover": {
                                      cursor: "pointer",
                                    },
                                  }}
                                >
                                  {element.text}
                                </Typography>
                              </Tooltip>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                flexBasis: "auto",
                                flexGrow: 1,
                                width: "fit-content",
                                height: "80%",
                                color: "#A4A4A4",
                              }}
                            >
                              <ElementDropDownMenu
                                refetch={refetch}
                                elements={elements}
                                questionID={element.questionID}
                                setQuestionId={setQuestionId!}
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
