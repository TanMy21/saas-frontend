import { useEffect } from "react";

import { useSessionRestore } from "../src/hooks/useSessionRestore";

import { setSessionExpired } from "./app/slices/authSlice";
import { useAppDispatch } from "./app/typedReduxHooks";

const SessionInitializer = () => {
  useSessionRestore();

  const dispatch = useAppDispatch();

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === "authExp" && e.newValue === "true") {
        dispatch(setSessionExpired(true));
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [dispatch]);

  return null;
};

export default SessionInitializer;
