import { useEffect, useMemo, useRef } from "react";

import { Box } from "@mui/material";
import {
  DragDropContext,
  Droppable,
  type DropResult,
} from "react-beautiful-dnd";

import { useUpdateElementOrderMutation } from "../../../app/slices/elementApiSlice";
import { setElements } from "../../../app/slices/surveySlice";
import { RootState, useAppDispatch } from "../../../app/store";
import { useAppSelector } from "../../../app/typedReduxHooks";
import { useAppTheme } from "../../../theme/useAppTheme";
import { nonOrderableTypes } from "../../../utils/constants";
import { ElementsPanelProps } from "../../../utils/types";

import { ElementsListItem } from "./ElementsListItem";

const ElementsPanel = ({ setQuestionId }: ElementsPanelProps) => {
  const { scrollStyles } = useAppTheme();
  const dispatch = useAppDispatch();
  const [updateElementOrder] = useUpdateElementOrderMutation();

  const elements = useAppSelector(
    (state: RootState) => state.surveyBuilder.elements,
  );

  const scrollRef = useRef<HTMLDivElement | null>(null);

const displayedQuestions = useMemo(() => {
  return [...elements].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}, [elements]);

  // Accelerated auto-scroll while dragging
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let raf: number | null = null;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();

      const edge = 80;
      const maxSpeed = 22;

      let speed = 0;

      if (e.clientY < rect.top + edge) {
        const dist = rect.top + edge - e.clientY;
        speed = -Math.min(maxSpeed, dist / 2.5);
      }

      if (e.clientY > rect.bottom - edge) {
        const dist = e.clientY - (rect.bottom - edge);
        speed = Math.min(maxSpeed, dist / 2.5);
      }

      if (speed !== 0) el.scrollTop += speed;

      raf = requestAnimationFrame(() => handleMove(e));
    };

    const start = (e: MouseEvent) => {
      if (raf === null) {
        raf = requestAnimationFrame(() => handleMove(e));
      }
    };

    const stop = () => {
      if (raf !== null) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    };

    window.addEventListener("dragover", start);
    window.addEventListener("drop", stop);
    window.addEventListener("mouseup", stop);

    return () => {
      window.removeEventListener("dragover", start);
      window.removeEventListener("drop", stop);
      window.removeEventListener("mouseup", stop);
    };
  }, []);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;
    if (source.index === destination.index) return;

    const questions = displayedQuestions.filter(
      (el) => !nonOrderableTypes.includes(el.type),
    );

    const dragged = displayedQuestions[source.index];
    const target = displayedQuestions[destination.index];

    if (!dragged || !target) return;
    if (nonOrderableTypes.includes(dragged.type)) return;
    if (nonOrderableTypes.includes(target.type)) return;

    const sourceIndex = questions.findIndex(
      (q) => q.questionID === dragged.questionID,
    );

    const destinationIndex = questions.findIndex(
      (q) => q.questionID === target.questionID,
    );

    if (sourceIndex === -1 || destinationIndex === -1) return;

    const reordered = [...questions];
    const [moved] = reordered.splice(sourceIndex, 1);
    reordered.splice(destinationIndex, 0, moved);

    const updatedQuestions = reordered.map((q, index) => ({
      ...q,
      order: index + 1,
    }));

    updateElementOrder({ questions: updatedQuestions })
      .unwrap()
      .then(() => {
        const systemElements = elements.filter((el) =>
          nonOrderableTypes.includes(el.type),
        );

        const updated = [...systemElements, ...updatedQuestions].sort(
          (a, b) => (a.order ?? 0) - (b.order ?? 0),
        );

        dispatch(setElements(updated));
      })
      .catch((err) => {
        console.error("Order update error:", err);
      });
  };


  return (
    <>
      {elements.length === 0 ? null : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="elements">
            {(provided, snapshot) => (
              <Box
                ref={(node: HTMLDivElement | null) => {
                  provided.innerRef(node);
                  scrollRef.current = node;
                }}
                {...provided.droppableProps}
                sx={{
                  overflowY: "auto",
                  overflowX: "hidden",
                  maxWidth: { md: "100%", lg: "100%", xl: "100%" },
                  maxHeight: "98%",
                  backgroundColor: snapshot.isDraggingOver
                    ? "#F8FAFF"
                    : "transparent",
                  transition: "background-color 0.2s ease",
                  minHeight: snapshot.isDraggingOver
                    ? displayedQuestions.length * 56 + 40
                    : undefined,
                  ...scrollStyles.elementsPanel,
                }}
              >
                <ElementsListItem
                  setQuestionId={setQuestionId!}
                  displayedQuestions={displayedQuestions}
                  nonOrderableTypes={nonOrderableTypes}
                />

                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </>
  );
};
export default ElementsPanel;
