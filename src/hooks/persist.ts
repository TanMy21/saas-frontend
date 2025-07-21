import { useState, useEffect } from "react";

const usePersist = (): [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
] => {
  const [persist, setPersist] = useState<boolean>(() => {
    const val = localStorage.getItem("persist");
    return val ? JSON.parse(val) : false;
  });

  useEffect(() => {
    if (persist) {
      localStorage.setItem("persist", JSON.stringify(true));
    } else {
      localStorage.removeItem("persist");
    }
  }, [persist]);

  // Listen for persist changes in other tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "persist") {
        setPersist(e.newValue ? JSON.parse(e.newValue) : false);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return [persist, setPersist];
};
export default usePersist;
