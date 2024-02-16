import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectLoggedInState } from "../app/slices/authSlice";

const usePersist = () => {
  const isLoggedIn = useSelector(selectLoggedInState);

  const [persist, setPersist] = useState(
    localStorage.getItem("persist") || false
  );

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem("persist", "true");
      console.log("Persist Hook: ", persist);
    }
  }, [isLoggedIn]);

  return [persist, setPersist];
};
export default usePersist;
