export interface ShareTabProps {
  title?: string;
  shareURL: string;
  shareID?: string;
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  trackShareEvent: (args: { surveyID: string; actionType: string }) => void;
}
