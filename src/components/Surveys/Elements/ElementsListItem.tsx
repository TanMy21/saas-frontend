import { Box, Tooltip, Typography } from "@mui/material";
import { Draggable } from "react-beautiful-dnd";

import { RootState } from "../../../app/store";
import { useAppSelector } from "../../../app/typedReduxHooks";
import { elementIcons } from "../../../utils/elementsConfig";
import { ElementListItemProps, IconMapping } from "../../../utils/types";

import ElementDropDownMenu from "./ElementDropDownMenu";

const ElementsListItem = ({
  displayedQuestions,
  provided,
  setQuestionId,
}: ElementListItemProps) => {
  const elements = useAppSelector(
    (state: RootState) => state.surveyBuilder.elements
  );

  return (
    <Box {...provided.droppableProps} ref={provided.innerRef}>
      {/* {elements.map((element, index) => { */}
      {displayedQuestions.map((element, index) => {
        const isOrderOutOfRange =
          !element.order || element.order <= 0 || element.order > 9996;
        return (
          <Draggable
            key={element.questionID}
            draggableId={element?.questionID}
            index={index}
          >
            {(provided) => (
              <Box
                key={element.questionID}
                onClick={() =>
                  element?.questionID && setQuestionId?.(element?.questionID)
                }
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  position: "relative",
                  backgroundColor: "transparent",
                  transition: "background-color 0.2s ease-in-out",
                  "&:hover": {
                    backgroundColor: "#f9fafb",
                  },
                  width: { md: "100%", lg: "100%", xl: "100%" },
                  height: "64px",
                  // marginLeft: "1%",
                  borderBottom: "1px solid #F3F4F6",
                  "&:hover .close-button": {
                    cursor: "pointer",
                    visibility: "visible",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-end",
                    width: "12%",
                    height: "98%",
                    //   border: "2px solid red",
                  }}
                >
                  <Typography fontSize={"1.4rem"} mt={1}>
                    {elementIcons[element.type as keyof IconMapping]}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "68%",
                    height: "98%",
                    pl: 2,
                    //   border: "2px solid red",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      margin: "auto",
                      width: "98%",
                      height: "48%",
                      // border: "2px solid green",
                    }}
                  >
                    {!isOrderOutOfRange && (
                      <Typography
                        color={"black"}
                        fontSize={"1.2rem"}
                        fontWeight={"bold"}
                      >
                        {element.order}
                      </Typography>
                    )}
                    <Tooltip title={element.text} placement="top">
                      <Typography
                        ml={1}
                        sx={{
                          color: "black",
                          fontSize: "16px",
                          whiteSpace: "nowrap",
                          textTransform: "capitalize",
                          textOverflow: "clip",
                          overflow: "hidden",
                          fontWeight: "bold",
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
                  {/* <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "flex-start",
                      margin: "auto",
                      width: "98%",
                      height: "48%",
                      // border: "2px solid green",
                    }}
                  >
                    <Chip
                      label={element.type.replace(/_/g, " ")}
                      sx={{
                        backgroundColor:
                          chipTypeColors[element.type] || "#eceff1",
                        color: "white",
                        fontSize: "12px",
                        fontWeight: "bold",
                        height: "20px",
                        width: "auto",
                        px: 1.5,
                        py: 1,
                      }}
                    />
                  </Box> */}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "12%",
                    height: "98%",
                    //   border: "2px solid red",
                  }}
                >
                  <ElementDropDownMenu
                    questionID={element.questionID}
                    setQuestionId={setQuestionId}
                  />
                </Box>
              </Box>
            )}
          </Draggable>
        );
      })}
      {provided.placeholder}
    </Box>
  );
};

export default ElementsListItem;
