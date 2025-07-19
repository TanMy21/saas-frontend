import { Navigate, Outlet, useLocation } from "react-router-dom";

import useAuth from "../hooks/useAuth";

const RequireAuth = () => {
  const { isAuthenticated, isVerified, tokenExpired } = useAuth();

  console.log("RequireAuth", { isAuthenticated, isVerified, tokenExpired });
  const location = useLocation();

  if (isAuthenticated && isVerified && !tokenExpired) {
    return <Outlet />;
  }

  if (isAuthenticated && !isVerified && !tokenExpired) {
    return <Navigate to="/not-verified" state={{ from: location }} replace />;
  }

  // --- THIS IS THE TEMPORARY CHANGE ---
  // Instead of navigating, print the call stack to the console.
  console.trace(">>> REQUIREAUTH: A redirect to /login would happen here!");

  // You can return null or the Navigate component, but the trace is what matters.
  // For the test, let's prevent the navigation entirely.
  // return <h1 style={{ color: "red" }}>DEBUG: Redirect to /login Blocked</h1>;

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default RequireAuth;
