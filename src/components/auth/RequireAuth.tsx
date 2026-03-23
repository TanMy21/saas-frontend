import { CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { selectUser } from "../../app/slices/userSlice";
import useAuth from "../../hooks/useAuth";

const RequireAuth = () => {
  const user = useSelector(selectUser);
  const { isAuthenticated, isVerified, tokenExpired } = useAuth();
  const location = useLocation();

  // if (!user) {
  //   return <CircularProgress />;
  // }

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
