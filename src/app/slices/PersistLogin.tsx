import { useEffect } from "react";

import { Outlet } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../typedReduxHooks";

import { selectCurrentToken } from "./authSlice";
import { fetchUser } from "./userSlice";

const PersistLogin = () => {
  const token = useAppSelector(selectCurrentToken);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (token) {
      dispatch(fetchUser());
    }
  }, [token, dispatch]);

  return <Outlet />;
};
export default PersistLogin;
