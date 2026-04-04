import { useEffect } from "react";

import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useLazyGoogleAuthQuery } from "../../app/slices/authApiSlice";
import { selectCurrentToken, setCredentials } from "../../app/slices/authSlice";
import { selectUser } from "../../app/slices/userSlice";
import { useAppDispatch, useAppSelector } from "../../app/typedReduxHooks";
import useAuth from "../../hooks/useAuth";

const RequireAuth = () => {
  const user = useSelector(selectUser);
  const accessToken = useAppSelector(selectCurrentToken);
  const { isAuthenticated, isVerified, tokenExpired } = useAuth();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const params = new URLSearchParams(location.search);
  const isGoogleAuth = params.get("auth") === "g";
  const hasPendingInvite = params.get("pendingInvite") === "true";

  const [googleAuth, { data }] = useLazyGoogleAuthQuery();

  useEffect(() => {
    if ((isGoogleAuth || hasPendingInvite) && !accessToken) {
      googleAuth({});
    }

    if (data) {
      const { accessToken } = data;
      dispatch(setCredentials({ accessToken }));
    }
  }, [isGoogleAuth, hasPendingInvite, accessToken, googleAuth, data, dispatch]);

  if ((isGoogleAuth || hasPendingInvite) && !accessToken) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated && isVerified) {
    return <Outlet />;
  }

  if (isAuthenticated && !isVerified && !tokenExpired) {
    return <Navigate to="/not-verified" state={{ from: location }} replace />;
  }

  return (
    <Navigate to="/login?session=expired" state={{ from: location }} replace />
  );
};

export default RequireAuth;
