import { useEffect } from "react";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import AddIcon from "@mui/icons-material/Add";
import { Box } from "@mui/material";
import { toast } from "react-toastify";

import {
  useCreateNewOptionMutation,
  useGetOptionsOfQuestionQuery,
  useUpdateOptionOrderMutation,
} from "../../../app/slices/optionApiSlice";
import {
  ErrorData,
  MediaOptionsContainerProps,
  OptionType,
} from "../../../utils/types";

import MediaOption from "./MediaOption";

const MediaOptionsContainer = ({ qID }: MediaOptionsContainerProps) => {
  const { data: options = [] as OptionType[], refetch } =
    useGetOptionsOfQuestionQuery(qID);

  const [createNewOption, { isError, error }] = useCreateNewOptionMutation();
  const [updateOptionOrder] = useUpdateOptionOrderMutation();

  const sensors = useSensors(useSensor(PointerSensor));

  const addMedia = async () => {
    const order = options ? options.length + 1 : 1;

    try {
      if (options.length < 10) {
        const nextCharCode = "A".charCodeAt(0) + options.length;
        const nextChoiceLetter = String.fromCharCode(nextCharCode);

        await createNewOption({
          questionID: qID,
          text: `${nextChoiceLetter}`,
          value: `Choice ${nextChoiceLetter}`,
          order,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = options.findIndex((o) => o.optionID === active.id);
    const newIndex = options.findIndex((o) => o.optionID === over.id);

    const reordered = arrayMove(options, oldIndex, newIndex);
    await updateOptionOrder({
      options: reordered.map((opt, idx) => ({
        optionID: opt.optionID,
        order: idx + 1,
      })),
    })
      .unwrap()
      .then(() => {
        refetch();
      })
      .catch((err) => console.error("Order update error:", err));
  };

  const disable = options.length >= 9;

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
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext
        items={options.map((o) => o.optionID)}
        strategy={rectSortingStrategy}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            alignItems: "stretch",
            gap: { xs: 2, sm: 3, md: 4 },
            width: "80%",
            height: "auto",
            margin: "0 auto",
            padding: 1,
            // border: "2px solid red",
          }}
        >
          {options.map((option) => (
            <MediaOption key={option.optionID} option={option} />
          ))}
          <Box
            component="button"
            onClick={disable ? undefined : addMedia}
            sx={{
              border: "2px dashed #d0d5ff",
              borderRadius: "16px",
              backgroundColor: "rgba(91, 106, 208, 0.02)",
              color: "#5b6ad0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              fontSize: 16,
              fontWeight: 600,
              flex: 1,
              minHeight: { xs: 160, sm: 200, md: 240, xl: 240 },
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "rgba(91, 106, 208, 0.05)",
                borderColor: "#5b6ad0",
                transform: "translateY(-2px)",
              },
            }}
          >
            <AddIcon sx={{ fontSize: 24 }} />
            <span>Add Option</span>
          </Box>
        </Box>{" "}
      </SortableContext>
    </DndContext>
  );
};

export default MediaOptionsContainer;
