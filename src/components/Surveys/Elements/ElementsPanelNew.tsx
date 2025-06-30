import { useCallback } from "react";

import { Box } from "@mui/material";
import debounce from "lodash/debounce";
import {
  DragDropContext,
  Droppable,
  type DropResult,
} from "react-beautiful-dnd";

import { useUpdateElementOrderMutation } from "../../../app/slices/elementApiSlice";
import { RootState } from "../../../app/store";
import { useAppSelector } from "../../../app/typedReduxHooks";
import { useAppTheme } from "../../../theme/useAppTheme";
import { ElementsPanelProps, Element } from "../../../utils/types";

import ElementsListItem from "./ElementsListItem";

const ElementsPanel = ({ setQuestionId }: ElementsPanelProps) => {
  const { scrollStyles } = useAppTheme();
  const [updateElementOrder /*{ isError, error }*/] =
    useUpdateElementOrderMutation();

  const elements = useAppSelector(
    (state: RootState) => state.surveyBuilder.elements
  );

  const nonOrderableTypes = [
    "WELCOME_SCREEN",
    "END_SCREEN",
    "INSTRUCTIONS",
    "EMAIL_CONTACT",
  ];
  let isNonOrderableType;

  const elementStartTypes = ["WELCOME_SCREEN", "INSTRUCTIONS", "EMAIL_CONTACT"];
  const orderedElementTypes = [
    "BINARY",
    "MEDIA",
    "MULTIPLE_CHOICE",
    "NUMBER",
    "RADIO",
    "RANGE",
    "RANK",
    "TEXT",
  ];

  const startElementTypeOrder: { [key: string]: number } = {
    "WELCOME_SCREEN": 1,
    "INSTRUCTIONS": 2,
    "EMAIL_CONTACT": 3,
  };

  const startElements = elements
    .filter((q) => elementStartTypes.includes(q.type))
    .sort(
      (a, b) => startElementTypeOrder[a.type] - startElementTypeOrder[b.type]
    );
  const orderedElements = elements
    .filter((e) => orderedElementTypes.includes(e.type))
    .sort((a, b) => a.order! - b.order!);

  const endElements = elements.filter((e) => e.type === "END_SCREEN");

  const displayedQuestions = [
    ...startElements,
    ...orderedElements,
    ...endElements,
  ];

  const debounceUpdateOrder = useCallback(
    debounce((newElements) => {
      const orderedElements = newElements
        .filter((e: Element) => orderedElementTypes.includes(e.type))
        .map((e: Element, index: number) => ({ ...e, order: index + 1 }));
      updateElementOrder({ questions: orderedElements })
        .unwrap()
        .then((response) => console.log("Order update response:", response))
        .catch((error) => console.error("Order update error:", error));
    }, 500),
    [updateElementOrder]
  );

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    if (source.index === destination.index) {
      return;
    }
    const newElements = Array.from(displayedQuestions);
    const [moved] = newElements.splice(source.index, 1);
    newElements.splice(destination.index, 0, moved);
    // setElements(newElements);

    // Reorder elements
    const reorderedElements = newElements.map((el, index) => {
      if (orderedElementTypes.includes(el.type)) {
        return { ...el, order: index + 1 };
      }
      return el;
    });

    debounceUpdateOrder(reorderedElements);
  };

  return (
    <Box
      sx={{
        overflowY: "auto",
        overflowX: "hidden",
        maxWidth: { md: "100%", lg: "100%", xl: "100%" },
        maxHeight: "98%",
        ...scrollStyles.elementsPanel,
      }}
    >
      {elements.length === 0 ? null : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="elements">
            {(provided) => (
              <ElementsListItem
                provided={provided}
                setQuestionId={setQuestionId!}
                displayedQuestions={displayedQuestions}
                nonOrderableTypes={nonOrderableTypes}
              />
            )}
          </Droppable>
        </DragDropContext>
      )}
    </Box>
  );
};

export default ElementsPanel;
