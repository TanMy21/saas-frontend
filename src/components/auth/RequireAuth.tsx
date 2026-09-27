import { useEffect } from "react";

import { Navigate, Outlet, useLocation } from "react-router-dom";

import {
  useLazyGoogleAuthQuery,
  useRefreshMutation,
} from "../../app/slices/authApiSlice";
import { selectCurrentToken, setCredentials } from "../../app/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../app/typedReduxHooks";
import useAuth from "../../hooks/useAuth";
import { showToast } from "../../utils/showToast";
import LogoLoader from "../Loaders/LogoLoader";

const RequireAuth = () => {
  // const user = useSelector(selectUser);
  const accessToken = useAppSelector(selectCurrentToken);
  const { isAuthenticated, isVerified, tokenExpired } = useAuth();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const params = new URLSearchParams(location.search);
  const isGoogleAuth = params.get("auth") === "g";
  const hasPendingInvite = params.get("pendingInvite") === "true";

  const [googleAuth, { data }] = useLazyGoogleAuthQuery();

  const [
    refresh,
    {
      isLoading: isRefreshing,
      isError: refreshFailed,
      error: refreshError,
      reset: resetRefresh,
    },
  ] = useRefreshMutation();

  useEffect(() => {
    // If the access token is present and not expired, or if we have
    // successfully restored the access token.
    if (!accessToken || !tokenExpired) {
      if (refreshFailed) {
        resetRefresh();
      }
      return;
    }

    // atk expired refresh the atk.
    if (!isRefreshing && !refreshFailed) {
      void refresh();
    }
  }, [
    accessToken,
    tokenExpired,
    isRefreshing,
    refreshFailed,
    refresh,
    resetRefresh,
  ]);

  useEffect(() => {
    if ((isGoogleAuth || hasPendingInvite) && !accessToken) {
      void googleAuth({});
    }
  }, [isGoogleAuth, hasPendingInvite, accessToken, googleAuth]);

  useEffect(() => {
    if (data?.accessToken) {
      dispatch(setCredentials({ accessToken: data.accessToken }));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (!accessToken || !tokenExpired || !refreshFailed) return;

    if (
      refreshError &&
      "status" in refreshError &&
      refreshError.status === 401
    ) {
      return;
    }

    const id = "session-restore-error";

    showToast.error("Please login again.", { id });

    return () => showToast.dismiss(id);
  }, [accessToken, tokenExpired, refreshFailed, refreshError]);

  if ((isGoogleAuth || hasPendingInvite) && !accessToken) {
    return <div>Loading...</div>;
  }

  if (accessToken && tokenExpired) {
    const sessionRejected =
      refreshFailed &&
      refreshError != null &&
      "status" in refreshError &&
      refreshError.status === 401;

    if (sessionRejected) {
      return (
        <Navigate
          to="/login?reason=session-expired"
          state={{ from: location }}
          replace
        />
      );
    }

    if (refreshFailed) {
      return null;
    }

    return <LogoLoader />;
  }

  if (isAuthenticated && isVerified && !tokenExpired) {
    return <Outlet />;
  }

  if (isAuthenticated && !isVerified && !tokenExpired) {
    if (location.pathname === "/not-verified") {
      return <Outlet />;
    }
    return <Navigate to="/not-verified" state={{ from: location }} replace />;
  }

  return (
    <Navigate
      to="/login?reason=unauthorized"
      state={{ from: location }}
      replace
    />
  );
};

export default RequireAuth;
