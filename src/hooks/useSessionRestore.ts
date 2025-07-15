import { useEffect } from "react";

import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { useRefreshMutation } from "../app/slices/authApiSlice";
import { selectCurrentToken } from "../app/slices/authSlice";

import usePersist from "./persist";

export function useSessionRestore() {
  const [persist] = usePersist();
  const token = useSelector(selectCurrentToken);
  const [refresh, { isSuccess }] = useRefreshMutation();
  const navigate = useNavigate();
  const location = useLocation();

  const publicPages = ["/login", "/register", "/"];

  useEffect(() => {
    if (persist && !token) {
      refresh();
    }
  }, [persist, token, refresh]);

  useEffect(() => {
    if ((token || isSuccess) && publicPages.includes(location.pathname)) {
      navigate("/dash", { replace: true });
    }
    // eslint-disable-next-line
  }, [token, isSuccess, navigate, location.pathname]);
}
