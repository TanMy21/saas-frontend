import { JwtPayload, jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../app/slices/authSlice";

interface ICustomePayload extends JwtPayload {
  UserInfo?: {
    email?: string;
    admin?: boolean;
    verified?: boolean;
  };
}

const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  let isAdmin = false;
  let isAuthenticated = false;
  let isVerified;

  if (token) {
    const decoded = jwtDecode<ICustomePayload>(token);
    const { email, admin, verified } = decoded.UserInfo || {};
    isAuthenticated = localStorage.getItem("persist") === "true" ? true : false;
    isVerified = !!verified;

    if (admin) {
      isAdmin = true;
    }

    return { email, isAdmin, isAuthenticated, isVerified };
  }

  return { email: "", isAdmin, isAuthenticated, isVerified };
};
export default useAuth;
