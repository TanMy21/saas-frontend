import { useEffect, useState } from "react";

import { Box, Button } from "@mui/material";
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
import { ErrorData, OptionType, ResponseListProps } from "../../../utils/types";

import ResponseListItem from "./ResponseListItem";

const ResponseList = ({ qID }: ResponseListProps) => {
  const { data: options = [] as OptionType[] } =
    useGetOptionsOfQuestionQuery(qID);
  const [localOptions, setLocalOptions] = useState<OptionType[]>(options);

  const [createNewOption, { isError, error }] = useCreateNewOptionMutation();
  const [updateOptionOrder] = useUpdateOptionOrderMutation();

  const addResponse = async () => {
    const order = localOptions ? localOptions.length + 1 : 1;

    try {
      if (localOptions.length < 10) {
        const nextInstructionNumber = localOptions.length + 1;

        await createNewOption({
          questionID: qID,
          text: `Instruction ${nextInstructionNumber}`,
          value: `Instruction ${nextInstructionNumber}`,
          order,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;

    const reordered = Array.from(localOptions);
    const [moved] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, moved);

    // Update order locally
    const reorderedWithOrder = reordered.map((option, idx) => ({
      ...option,
      order: idx + 1,
    }));

    setLocalOptions(reorderedWithOrder);

    updateOptionOrder({ options: reorderedWithOrder })
      .unwrap()
      .then()
      .catch((err) => console.error("Order update error:", err));
  };

  useEffect(() => {
    setLocalOptions(options);
  }, [options]);

  useEffect(() => {
    if (isError) {
      const errorData = error as ErrorData;
      if (Array.isArray(errorData.data.error)) {
        errorData.data.error.forEach((el) =>
          toast.error(el.message, {
            position: "top-right",
          })
        );
      } else {
        toast.error(errorData.data.message, {
          position: "top-right",
        });
      }
    }
  }, [isError, error, options]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "80%",
        height: "100%",
        margin: "auto",
        padding: 2,
        gap: 2,
        // border: "2px solid green",
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
                width: "80%",
                height: "100%",
                gap: 2,
                // border: "2px solid red",
              }}
            >
              {localOptions.map((option, index) => (
                <Draggable
                  key={option.optionID}
                  draggableId={option.optionID}
                  index={index}
                >
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps} // attach to full item or grip
                    >
                      <ResponseListItem
                        key={option.optionID}
                        response={option}
                        index={index}
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
      <Button
        onClick={addResponse}
        variant="outlined"
        disabled={options.length >= 10}
        startIcon={<MdAdd fontSize={"24px"} />}
        sx={{
          mt: 4,
          py: 1.5,
          borderStyle: "dashed",
          borderColor: "grey.300",
          borderRadius: 2,
          width: "100%",
          color: "grey.600",
          justifyContent: "center",
          textTransform: "none",
          "&:hover": {
            color: "primary.main",
            borderColor: "primary.light",
            backgroundColor: "primary.lighter",
          },
        }}
      >
        Add New Instruction
      </Button>
    </Box>
  );
};

export default ResponseList;
