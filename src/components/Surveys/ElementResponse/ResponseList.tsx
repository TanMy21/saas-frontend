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
import { generateOptionLabel } from "../../../utils/utils";

import ResponseListItem from "./ResponseListItem";

const ResponseList = ({ qID, qType, optionText }: ResponseListProps) => {
  const { data: options = [] as OptionType[] } =
    useGetOptionsOfQuestionQuery(qID);

  const [localOptions, setLocalOptions] = useState<OptionType[]>(options);

  const [createNewOption, { isError, error }] = useCreateNewOptionMutation();
  const [updateOptionOrder] = useUpdateOptionOrderMutation();

  const addResponse = async () => {
    const order = localOptions ? localOptions.length + 1 : 1;

    try {
      if ((localOptions?.length ?? 0) < 10) {
        const label = generateOptionLabel(localOptions?.length ?? 0, qType!);

        await createNewOption({
          questionID: qID,
          text: `${optionText} ${label}`,
          value: `${optionText} ${label}`,
          order,
        }).unwrap();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
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

    await updateOptionOrder({ options: reorderedWithOrder })
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
                    >
                      <ResponseListItem
                        key={option.optionID}
                        qType={qType}
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "83%",
          height: "100%",
          gap: 2,
          // border: "2px solid red",
        }}
      >
        <Button
          onClick={addResponse}
          variant="outlined"
          disabled={(options?.length ?? 0) >= 10}
          startIcon={<MdAdd fontSize={"24px"} />}
          sx={{
            mt: 4,
            py: 1.5,
            borderRadius: 4,
            border: "1px solid #E2E8F0",
            width: "98%",
            color: "#626B77",
            fontWeight: "bold",
            backgroundColor: "#f8f9fc",
            justifyContent: "center",
            textTransform: "none",
            margin: "auto",
            boxShadow: "8px 8px 24px #e0e0e0, -8px -8px 24px #ffffff",
            ml: 2,
            "&:hover": {
              color: "#626B77",
              border: "1px solid #E2E8F0",
              backgroundColor: "#f8f9fc",
              boxShadow: "8px 8px 24px #e0e0e0, -8px -8px 24px #ffffff",
            },
          }}
        >
          Add new {optionText}
        </Button>
      </Box>
    </Box>
  );
};

export default ResponseList;
