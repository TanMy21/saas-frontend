import { Navigate, Outlet, useLocation } from "react-router-dom";

import { RootState } from "../app/store";
import { useAppSelector } from "../app/typedReduxHooks";
import useAuth from "../hooks/useAuth";

const RequireAuth = () => {
  const { isAuthenticated, isVerified, tokenExpired } = useAuth();
  const sessionExpired = useAppSelector(
    (state: RootState) => state.auth.sessionExpired
  );

  console.log("RequireAuth", { isAuthenticated, isVerified, tokenExpired });
  const location = useLocation();

  if (sessionExpired) {
    return null;
  }

  if (isAuthenticated) {
    if (tokenExpired) {
      return <Navigate to="/login" />;
    } else if (isVerified) {
      return <Outlet />;
    } else {
      return <Navigate to="/not-verified" state={{ from: location }} replace />;
    }
  } else {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
};

export default RequireAuth;
