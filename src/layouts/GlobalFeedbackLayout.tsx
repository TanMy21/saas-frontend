import { closeFeedbackModal } from "../app/slices/feedbackSlice";
import { useAppDispatch, useAppSelector } from "../app/typedReduxHooks";
import FeedbackModal from "../components/Modals/FeedbackModal";

const GlobalFeedbackOverlays = () => {
  const dispatch = useAppDispatch();

  const { isFeedbackModalOpen } = useAppSelector((state) => state.feedbackUI);

  return (
    <>
      <FeedbackModal
        open={isFeedbackModalOpen}
        onClose={() => dispatch(closeFeedbackModal())}
      />
    </>
  );
};

export default GlobalFeedbackOverlays;
