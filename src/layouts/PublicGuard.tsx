import { Navigate, useLocation } from "react-router-dom";

import useAuth from "../hooks/useAuth";

const PublicGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const params = new URLSearchParams(location.search);

  const isGoogleAuth = params.get("auth") === "g";
  const hasPendingInvite = params.get("pendingInvite") === "true";
  const inviteAccepted = params.get("invite") === "accepted";
  const isSessionExpired = params.get("session") === "expired";

  if (isGoogleAuth || hasPendingInvite || inviteAccepted || isSessionExpired) {
    return <>{children}</>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dash" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PublicGuard;
