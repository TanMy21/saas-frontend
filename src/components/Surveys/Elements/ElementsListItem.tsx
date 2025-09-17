import { Box, Tooltip, Typography } from "@mui/material";
import { GripVertical } from "lucide-react";
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

  const selectedQuestionId = useAppSelector(
    (state: RootState) => state.question.selectedQuestion?.questionID
  );

  const nonOrderableTypes = [
    "WELCOME_SCREEN",
    "INSTRUCTIONS",
    "EMAIL_CONTACT",
    "END_SCREEN",
  ];

  return (
    <Box {...provided.droppableProps} ref={provided.innerRef}>
      {displayedQuestions.map((element, index) => {
        const shouldDisplayOrder =
          !nonOrderableTypes.includes(element.type) &&
          typeof element.order === "number" &&
          element.order > 0 &&
          element.order < 9999;

        const isSelected = element.questionID === selectedQuestionId;

        return (
          <Draggable
            key={element.questionID}
            draggableId={element?.questionID}
            index={index}
          >
            {(provided, snapshot) => (
              <Box
                key={element.questionID}
                onClick={() =>
                  element?.questionID && setQuestionId?.(element?.questionID)
                }
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                sx={{
                  // --- container ---
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                  position: "relative", // needed for ::before on selected
                  px: 1.5,
                  py: 1,
                  // borderRadius: 3, // ~rounded-xl
                  cursor: snapshot.isDragging ? "grabbing" : "grab",
                  userSelect: "none",
                  transition:
                    "background-color 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",

                  // --- shared hover (bg stays blue when selected) ---
                  "&:hover": {
                    backgroundColor: isSelected ? "#EFF6FF" : "#F9FAFB",
                    boxShadow: isSelected
                      ? "none"
                      : "0 1px 6px rgba(16, 24, 40, 0.06)",
                    borderColor: isSelected ? "#93c5fd" : "#E5E7EB",
                  },

                  // --- conditional states ---
                  ...(isSelected
                    ? {
                        // selected (Tailwind: bg-blue-50 text-blue-900 border-l-4 border-blue-600)
                        backgroundColor: "#EFF6FF",
                        color: "#1e3a8a",
                        border: "1px solid #bfdbfe",

                        borderLeft: isSelected ? "8px solid #4C6FFF" : "",
                        borderTopLeftRadius: isSelected ? "20px" : "",
                        borderBottomLeftRadius: isSelected ? "20px" : "",
                      }
                    : {
                        // unselected
                        backgroundColor:
                          index % 2 === 0 ? "#FFFFFF" : "#FCFCFD",
                        color: "#374151",
                        border: "1px solid #EEF2F7",

                        // no ::before at all for unselected
                      }),
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "28px 28px 1fr auto", // handle / type / content / menu
                    gridTemplateRows: "28px auto", // top row / bottom row
                    alignItems: "center",
                    columnGap: 1,
                    rowGap: 1,
                    width: "100%",
                  }}
                >
                  {/* Drag handle (col 1, row 1) */}
                  <Box
                    {...provided.dragHandleProps}
                    sx={{
                      gridColumn: "1 / 2",
                      gridRow: "1 / 2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: isSelected ? "#2563eb" : "#9CA3AF",
                      cursor: "grab",
                      "&:active": { cursor: "grabbing" },
                      // larger hit area helps
                      width: 28,
                      height: 28,
                    }}
                  >
                    <Tooltip title="Drag to reorder" placement="top" arrow={false}>
                      <GripVertical fontSize="small" />
                    </Tooltip>
                  </Box>

                  {/* Type icon (col 2, row 1) */}
                  <Typography
                    sx={{
                      gridColumn: "2 / 3",
                      gridRow: "1 / 2",
                      fontSize: "1.6rem",
                      lineHeight: 1,
                      mt: 0.25,
                      opacity: isSelected ? 1 : 0.9,
                    }}
                  >
                    {elementIcons[element.type as keyof IconMapping]}
                  </Typography>

                  {/* Menu (col 4, row 1) */}
                  <Box
                    sx={{
                      gridColumn: "4 / 5",
                      gridRow: "1 / 2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 28,
                      ml: 1,
                    }}
                  >
                    <ElementDropDownMenu
                      questionID={element.questionID}
                      setQuestionId={setQuestionId}
                    />
                  </Box>

                  {/* Content: order + text (col 2-4, row 2) */}
                  <Box
                    sx={{
                      gridColumn: "2 / 4", // starts under the type icon, ends before menu
                      gridRow: "2 / 3",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      minHeight: 24,
                      pr: 0.5,
                    }}
                  >
                    {shouldDisplayOrder && (
                      <Typography
                        sx={{
                          gridColumn: "1 / 2",
                          gridRow: "2 / 3",
                          justifySelf: "center", // centered under handle
                          textAlign: "center",
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          lineHeight: 1,
                          color: isSelected ? "#4f46e5" : "#374151",
                        }}
                      >
                        {element.order}
                      </Typography>
                    )}

                    <Tooltip title={element.text} placement="top">
                      <Typography
                        noWrap
                        sx={{
                          gridColumn: "2 / 4", // starts exactly under the type icon
                          gridRow: "2 / 3",
                          color: isSelected ? "#4f46e5" : "#374151",
                          fontSize: "0.95rem",
                          fontWeight: 600,
                          textTransform: "capitalize",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          "&:hover": { cursor: "pointer" },
                        }}
                      >
                        {element.text}
                      </Typography>
                    </Tooltip>
                  </Box>
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
