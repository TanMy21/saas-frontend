import { useEffect } from "react";

import { resetQuestion } from "../app/slices/elementSlice";
import { resetTypography } from "../app/slices/elementTypographySlice";
import { clearSurveyCanvas } from "../app/slices/surveyCanvasSlice";
import { setElements } from "../app/slices/surveySlice";
import { useAppDispatch } from "../app/typedReduxHooks";

const useSurveyBuilderStateReset = (
  surveyID: string | undefined,
  refetch: () => void
) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!surveyID) return;

    dispatch(clearSurveyCanvas());
    dispatch(setElements([]));
    dispatch(resetQuestion());
    dispatch(resetTypography());

    refetch();
  }, [surveyID]);
};

export default useSurveyBuilderStateReset;
