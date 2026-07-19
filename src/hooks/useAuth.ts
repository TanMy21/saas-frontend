import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";

import { selectCurrentToken } from "../app/slices/authSlice";
import { selectUser } from "../app/slices/userSlice";
import { Tier } from "../types/userTypes";
import { ICustomePayload, Permission } from "../utils/types";

const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectUser);

  const unauthenticatedState = {
    email: "",
    isAdmin: false,
    isAuthenticated: false,
    isVerified: false,
    tokenExpired: true,
    role: null,
    tier: "FREE" as Tier,
    permissions: [],
    can: () => false,
  };

  if (!token) {
    return unauthenticatedState;
  }

  try {
    const decoded = jwtDecode<ICustomePayload>(token);
    const { email = "", admin, verified, role = null } = decoded.UserInfo || {};
    const { exp } = decoded;

    const activeOrg = user?.activeOrg ?? null;
    const tier: Tier = (user?.tier as Tier) ?? "FREE";
    const permissions = activeOrg?.permissions || [];

    const tokenExpired = !exp || exp * 1000 < Date.now();
    const isAuthenticated = !tokenExpired;
    const isVerified = Boolean(verified);
    const isAdmin = Boolean(admin);

    const can = (permission: Permission) => permissions.includes(permission);

    return {
      email,
      isAdmin,
      isAuthenticated,
      isVerified,
      tokenExpired,
      role,
      tier,
      permissions,
      can,
    };
  } catch {
    return unauthenticatedState;
  }
};

export default useAuth;
