import { Box, IconButton, TextField, Typography } from "@mui/material";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { MdAdd } from "react-icons/md";

import { ConceptFitStimulusLayoutProps } from "../../../types/surveyBuilderTypes";
import {
  MAX_CONCEPT_ATTRIBUTES,
  MIN_RECOMMENDED_ATTRIBUTES,
} from "../../../utils/constants";

import { ConceptAttributeRow } from "./ConceptAttributeRow";
import { ConceptFitPreview } from "./ConceptFitPreview";

export const ConceptFitAttributeManager = ({
  qID,
  localOptions,
  inputValue,
  textareaRef,
  canCreate,
  canEdit,
  canDelete,
  canReorder,
  canAddMore,
  hasMinimumRecommended,
  setInputValue,
  handleAddAttributes,
  handleDeleteAttribute,
  handleDragEnd,
}: ConceptFitStimulusLayoutProps) => {
  return (
    <>
      <ConceptFitPreview firstAttribute={localOptions[0]?.text} />

      <Typography
        sx={{
          fontSize: 13,
          color: hasMinimumRecommended ? "#64748B" : "#B45309",
          textAlign: "right",
        }}
      >
        {localOptions.length}/{MAX_CONCEPT_ATTRIBUTES} attributes
        {!hasMinimumRecommended
          ? ` · Recommended minimum: ${MIN_RECOMMENDED_ATTRIBUTES}`
          : ""}
      </Typography>

      <Box
        sx={{
          // border: "1px solid #E2E8F0",
          borderRadius: 2,
          bgcolor: "#F8FAFC",
          p: 1.5,
          maxHeight: 340,

          // Allows scrolling when content is taller than maxHeight.
          overflowY: "auto",
          overflowX: "hidden",

          // Firefox: hides scrollbar but keeps scroll behavior.
          scrollbarWidth: "none",

          // IE/old Edge: hides scrollbar but keeps scroll behavior.
          msOverflowStyle: "none",

          // Chrome/Safari/Edge: hides scrollbar but keeps scroll behavior.
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <DragDropContext
          onDragEnd={(result) => {
            if (!canReorder) return;
            handleDragEnd(result);
          }}
        >
          <Droppable droppableId={`concept-fit-attributes-${qID}`}>
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
                {localOptions.map((option, index) => (
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
                        <ConceptAttributeRow
                          option={option}
                          index={index}
                          canReorder={canReorder}
                          canEdit={canEdit}
                          canDelete={canDelete}
                          onDelete={handleDeleteAttribute}
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

        {localOptions.length === 0 && (
          <Typography
            sx={{
              fontSize: 14,
              color: "#64748B",
              textAlign: "center",
              py: 3,
            }}
          >
            Add attribute words like Premium, Elegant, Cheap, or Trustworthy.
          </Typography>
        )}
      </Box>

      {canCreate && (
        <Box
          sx={{
            position: "relative",
            width: "94%",
            mx:"auto",
            px: 1,
            pt: 0.75,
            pb: 0.75,
            // border: "1px solid #E2E8F0",
            // borderRadius: 2,
            bgcolor: "#FFFFFF",
          }}
        >
          <TextField
            multiline
            minRows={1}
            disabled={!canAddMore}
            inputRef={textareaRef}
            placeholder="Type or paste attributes, one per line…"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: {
                bgcolor: "transparent",
                lineHeight: 1.6,
                fontSize: 15,
                color: "inherit",
                pr: 5,
              },
            }}
            sx={{
              width: "100%",
              "& .MuiInputBase-root": {
                bgcolor: "transparent",
              },
            }}
          />

          <IconButton
            onClick={handleAddAttributes}
            disabled={!canAddMore || inputValue.trim() === ""}
            aria-label="Add concept fit attributes"
            sx={{
              position: "absolute",
              right: 8,
              bottom: 7,
              width: 34,
              height: 34,
              borderRadius: "50%",
              bgcolor: "#0891B2",
              color: "white",
              boxShadow: "0 6px 16px rgba(8,145,178,0.25)",
              "&:hover": { bgcolor: "#0E7490" },
              "&.Mui-disabled": {
                bgcolor: "#CBD5E1",
                color: "white",
              },
            }}
          >
            <MdAdd size={20} />
          </IconButton>
        </Box>
      )}
    </>
  );
};
