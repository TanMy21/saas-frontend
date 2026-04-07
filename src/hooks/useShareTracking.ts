export const useShareTracking = (trackShareEvent: any, surveyID: string) => {
  return (actionType: string) => {
    trackShareEvent({
      surveyID,
      actionType,
    })
      .unwrap()
      .catch((err: any) => {
        console.error("TRACK share FAILED:", err);
      });
  };
};
