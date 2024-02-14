import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const usePersist = () => {
  // const [persist, setPersist] = useState<boolean>(
  //   JSON.parse(Cookies.get("logged_in") || "{}") || false
  // );

  // useEffect(() => {
  //   Cookies.set("logged_in", JSON.stringify(persist));
  //   // localStorage.setItem("persist", JSON.stringify(persist));
  // }, [persist]);

  // return [persist, setPersist];

  const [persist, setPersist] = useState<boolean>(
    JSON.parse(Cookies.get("logged_in") || "{}") || false
  );

  // Create a flag toggle function
  const togglePersist = () => setPersist((prev) => !prev);

  useEffect(() => {
    // Set the value of the flag
    Cookies.set("logged_in", JSON.stringify(persist));
  }, [persist]);

  return [persist, togglePersist];
};
export default usePersist;
