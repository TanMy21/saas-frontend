import { useState } from "react";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { Box } from "@mui/material";

import useMediaOptions from "../../../hooks/useMediaOptions";
import { MediaOptionsContainerProps } from "../../../utils/types";

import AddMediaOptionCard from "./AddMediaOptionCard";
import MediaOption from "./MediaOption";

const MediaOptionsContainer = ({
  qID,
  display,
}: MediaOptionsContainerProps) => {
  const { options, canCreate, addDisabled, addMedia, onDragEnd } =
    useMediaOptions(qID);

  const [selectedOptionID, setSelectedOptionID] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext
        items={options.map((option) => option.optionID)}
        strategy={rectSortingStrategy}
      >
        <Box
          component="div"
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: display === "mobile" ? "1fr" : "repeat(2, 1fr)",
              md: display === "mobile" ? "1fr" : "repeat(3, 1fr)",
            },
            alignItems: "stretch",
            gap: { xs: 2, sm: 3, md: 4 },
            width: { md: "96%", xl: "92%" },
            height: "auto",
            margin: "0 auto",
            padding: 1,
            "@media (max-width: 900px)": {
              gridTemplateColumns: "repeat(2, 1fr)",
            },
            "@media (max-width: 600px)": {
              gridTemplateColumns: "1fr",
            },
          }}
        >
          {options.map((option) => (
            <MediaOption
              key={option.optionID}
              option={option}
              isSelected={selectedOptionID === option.optionID}
              onSelect={() => setSelectedOptionID(option.optionID)}
            />
          ))}

          {canCreate && (
            <AddMediaOptionCard
              disabled={addDisabled}
              onClick={() => void addMedia()}
            />
          )}
        </Box>
      </SortableContext>
    </DndContext>
  );
};
export default MediaOptionsContainer;
