import { shouldTrackEvent } from "../utils/utils";

export const useTrackedEvent = (trackShareEvent: any, surveyID: string) => {
  return (actionType: string) => {
    const key = `share-${surveyID}-${actionType}`;

    const shouldTrack = shouldTrackEvent(key);

    console.log("TRACK CHECK:", {
      key,
      shouldTrack,
    });

    if (!shouldTrack) return;

    console.log("🚀 TRACKING EVENT:", actionType);

    trackShareEvent({
      surveyID,
      actionType,
    })
      .unwrap()
      .catch((err: any) => {
        console.error("TRACK Event FAILED:", err);
      });
  };
};
