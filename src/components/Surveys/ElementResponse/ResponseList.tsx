import { useEffect, useRef, useState } from "react";

import { Box, IconButton, TextField, Typography } from "@mui/material";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "react-beautiful-dnd";
import { MdAdd } from "react-icons/md";
import { toast } from "react-toastify";

import {
  useCreateNewOptionMutation,
  useGetOptionsOfQuestionQuery,
  useUpdateOptionOrderMutation,
} from "../../../app/slices/optionApiSlice";
import { OptionType, ResponseListProps } from "../../../utils/types";
import { MAX_OPTIONS } from "../../../utils/utils";

import ResponseListItem from "./ResponseListItem";

const ResponseList = ({
  qID,
  qType,
  optionText,
  display,
}: ResponseListProps) => {
  const { data: options = [] as OptionType[] } =
    useGetOptionsOfQuestionQuery(qID);

  const [localOptions, setLocalOptions] = useState<OptionType[]>(options);

  const [createNewOption, { isError, error }] = useCreateNewOptionMutation();
  const [updateOptionOrder] = useUpdateOptionOrderMutation();

  // ---- minimal "text add" input (blends with parent) ----
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // auto-resize the multiline input
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [inputValue]);

  // Always send options as an array (even if single line)
  const handleAddOptions = async () => {
    const lines = inputValue
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length === 0) return;

    const available = MAX_OPTIONS - (localOptions?.length ?? 0);
    if (available <= 0) {
      toast.info("Limit reached (10 options).");
      return;
    }

    const batch = lines
      .slice(0, available)
      .map((text) => ({ text, value: text }));

    try {
      await createNewOption({ questionID: qID, options: batch }).unwrap();
      setInputValue("");
      if (lines.length > available) {
        toast.info(`Only ${available} option(s) added (limit reached).`);
      }
    } catch (err) {
      console.error("Add options error:", err);
      toast.error("Failed to add options.");
    }
  };

  // DnD reorder (unchanged)
  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;

    const reordered = Array.from(localOptions);
    const [moved] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, moved);

    const reorderedWithOrder = reordered.map((option, idx) => ({
      ...option,
      order: idx + 1,
    }));

    setLocalOptions(reorderedWithOrder);

    await updateOptionOrder({ options: reorderedWithOrder })
      .unwrap()
      .catch((err) => console.error("Order update error:", err));
  };

  // sync RTK → local
  useEffect(() => {
    setLocalOptions(options);
  }, [options]);

  // existing error surfacing
  useEffect(() => {
    if (!isError) return;
    const errData: any = error;
    if (Array.isArray(errData?.data?.error)) {
      errData.data.error.forEach((el: any) =>
        toast.error(el.message, { position: "top-right" })
      );
    } else if (errData?.data?.message) {
      toast.error(errData.data.message, { position: "top-right" });
    } else {
      toast.error("Something went wrong.", { position: "top-right" });
    }
  }, [isError, error]);

  return (
    <Box
      sx={{
        transformOrigin: "bottom",
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: display === "mobile" ? "100%" : "80%",
          margin: "auto",
          padding: display === "mobile" ? 0 : 2,
          gap: 2,
        }}
      >
        {/* LIST */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "0 auto",
            width: display === "mobile" ? "92%" : "100%",
            padding: 1,
          }}
        >
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="responses">
              {(provided) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: display === "mobile" ? "92%" : "80%",
                    gap: 2,
                  }}
                >
                  {localOptions?.map((option, index) => (
                    <Draggable
                      key={option.optionID}
                      draggableId={option.optionID}
                      index={index}
                    >
                      {(provided) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{
                            outline: "none",
                            border: "none",
                            "&:focus": {
                              outline: "none",
                              border: "none",
                            },
                            "&:focus-visible": {
                              outline: "none",
                              border: "none",
                            },
                          }}
                        >
                          <ResponseListItem
                            key={option.optionID}
                            qType={qType}
                            response={option}
                            index={index}
                            display={display}
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
        </Box>

        {/* TEXT ADD (blends into parent; no borders/extra styles) */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "0 auto",
            width: display === "mobile" ? "92%" : "100%",
            padding: 1,
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: display === "mobile" ? "92%" : "80%",
              // no border, bg, or shadow to blend with parent
              px: 0,
              pt: 0.5,
              pb: 0.5,
            }}
          >
            <TextField
              multiline
              minRows={1}
              inputRef={textareaRef}
              placeholder="Type an option, press Enter for another…"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={(localOptions?.length ?? 0) >= MAX_OPTIONS}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: {
                  bgcolor: "transparent",
                  lineHeight: 1.6,
                  fontSize: 16,
                  color: "inherit", // inherit to blend
                  px: 0, // remove paddings to blend
                },
              }}
              sx={{
                width: "100%",
                "& .MuiInputBase-root": {
                  bgcolor: "transparent",
                },
              }}
            />

            {/* Only styled element: Add icon button */}
            <IconButton
              onClick={handleAddOptions}
              disabled={
                (localOptions?.length ?? 0) >= MAX_OPTIONS ||
                inputValue.trim() === ""
              }
              aria-label="Add options"
              sx={{
                position: "absolute",
                right: 0,
                bottom: -6,
                width: 36,
                height: 36,
                borderRadius: "50%",
                bgcolor: "#4F46E5",
                color: "white",
                boxShadow: "0 6px 16px rgba(79,70,229,0.25)",
                "&:hover": { bgcolor: "#4338CA" },
                "&.Mui-disabled": {
                  bgcolor: "#CBD5E1",
                  color: "white",
                },
              }}
            >
              <MdAdd size={20} />
            </IconButton>
          </Box>

          {/* Count line */}
          <Box sx={{ width: display === "mobile" ? "92%" : "80%", mt: "2%" }}>
            <Typography
              variant="body2"
              sx={{ color: "#64748B", textAlign: "right" }}
            >
              {localOptions?.length ?? 0}/{MAX_OPTIONS} options
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ResponseList;
