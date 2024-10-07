import { JwtPayload, jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../app/slices/authSlice";
import { useSendLogoutMutation } from "../app/slices/authApiSlice";

interface ICustomePayload extends JwtPayload {
  UserInfo?: {
    email?: string;
    admin?: boolean;
    verified?: boolean;
  };
  exp?: number;
}

const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  const [sendLogout, { isSuccess: isSuccessLogout }] = useSendLogoutMutation();
  let isAdmin = false;
  let isAuthenticated = false;
  let isVerified = false;
  let tokenExpired = false;

  console.log("Token: ", token);

  if (token) {
    const decoded = jwtDecode<ICustomePayload>(token);
    const { email, admin, verified } = decoded.UserInfo || {};
    // isAuthenticated = localStorage.getItem("persist") === "true" ? true : false;
    // isAuthenticated = true;

    const tokenExpired = decoded.exp ? decoded.exp * 1000 < Date.now() : false;

    

    if (!tokenExpired) {
      isAuthenticated = true;
    }

    if (verified) {
      isVerified = true;
    }
    // isVerified = !!verified;

    if (admin) {
      isAdmin = true;
    }

    return { email, isAdmin, isAuthenticated, isVerified, tokenExpired };
  }

  return { email: "", isAdmin, isAuthenticated, isVerified, tokenExpired };
};
export default useAuth;
