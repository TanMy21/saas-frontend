import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import {
  useCreateNewOptionMutation,
  useGetOptionsOfQuestionQuery,
  useUpdateOptionOrderMutation,
} from "../app/slices/optionApiSlice";
import { MAX_OPTIONS, SOFT_EDIT_MESSAGES } from "../utils/constants";
import { showToast } from "../utils/showToast";
import { OptionType } from "../utils/types";

import useAuth from "./useAuth";
import { useSurveyEditLock } from "./useSurveyEditLock";
import { useToast } from "./useToast";

const useMediaOptions = (qID: string) => {
  const { can } = useAuth();
  const { confirmSoftEdit } = useSurveyEditLock();

  const canCreate = can("CREATE_OPTION");
  const canReorder = can("REORDER_OPTION");

  const { data: options = [] as OptionType[], refetch } =
    useGetOptionsOfQuestionQuery(qID);

  const [createNewOption, { isError, error }] = useCreateNewOptionMutation();
  const [updateOptionOrder] = useUpdateOptionOrderMutation();

  const addDisabled = options.length >= MAX_OPTIONS;

  useToast({
    isError,
    error,
    errorFallbackMessage: "Something went wrong.",
  });

  const addMedia = async () => {
    if (!canCreate) return;
    if (!(await confirmSoftEdit(SOFT_EDIT_MESSAGES.OPTION_CHANGE))) return;

    if (options.length >= MAX_OPTIONS) {
      showToast.info("Limit reached. You can add up to 10 options.");
      return;
    }

    const nextCharCode = "A".charCodeAt(0) + options.length;
    const nextChoiceLetter = String.fromCharCode(nextCharCode);

    try {
      await createNewOption({
        questionID: qID,
        options: [
          { text: nextChoiceLetter, value: `Choice ${nextChoiceLetter}` },
        ],
      }).unwrap();

      await refetch();
    } catch (err) {
      console.error("Add media option error:", err);
      showToast.error("Failed to add option.");
    }
  };

  const onDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!canReorder) return;
    if (!over || active.id === over.id) return;

    const oldIndex = options.findIndex(
      (option) => option.optionID === active.id,
    );
    const newIndex = options.findIndex((option) => option.optionID === over.id);

    const reordered = arrayMove(options, oldIndex, newIndex);

    await updateOptionOrder({
      options: reordered.map((option, index) => ({
        optionID: option.optionID,
        order: index + 1,
      })),
    })
      .unwrap()
      .then(() => refetch())
      .catch((err) => console.error("Order update error:", err));
  };

  return {
    options,
    canCreate,
    addDisabled,
    addMedia,
    onDragEnd,
  };
};

export default useMediaOptions;
