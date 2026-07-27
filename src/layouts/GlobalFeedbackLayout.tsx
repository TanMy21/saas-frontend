import { lazy, Suspense } from "react";

import { closeFeedbackModal } from "../app/slices/feedbackSlice";
import { useAppDispatch, useAppSelector } from "../app/typedReduxHooks";

const FeedbackModal = lazy(() => import("../components/Modals/FeedbackModal"));

const GlobalFeedbackOverlays = () => {
  const dispatch = useAppDispatch();

  const { isFeedbackModalOpen } = useAppSelector((state) => state.feedbackUI);

  if (!isFeedbackModalOpen) return null;

  return (
    <>
      <Suspense fallback={null}>
        <FeedbackModal
          open={isFeedbackModalOpen}
          onClose={() => dispatch(closeFeedbackModal())}
        />
      </Suspense>
    </>
  );
};

export default GlobalFeedbackOverlays;
