export interface ShareTabProps {
  title?: string;
  shareURL: string;
  shareID?: string;
  surveyID?: string;
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  trackShareEvent: (args: { surveyID: string; actionType: string }) => void;
}


export type TabType = "link" | "email" | "embed";