import { Navigate, useLocation } from "react-router-dom";

import useAuth from "../hooks/useAuth";

const PublicGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to="/dash" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

export default PublicGuard;
