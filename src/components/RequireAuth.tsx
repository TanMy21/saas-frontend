import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = () => {
  const { isAuthenticated, isVerified, tokenExpired } = useAuth();
  const location = useLocation();

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

  // if (isAuthenticated && !isVerified) {
  //   console.log(
  //     `if isAuthenticated: ${isAuthenticated} and isVerified: ${isVerified}`
  //   );
  //   return <Navigate to="/not-verified" state={{ from: location }} replace />;
  // } else if (isAuthenticated && isVerified) {
  //   console.log(
  //     `else if isAuthenticated: ${isAuthenticated} and isVerified: ${isVerified}`
  //   );
  //   return <Outlet />;
  // } else {
  //   console.log(
  //     `else isAuthenticated: ${isAuthenticated} and isVerified: ${isVerified}`
  //   );
  //   return <Navigate to="/login" state={{ from: location }} replace />;
  // }
};

export default RequireAuth;
