import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Box } from "@mui/material";
import {
  DragDropContext,
  Droppable,
  type DropResult,
} from "react-beautiful-dnd";

import { useUpdateElementOrderMutation } from "../../../app/slices/elementApiSlice";
import { clearAiQuestionsJustAdded } from "../../../app/slices/generateSurveyQuestionSlice";
import { setElements } from "../../../app/slices/surveySlice";
import { RootState, useAppDispatch } from "../../../app/store";
import { useAppSelector } from "../../../app/typedReduxHooks";
import useAuth from "../../../hooks/useAuth";
import { useAppTheme } from "../../../theme/useAppTheme";
import {
  ELEMENTS_PANEL_AUTO_SCROLL_EDGE_SIZE,
  ELEMENTS_PANEL_AUTO_SCROLL_MAX_SPEED,
  nonOrderableTypes,
} from "../../../utils/constants";
import { createDisplayOrderMap } from "../../../utils/elementsDisplayOrder";

import { ElementsListItem } from "./ElementsListItem";

const ElementsPanel = () => {
  const { scrollStyles } = useAppTheme();
  const { can } = useAuth();
  const dispatch = useAppDispatch();
  const [updateElementOrder, { isLoading: isReorderSaving }] =
    useUpdateElementOrderMutation();
  const [newQuestionIds, setNewQuestionIds] = useState<Set<string>>(new Set());

  const [isDragging, setIsDragging] = useState(false);

  const aiQuestionsJustAdded = useAppSelector(
    (state: RootState) => state.generateQuestionUI.aiQuestionsJustAdded,
  );

  const elements = useAppSelector(
    (state: RootState) => state.surveyBuilder.elements,
  );

  const prevLengthRef = useRef(elements.length);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const dragPointerYRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const autoScrollFrameRef = useRef<number | null>(null);

  const displayedQuestions = useMemo(() => {
    return [...elements].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [elements]);

  /**
   * Maps each numbered question/test to its visible display number.
   * Non-numbered screens like INFO_SCREEN are skipped.
   */
  const displayOrderMap = useMemo(() => {
    return createDisplayOrderMap(displayedQuestions);
  }, [displayedQuestions]);

  useEffect(() => {
    if (!aiQuestionsJustAdded) return;

    if (elements.length <= prevLengthRef.current) return;

    const added = elements.slice(prevLengthRef.current);
    const ids = new Set(added.map((q) => q.questionID));

    setNewQuestionIds(ids);

    const t = setTimeout(() => {
      setNewQuestionIds(new Set());
      dispatch(clearAiQuestionsJustAdded());
    }, 1500);

    prevLengthRef.current = elements.length;

    return () => clearTimeout(t);
  }, [elements, aiQuestionsJustAdded, dispatch]);

  useEffect(() => {
    prevLengthRef.current = elements.length;
  }, [elements]);

  /**
   * Calculates and applies vertical auto-scroll when the active drag pointer
   * is close to the top or bottom edge of the Elements panel.
   */
  const runAutoScroll = useCallback(() => {
    const scrollContainer = scrollRef.current;
    const pointerY = dragPointerYRef.current;

    if (!isDraggingRef.current || !scrollContainer || pointerY === null) {
      autoScrollFrameRef.current = null;
      return;
    }

    const bounds = scrollContainer.getBoundingClientRect();

    const topEdge = bounds.top + ELEMENTS_PANEL_AUTO_SCROLL_EDGE_SIZE;
    const bottomEdge = bounds.bottom - ELEMENTS_PANEL_AUTO_SCROLL_EDGE_SIZE;

    let scrollDelta = 0;

    /**
     * Scroll upward when the pointer is near the top edge.
     * The closer the pointer is to the edge, the faster the scroll.
     */
    if (pointerY < topEdge) {
      const distanceIntoEdge = topEdge - pointerY;
      const intensity = Math.min(
        distanceIntoEdge / ELEMENTS_PANEL_AUTO_SCROLL_EDGE_SIZE,
        1,
      );

      scrollDelta = -Math.ceil(
        ELEMENTS_PANEL_AUTO_SCROLL_MAX_SPEED * intensity,
      );
    }

    /**
     * Scroll downward when the pointer is near the bottom edge.
     * The closer the pointer is to the edge, the faster the scroll.
     */
    if (pointerY > bottomEdge) {
      const distanceIntoEdge = pointerY - bottomEdge;
      const intensity = Math.min(
        distanceIntoEdge / ELEMENTS_PANEL_AUTO_SCROLL_EDGE_SIZE,
        1,
      );

      scrollDelta = Math.ceil(ELEMENTS_PANEL_AUTO_SCROLL_MAX_SPEED * intensity);
    }

    if (scrollDelta !== 0) {
      scrollContainer.scrollTop += scrollDelta;
    }

    autoScrollFrameRef.current = requestAnimationFrame(runAutoScroll);
  }, []);

  /**
   * Tracks the active drag pointer so edge auto-scroll can continue even when
   * the pointer remains still near the top or bottom edge.
   */
  /**
   * Tracks pointer movement while a question is being dragged.
   * Capturing listeners help preserve tracking while drag-and-drop owns events.
   */
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (event: MouseEvent) => {
      dragPointerYRef.current = event.clientY;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];

      if (touch) {
        dragPointerYRef.current = touch.clientY;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, true);
    window.addEventListener("touchmove", handleTouchMove, true);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove, true);
      window.removeEventListener("touchmove", handleTouchMove, true);
    };
  }, [isDragging]);

  /**
   * Starts edge auto-scrolling when a draggable survey element is picked up.
   */
  const handleDragStart = () => {
    isDraggingRef.current = true;
    setIsDragging(true);

    if (autoScrollFrameRef.current === null) {
      autoScrollFrameRef.current = requestAnimationFrame(runAutoScroll);
    }
  };

  /**
   * Stops edge auto-scroll and clears the active pointer state.
   */
  const stopAutoScroll = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
    dragPointerYRef.current = null;

    if (autoScrollFrameRef.current !== null) {
      cancelAnimationFrame(autoScrollFrameRef.current);
      autoScrollFrameRef.current = null;
    }
  };

  /**
   * Persists the new question ordering after a valid drag-and-drop action.
   */
  const onDragEnd = (result: DropResult) => {
    stopAutoScroll();

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

    const previousElements = elements;

    const systemElements = elements.filter((el) =>
      nonOrderableTypes.includes(el.type),
    );

    const updated = [...systemElements, ...updatedQuestions].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0),
    );

    dispatch(setElements(updated));

    updateElementOrder({ questions: updatedQuestions })
      .unwrap()
      .catch((err) => {
        console.error("Order update error:", err);
        dispatch(setElements(previousElements));
      });
  };

  return (
    <>
      {elements.length === 0 ? null : (
        <DragDropContext
          onDragStart={handleDragStart}
          onDragEnd={can("REORDER_QUESTION") ? onDragEnd : stopAutoScroll}
        >
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
                  maxHeight: "100%",
                  backgroundColor: snapshot.isDraggingOver
                    ? "#F8FAFF"
                    : "transparent",
                  transition: "background-color 0.2s ease",
                  minHeight: 0,
                  ...scrollStyles.elementsPanel,
                }}
              >
                <ElementsListItem
                  displayedQuestions={displayedQuestions}
                  nonOrderableTypes={nonOrderableTypes}
                  newQuestionIds={newQuestionIds}
                  displayOrderMap={displayOrderMap}
                  isReorderSaving={isReorderSaving}
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
