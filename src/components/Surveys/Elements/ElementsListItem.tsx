import { Box, Tooltip, Typography } from "@mui/material";
import { GripVertical } from "lucide-react";
import { Draggable } from "react-beautiful-dnd";

import { setQuestion } from "../../../app/slices/elementSlice";
import { RootState } from "../../../app/store";
import { useAppDispatch, useAppSelector } from "../../../app/typedReduxHooks";
import useAuth from "../../../hooks/useAuth";
import { nonOrderableTypes } from "../../../utils/constants";
import { elementIcons } from "../../../utils/elementsConfig";
import { htmlToPlainText } from "../../../utils/richTextUtils";
import { ElementListItemProps, IconMapping } from "../../../utils/types";

import ElementDropDownMenu from "./ElementDropDownMenu";

export const ElementsListItem = ({
  displayedQuestions,
  newQuestionIds,
}: ElementListItemProps) => {
  const { can } = useAuth();
  const dispatch = useAppDispatch();
  const canReorder = can("REORDER_OPTION");

  const selectedQuestionId = useAppSelector(
    (state: RootState) => state.question.selectedQuestionId,
  );

  return (
    <Box>
      {displayedQuestions.map((element, index) => {
        const isSystemScreen = nonOrderableTypes.includes(element.type);
        const isNew = newQuestionIds?.has(element.questionID);

        const canDuplicate = !isSystemScreen && can("CREATE_QUESTION");
        const canDelete = can("DELETE_QUESTION");

        const canShowMenu = canDuplicate || canDelete;

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
                onClick={() => dispatch(setQuestion({ ...element }))}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  mx: isSelected ? 0.8 : 0,
                  my: isSelected ? 0.6 : 0,
                  borderRadius: "8px",
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
                  boxShadow: snapshot.isDragging
                    ? "0 20px 40px rgba(0,0,0,0.22)"
                    : "none",
                  cursor: isSystemScreen
                    ? "default"
                    : snapshot.isDragging
                      ? "grabbing"
                      : "pointer",
                  userSelect: "none",
                  transform: provided.draggableProps.style?.transform,
                  willChange: "transform",
                  backfaceVisibility: "hidden",
                  "&:hover": {
                    backgroundColor: isSelected ? "#F8FAFC" : "#F3F4F6",
                    boxShadow: isSelected
                      ? "0 6px 16px rgba(0,0,0,0.08)"
                      : "0 2px 8px rgba(16, 24, 40, 0.06)",
                    transform: "translateY(-1px)",
                  },
                  ...(isSelected && {
                    backgroundColor: "#F8FAFC",
                    boxShadow: `
                                0 0 0 1px rgba(99,102,241,0.25),
                                  0 6px 16px rgba(0,0,0,0.08)
                                `,
                    transform: "translateY(-1px)",
                  }),
                  ...(isSystemScreen && {
                    opacity: 0.9,
                    backgroundColor: "#F8FAFC",
                    cursor: "default",
                    "&:hover": {
                      backgroundColor: "#F8FAFC",
                      boxShadow: "none",
                      transform: "none",
                    },
                  }),
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    width: "100%",
                    height: "64px",
                    minWidth: 0,
                  }}
                >
                  {/* Drag Handle */}
                  {!isSystemScreen && (
                    <Box
                      {...provided.dragHandleProps}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: isSelected ? "#2563eb" : "#9CA3AF",
                        cursor: canReorder ? "grab" : "pointer",
                        "&:active": {
                          cursor: canReorder ? "grabbing" : "pointer",
                        },
                        width: 24,
                        height: 24,
                        flexShrink: 0,
                        ml: 0.5,
                      }}
                    >
                      {canReorder && (
                        <Tooltip title="Drag to reorder">
                          <GripVertical fontSize="small" />
                        </Tooltip>
                      )}
                    </Box>
                  )}

                  {/* Question Number */}
                  {shouldDisplayOrder && (
                    <Typography
                      sx={{
                        fontSize: "1.4rem",
                        fontWeight: 700,
                        color: isSelected ? "#4f46e5" : "#6B7280",
                        width: 20,
                        textAlign: "center",
                        flexShrink: 0,
                      }}
                    >
                      {element.order}
                    </Typography>
                  )}

                  {/* Type Icon */}
                  <Typography
                    sx={{
                      fontSize: "1.2rem",
                      lineHeight: 1,
                      opacity: isSelected ? 1 : 0.9,
                      flexShrink: 0,
                      ml: isSystemScreen ? 2 : 0,
                    }}
                  >
                    {elementIcons[element.type as keyof IconMapping]}
                  </Typography>

                  {/* Question Text */}
                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      overflow: "hidden",
                    }}
                  >
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
                          fontSize: "1rem",
                          fontWeight: 600,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {htmlToPlainText(element.text)}
                      </Typography>
                    </Tooltip>
                  </Box>

                  {/* Menu  */}
                  {canShowMenu && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        ml: 1,
                        flexShrink: 0,
                      }}
                    >
                      <ElementDropDownMenu
                        questionID={element.questionID}
                        isSystemScreen={isSystemScreen}
                      />
                    </Box>
                  )}
                </Box>
              </Box>
            )}
          </Draggable>
        );
      })}
    </Box>
  );
};
