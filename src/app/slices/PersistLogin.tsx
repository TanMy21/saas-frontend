import { useEffect, useState } from "react";

import { CircularProgress } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";

import usePersist from "../../hooks/persist";
import { useAppDispatch, useAppSelector } from "../typedReduxHooks";

import { useRefreshMutation, useSendLogoutMutation } from "./authApiSlice";
import { selectCurrentToken, logOut } from "./authSlice";
import { fetchUser } from "./userSlice";

const PersistLogin = () => {
  const [persist] = usePersist();
  const token = useAppSelector(selectCurrentToken);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [trueSuccess, setTrueSuccess] = useState(false);

  const [refresh, { isUninitialized, isLoading, isSuccess, isError }] =
    useRefreshMutation();

  const [sendLogout] = useSendLogoutMutation();

  const logoutUser = async () => {
    try {
      await sendLogout().unwrap();
      dispatch(logOut());
      navigate("/login?session=expired", { replace: true });
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
        // logoutUser();
        console.error(err);
      }
    };

    if (persist && !token) {
      verifyRefreshToken();
    }

    // eslint-disable-next-line
  }, [refresh, persist, token]);

  // useEffect(() => {
  //   if (isError) {
  //     logoutUser();
  //   }
  //   // eslint-disable-next-line
  // }, [isError]);

  useEffect(() => {
    if (token) {
      dispatch(fetchUser());
    }
  }, [token, dispatch]);

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
  } else {
    content = null;
  }

  return content;
};
export default PersistLogin;
