import { shouldTrackEvent } from "../utils/utils";

export const useTrackedEvent = (
  batchedTrack: (actionType: string) => void,
  surveyID: string,
) => {
  return (actionType: string) => {
    const key = `share-${surveyID}-${actionType}`;

    const shouldTrack = shouldTrackEvent(key);

    if (!shouldTrack) return;

    batchedTrack(actionType);
  };
};
