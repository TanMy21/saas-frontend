import { Navigate, Outlet, useLocation } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

const RequireAuth = () => {
  const { isAuthenticated, isVerified, tokenExpired } = useAuth();

  const location = useLocation();

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
