import { Box, Typography } from "@mui/material";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import { DropdownOptionManagerProps } from "../../../types/optionTypes";

import { DropdownOptionRow } from "./DropdownOptionRow";

export const DropdownOptionManager = ({
  qID,
  options,
  canReorder,
  canEdit,
  canDelete,
  onDragEnd,
  onDelete,
}: DropdownOptionManagerProps) => {
  return (
    <Box
      sx={{
        border: "1px solid #E2E8F0",
        borderRadius: 2,
        bgcolor: "#F8FAFC",
        p: 1.5,
        maxHeight: 340,
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <DragDropContext
        onDragEnd={(result) => {
          if (!canReorder) return;
          onDragEnd(result);
        }}
      >
        <Droppable droppableId={`dropdown-options-${qID}`}>
          {(provided) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              {options.map((option, index) => (
                <Draggable
                  key={option.optionID}
                  draggableId={option.optionID}
                  index={index}
                  isDragDisabled={!canReorder}
                >
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{
                        outline: "none",
                        "&:focus": { outline: "none" },
                        "&:focus-visible": { outline: "none" },
                      }}
                    >
                      <DropdownOptionRow
                        option={option}
                        index={index}
                        canReorder={canReorder}
                        canEdit={canEdit}
                        canDelete={canDelete}
                        onDelete={onDelete}
                      />
                    </Box>
                  )}
                </Draggable>
              ))}

              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>

      {options.length === 0 && (
        <Typography
          sx={{
            fontSize: 14,
            color: "#64748B",
            textAlign: "center",
            py: 3,
          }}
        >
          No dropdown options yet.
        </Typography>
      )}
    </Box>
  );
};
