import { useEffect } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { useRefreshMutation } from "../app/slices/authApiSlice";
import { selectCurrentToken } from "../app/slices/authSlice";
import { RootState } from "../app/store";
import { useAppSelector } from "../app/typedReduxHooks";

import usePersist from "./persist";

export function useSessionRestore() {
  console.log("useSessionRestore");
  // const [persist] = usePersist();
  // const [refresh, { isSuccess }] = useRefreshMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const token = useAppSelector(selectCurrentToken);
  // const sessionExpired = useAppSelector(
  //   (state: RootState) => state.auth.sessionExpired
  // );

  const publicPages = ["/login", "/register", "/"];

  // useEffect(() => {
  //   if (persist && !token) {
  //     refresh();
  //   }
  // }, [persist, token, refresh]);

  // useEffect(() => {
  //   if (!sessionExpired && token && publicPages.includes(location.pathname)) {
  //     console.log("Restoring session, navigating to /dash");
  //     navigate("/dash", { replace: true });
  //   }
  //   // eslint-disable-next-line
  // }, [token, navigate, location.pathname]);
}
