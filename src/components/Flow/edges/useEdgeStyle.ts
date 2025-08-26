import { useEffect, useState } from "react";

import { EdgeStyle } from "../../../utils/types";

export function useEdgeStyle(surveyID?: string) {
  const storageKey = surveyID ? `flow:edgeStyle:${surveyID}` : "flow:edgeStyle";
  const [edgeStyle, setEdgeStyle] = useState<EdgeStyle>(() => {
    return (localStorage.getItem(storageKey) as EdgeStyle) || "step";
  });

  useEffect(() => {
    localStorage.setItem(storageKey, edgeStyle);
  }, [edgeStyle, storageKey]);

  return { edgeStyle, setEdgeStyle };
}
