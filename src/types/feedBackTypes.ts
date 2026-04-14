export type FeedbackTypeUI =
  | "Feature request"
  | "Bug"
  | "Complaint"
  | "General";

export type FeedbackFormValues = {
  title: string;
  description: string;
};

export interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
}

export interface FeedbackPillsProps {
  feedbackType: FeedbackTypeUI;
  setFeedbackType: (type: FeedbackTypeUI) => void;
  FeedBackPlaceholders: Record<
    FeedbackTypeUI,
    { title: string; description: string }
  >;
}
