import { useEffect, useRef } from "react";

export const useBatchedTracking = (trackBatchEvent: any, surveyID: string) => {
  const queueRef = useRef<{ actionType: string }[]>([]);

  const track = (actionType: string) => {
    queueRef.current.push({ actionType });
  };

  const flush = async () => {
    if (!queueRef.current.length) return;

    const events = [...queueRef.current];
    queueRef.current = [];

    try {
      await trackBatchEvent({
        surveyID,
        events,
      }).unwrap();
    } catch (err) {
      console.error("Batch tracking failed:", err);

      // re-add events if failed
      queueRef.current.unshift(...events);
    }
  };

  useEffect(() => {
    const interval = setInterval(flush, 8000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleUnload = () => {
      if (!queueRef.current.length) return;

      try {
        fetch(`${import.meta.env.VITE_BASE_URL}/s/share-event`, {
          method: "POST",
          body: JSON.stringify({
            surveyID,
            events: queueRef.current,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          keepalive: true,
        });
      } catch (err) {
        console.error("keepalive request failed:", err);
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);
  return track;
};
