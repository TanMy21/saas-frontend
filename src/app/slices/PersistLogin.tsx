import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, Link, useNavigate, Navigate } from "react-router-dom";
import { useRefreshMutation, useSendLogoutMutation } from "./authApiSlice";
import { selectCurrentToken, logOut } from "./authSlice";
import usePersist from "../../hooks/persist";
import { ErrorData } from "../../utils/types";
import { CircularProgress } from "@mui/material";
import useAuth from "../../hooks/useAuth";

const PersistLogin = () => {
  const [persist, setPersist] = usePersist();
  const token = useSelector(selectCurrentToken);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { tokenExpired } = useAuth();

  const [trueSuccess, setTrueSuccess] = useState(false);

  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
    useRefreshMutation();

  

  const logOutUser = useCallback(() => {
    console.log("logging out...");
    dispatch(logOut());
    navigate("/login", { replace: true });
  }, [dispatch, navigate]);

  const verifyRefreshToken = useCallback(async () => {
    console.log("verifying refresh token");
    try {
      await refresh().unwrap();
      setTrueSuccess(true);
    } catch (err) {
      console.error(err);
      logOutUser();
    }
  }, [refresh, logOutUser]);

  // useEffect(() => {
  //   console.log("useEffect Ran PeristLogin");
  //   console.log("Token Error: ", isError);
  //   console.log("Tk Error: ", error);
  //   let isMounted = true;

  //   const verifyToken = async () => {
  //     try {
  //       await verifyRefreshToken();
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }

  //   if (tokenExpired) {
  //     console.log("Token expired, logging out...");
  //     logOutUser();
  //   }

  //   if (!token && persist && isMounted) {
  //     verifyToken();
  //   }

  //   const interval = setInterval(() => {
  //     if (persist) {
  //       console.log("interval");
  //       verifyRefreshToken();
  //     }
  //   }, 360000);

  //   return () => clearInterval(interval);

  //   // eslint-disable-next-line
  // }, [token, persist, refresh, navigate, dispatch, tokenExpired]);

  useEffect(() => {
    let isMounted = true;

    const verifyToken = async () => {
      try {
        await verifyRefreshToken();
      } catch (err) {
        console.error(err);
      }
    };

    if (!token && persist && isMounted) {
      verifyToken();
    }

    return () => {
      isMounted = false;
    };
  }, [token, persist, verifyRefreshToken]);

  useEffect(() => {
    if (tokenExpired) {
      console.log("Token expired, logging out...");
      logOutUser();
    }
  }, [tokenExpired, logOutUser]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (persist && !tokenExpired) {
        verifyRefreshToken();
      }
    }, 360000); // 6 minutes

    return () => clearInterval(intervalId);
  }, [persist, tokenExpired, verifyRefreshToken]);

  useEffect(() => {
    console.log("Error: ", isError);
    if (isError) {
      console.log("Error: ", error);
      logOutUser();
    }
  }, [isError, logOutUser]);

  let content;
  if (!persist) {
    // persist: no

    content = <Outlet />;
  } else if (isLoading) {
    //persist: yes, token: no

    content = <CircularProgress />;
  } else if (isError) {
    //persist: yes, token: no

    content = null;
    // logOutUser();
    // <p className="errmsg">
    //   {`${errorData?.data?.message} - `}
    //   <Link to="/login">Please login again</Link>.
    // </p>
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
