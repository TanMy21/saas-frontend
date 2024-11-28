import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";

import { selectCurrentToken } from "../app/slices/authSlice";
import { ICustomePayload } from "../utils/types";

const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  let isAdmin = false;
  let isAuthenticated = false;
  let isVerified = false;
  let tokenExpired = false;

  if (token) {
    const decoded = jwtDecode<ICustomePayload>(token);
    const { email, admin, verified } = decoded.UserInfo || {};
    const { exp } = decoded;

    tokenExpired = exp! * 1000 < Date.now();

    if (!tokenExpired) {
      isAuthenticated = true;
    }

    if (verified) {
      isVerified = true;
    }

    if (admin) {
      isAdmin = true;
    }

    return { email, isAdmin, isAuthenticated, isVerified, tokenExpired };
  }

  return { email: "", isAdmin, isAuthenticated, isVerified, tokenExpired };
};
export default useAuth;
