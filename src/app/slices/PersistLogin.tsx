import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { useRefreshMutation, useSendLogoutMutation } from "./authApiSlice";
import { selectCurrentToken, logOut } from "./authSlice";
import usePersist from "../../hooks/persist";
import { CircularProgress } from "@mui/material";
import { isTokenExpired } from "../../utils/tokenUtils";

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
      // console.log("verifying refresh token");
      try {
        //const response =
        await refresh();
        //const { accessToken } = response.data
        setTrueSuccess(true);
      } catch (err) {
        console.error(err);
        logoutUser();
      }
    };

    const checkTokenExpiration = () => {
      const isExpired = isTokenExpired(token!);
      if (isExpired) {
        // console.log("Token expired, attempting to refresh...");
        verifyRefreshToken();
      }
    };

    const intervalId = setInterval(checkTokenExpiration, 10000);

    // Check once immediately on component mount
    checkTokenExpiration();

    return () => clearInterval(intervalId);

    // eslint-disable-next-line
  }, [refresh]);

  useEffect(() => {
    if (isError) {
      logoutUser();
    }
  }, [isError]);

  let content;
  if (!persist) {
    // persist: no
    // console.log("no persist");
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
