import { useEffect, useRef, useState } from "react";

import { safeCopyText } from "../utils/utils";

export const useShareCopyHandler = (
  setOpenSnackbar: (val: boolean) => void,
  track?: (actionType: string) => void,
) => {
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const [status, setStatus] = useState<"idle" | "copying" | "copied">("idle");

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clear = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const triggerCopied = (key: string) => {
    clear();

    setCopied(key);
    setStatus("copied"); 

    setOpenSnackbar(true);

    timeoutRef.current = setTimeout(() => {
      setCopied(null);
      setStatus("idle"); 
    }, 2000);
  };

  const copy = async (value: string, key: string, actionType?: string) => {
    if (!value) return;

    setLoadingKey(key);
    setStatus("copying"); 

    const success = await safeCopyText(value);

    setLoadingKey(null);

    if (!success) {
      setStatus("idle");
      return;
    }

    triggerCopied(key);

    if (track && actionType) {
      track(actionType);
    }
  };

  useEffect(() => {
    return clear;
  }, []);

  return {
    loadingKey,
    copied,
    copy,
    status,
    triggerCopied,
    clear,
  };
};
