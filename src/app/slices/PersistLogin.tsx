import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useRefreshMutation } from "./authApiSlice";
import { selectCurrentToken } from "./authSlice";
import usePersist from "../../hooks/persist";
import { ErrorData } from "../../utils/types";
import { CircularProgress } from "@mui/material";

const PersistLogin = () => {
  const [persist] = usePersist();
  const token = useSelector(selectCurrentToken);
  const navigate = useNavigate();

  const [trueSuccess, setTrueSuccess] = useState(false);

  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
    useRefreshMutation();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      console.log("verifying refresh token");
      try {
        //const response =
        await refresh();
        //const { accessToken } = response.data
        setTrueSuccess(true);
      } catch (err) {
        console.error(err);
        navigate("/login", { replace: true });
      }
    };

    if (
      !token &&
      persist
      // &&
      // (effectRan.current === true ||
      //   import.meta.env.VITE_REACT_APP_NODE_ENV !== "development")
    ) {
      verifyRefreshToken();
    }
    // return () => {
    //   effectRan.current = true;
    // };

    const interval = setInterval(() => {
      if (persist) {
        console.log("interval");
        verifyRefreshToken();
      }
    }, 360000);

    return () => clearInterval(interval);

    // eslint-disable-next-line
  }, [token, persist, refresh, navigate]);

  let content;
  if (!persist) {
    // persist: no
    // console.log("no persist");
    content = <Outlet />;
  } else if (isLoading) {
    //persist: yes, token: no
    // console.log("loading");
    content = <CircularProgress />;
  } else if (isError) {
    //persist: yes, token: no

    const errorData = error as ErrorData;
    // console.log("error");
    content = (
      <p className="errmsg">
        {`${errorData?.data?.message} - `}
        <Link to="/login">Please login again</Link>.
      </p>
    );
  } else if (isSuccess && trueSuccess) {
    //persist: yes, token: yes
    // console.log("success");
    content = <Outlet />;
  } else if (token && isUninitialized) {
    //persist: yes, token: yes
    // console.log("token and uninit");
    // console.log(isUninitialized);
    content = <Outlet />;
  }

  return content;
};
export default PersistLogin;
