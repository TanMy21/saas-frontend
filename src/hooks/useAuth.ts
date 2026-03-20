import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";

import { selectCurrentToken } from "../app/slices/authSlice";
import { rolePermissionsMap } from "../utils/constants";
import { ICustomePayload } from "../utils/types";

const useAuth = () => {
  const token = useSelector(selectCurrentToken);

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

    const permissions = role ? (rolePermissionsMap[role] ?? []) : [];

    const can = (permission: string) => permissions.includes(permission);

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
