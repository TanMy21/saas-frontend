import { useEffect, useState } from "react";

import { CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

import usePersist from "../../hooks/persist";
import { isTokenExpired } from "../../utils/tokenUtils";

import { useRefreshMutation, useSendLogoutMutation } from "./authApiSlice";
import { selectCurrentToken, logOut } from "./authSlice";

const PersistLogin = () => {
  const [persist] = usePersist();
  const token = useSelector(selectCurrentToken);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [trueSuccess, setTrueSuccess] = useState(false);

  const [refresh, { isUninitialized, isLoading, isSuccess, isError }] =
    useRefreshMutation();

  const [sendLogout] = useSendLogoutMutation();

  const logoutUser = async () => {
    try {
      await sendLogout().unwrap();
      dispatch(logOut());
      navigate("/login", { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();

        setTrueSuccess(true);
      } catch (err) {
        console.error(err);
        await logoutUser();
      }
    };

    const checkTokenExpiration = () => {
      const isExpired = isTokenExpired(token!);
      if (isExpired) {
        verifyRefreshToken();
      }
    };

    const intervalId = setInterval(checkTokenExpiration, 120000);

    checkTokenExpiration();

    return () => clearInterval(intervalId);

    // eslint-disable-next-line
  }, [refresh]);

  useEffect(() => {
    if (isError) {
      logoutUser();
    }
    // eslint-disable-next-line
  }, [isError]);

  let content;
  if (!persist) {
    content = <Outlet />;
  } else if (isLoading) {
    //persist: yes, token: no
    content = <CircularProgress />;
  } else if (isError) {
    //persist: yes, token: no
    content = null;
  } else if (isSuccess && trueSuccess) {
    //persist: yes, token: yes
    content = <Outlet />;
  } else if (token && isUninitialized) {
    //persist: yes, token: yes
    content = <Outlet />;
  }

  return content;
};
export default PersistLogin;
