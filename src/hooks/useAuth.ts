import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";

import { selectCurrentToken } from "../app/slices/authSlice";
import { selectUser } from "../app/slices/userSlice";
import { ICustomePayload, Permission } from "../utils/types";

const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectUser);

  if (!token) {
    return {
      email: "",
      role: null,
      permissions: [],
      can: () => false,
    };
  }

  let isAdmin = false;
  let isAuthenticated = false;
  let isVerified = false;
  let tokenExpired = false;

  if (token) {
    const decoded = jwtDecode<ICustomePayload>(token);
    const { email, admin, verified, role } = decoded.UserInfo || {};
    const { exp } = decoded;

    const activeOrg = user?.activeOrg ?? null;
    const permissions = activeOrg?.permissions || [];

    const can = (permission: Permission) => permissions.includes(permission);

    tokenExpired = exp! * 1000 < Date.now();

    // if (!tokenExpired) {
    isAuthenticated = true;
    // }

    if (verified) {
      isVerified = true;
    }

    if (admin) {
      isAdmin = true;
    }

    return {
      email,
      isAdmin,
      isAuthenticated,
      isVerified,
      tokenExpired,
      role,
      permissions,
      can,
    };
  }

  return {
    email: "",
    isAdmin,
    isAuthenticated,
    isVerified,
    tokenExpired,
    role: null,
    can: () => false,
  };
};
export default useAuth;
