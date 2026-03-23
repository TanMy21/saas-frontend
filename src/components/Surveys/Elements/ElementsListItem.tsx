import { Box, Tooltip, Typography } from "@mui/material";
import { GripVertical } from "lucide-react";
import { Draggable } from "react-beautiful-dnd";

import { RootState } from "../../../app/store";
import { useAppSelector } from "../../../app/typedReduxHooks";
import useAuth from "../../../hooks/useAuth";
import { nonOrderableTypes } from "../../../utils/constants";
import { elementIcons } from "../../../utils/elementsConfig";
import { htmlToPlainText } from "../../../utils/richTextUtils";
import { ElementListItemProps, IconMapping } from "../../../utils/types";

import ElementDropDownMenu from "./ElementDropDownMenu";

export const ElementsListItem = ({
  displayedQuestions,
  setQuestionId,
  newQuestionIds,
}: ElementListItemProps) => {
  const { can } = useAuth();

  const selectedQuestionId = useAppSelector(
    (state: RootState) => state.question.selectedQuestion?.questionID,
  );

  return (
    <Box>
      {displayedQuestions.map((element, index) => {
        const isSystemScreen = nonOrderableTypes.includes(element.type);
        const isNew = newQuestionIds?.has(element.questionID);

        const canDuplicate = !isSystemScreen && can("CREATE_QUESTION");
        const canDelete = can("DELETE_QUESTION");

        const canShowMenu = canDuplicate || canDelete;

        /** Gets the order of this new item among only the new items, for stagger timing */
        const staggerIndex = isNew
          ? displayedQuestions
              .filter((q) => newQuestionIds?.has(q.questionID) ?? false)
              .findIndex((q) => q.questionID === element.questionID)
          : -1;

        const shouldDisplayOrder =
          !isSystemScreen &&
          typeof element.order === "number" &&
          element.order > 0 &&
          element.order < 9999;

        const isSelected = element.questionID === selectedQuestionId;

        return (
          <Draggable
            key={element.questionID}
            draggableId={element.questionID}
            index={index}
            isDragDisabled={isSystemScreen || !can("REORDER_QUESTION")}
          >
            {(provided, snapshot) => (
              <Box
                key={element.questionID}
                ref={provided.innerRef}
                {...provided.draggableProps}
                onClick={() =>
                  element?.questionID && setQuestionId?.(element?.questionID)
                }
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,

                  position: "relative",
                  zIndex: snapshot.isDragging ? 2000 : "auto",

                  px: 1.5,
                  py: 1,
                  minHeight: 52,

                  cursor: isSystemScreen
                    ? "default"
                    : snapshot.isDragging
                      ? "grabbing"
                      : "default",

                  userSelect: "none",

                  transform: provided.draggableProps.style?.transform,

                  /** GPU acceleration */
                  willChange: "transform",
                  backfaceVisibility: "hidden",

                  /** smooth reorder animation */
                  transition:
                    "transform 180ms cubic-bezier(.2,0,0,1), background-color 0.2s ease, box-shadow 0.2s ease",

                  ...(isNew && {
                    backgroundColor: "rgba(99,102,241,0.10)",
                    animation:
                      "aiQuestionAppear 0.55s ease forwards, aiQuestionTint 1.2s ease forwards",
                    animationDelay: `${staggerIndex * 90}ms`,
                    opacity: 0,
                  }),

                  opacity: snapshot.isDragging ? 0.98 : 1,

                  /** floating drag item */
                  boxShadow: snapshot.isDragging
                    ? "0 20px 40px rgba(0,0,0,0.22)"
                    : "none",

                  "&:hover": {
                    backgroundColor: isSelected ? "#EFF6FF" : "#F9FAFB",
                    boxShadow: "0 4px 12px rgba(16, 24, 40, 0.08)",
                    transform: "translateY(-1px)",
                  },

                  ...(isSelected
                    ? {
                        backgroundColor: "#EFF6FF",
                        color: "#1e3a8a",
                        border: "1px solid #bfdbfe",
                        borderLeft: "8px solid #4C6FFF",
                        borderTopLeftRadius: "20px",
                        borderBottomLeftRadius: "20px",
                        boxShadow:
                          "0 4px 12px rgba(76,111,255,0.15), 0 0 0 1px rgba(76,111,255,0.05)",
                        transform: "translateY(-1px)",
                      }
                    : {
                        backgroundColor:
                          index % 2 === 0 ? "#FFFFFF" : "#FCFCFD",
                        color: "#374151",
                        border: "1px solid #EEF2F7",
                      }),
                  ...(isSystemScreen && {
                    opacity: 0.9,
                    backgroundColor: "#F8FAFC",
                    borderStyle: "dashed",
                    cursor: "default",

                    "&:hover": {
                      backgroundColor: "#F8FAFC",
                      boxShadow: "none",
                      transform: "none",
                    },
                  }),
                }}
              >
                {/* Drop target indicator */}
                {snapshot.isDragging && (
                  <Box
                    sx={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: -2,
                      height: 2,
                      backgroundColor: "#3B82F6",
                      borderRadius: 2,
                    }}
                  />
                )}

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: isSystemScreen
                      ? "28px minmax(0,1fr) auto"
                      : "28px 28px minmax(0,1fr) auto",
                    gridTemplateRows: isSystemScreen ? "28px" : "28px auto",
                    alignItems: "center",
                    columnGap: 1,
                    rowGap: 1,
                    width: "100%",
                  }}
                >
                  {!isSystemScreen ? (
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
                        width: 28,
                        height: 28,
                      }}
                    >
                      <Tooltip title="Drag to reorder">
                        <GripVertical fontSize="small" />
                      </Tooltip>
                    </Box>
                  ) : null}

                  <Typography
                    sx={{
                      gridColumn: isSystemScreen ? "1 / 2" : "2 / 3",
                      gridRow: "1 / 2",
                      fontSize: "1.4rem",
                      lineHeight: 1,
                      mt: 0.25,
                      opacity: isSelected ? 1 : 0.9,
                    }}
                  >
                    {elementIcons[element.type as keyof IconMapping]}
                  </Typography>

                  {canShowMenu && (
                    <Box
                      sx={{
                        gridColumn: isSystemScreen ? "3 / 4" : "4 / 5",
                        gridRow: "1 / 2",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 32,
                        flexShrink: 0,
                        height: 28,
                        ml: 1,
                      }}
                    >
                      <ElementDropDownMenu
                        questionID={element.questionID}
                        setQuestionId={setQuestionId}
                        isSystemScreen={isSystemScreen}
                      />
                    </Box>
                  )}
                  <Box
                    sx={{
                      gridColumn: isSystemScreen
                        ? "2 / 3"
                        : { xs: "2 / 4", md: "2 / -1" },
                      gridRow: isSystemScreen ? "1 / 2" : "2 / 3",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      minHeight: 24,
                      minWidth: 0,
                      pr: 0.5,
                    }}
                  >
                    {shouldDisplayOrder && (
                      <Typography
                        sx={{
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          lineHeight: 1,
                          color: isSelected ? "#4f46e5" : "#374151",
                        }}
                      >
                        {element.order}
                      </Typography>
                    )}

                    <Tooltip
                      title={htmlToPlainText(element.text)}
                      placement="top"
                      enterDelay={500}
                      leaveDelay={100}
                    >
                      <Typography
                        noWrap
                        sx={{
                          color: isSelected ? "#4f46e5" : "#374151",
                          fontSize: "0.95rem",
                          fontWeight: 600,
                          textTransform: "capitalize",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {htmlToPlainText(element.text)}
                      </Typography>
                    </Tooltip>
                  </Box>
                </Box>
              </Box>
            )}
          </Draggable>
        );
      })}
    </Box>
  );
};
