import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectLoggedInState } from "../app/slices/authSlice";

const usePersist = () => {
  // const isLoggedIn = useSelector(selectLoggedInState);

  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem("persist") || "false")
  );

  useEffect(() => {
    localStorage.setItem("persist", JSON.stringify(persist));
    // if (isLoggedIn) {
    //   localStorage.setItem("persist", "true");
    // }
    // } else {
    //   localStorage.setItem("persist", "false");
    // }
  }, [persist]);

  return [persist, setPersist];
};
export default usePersist;
