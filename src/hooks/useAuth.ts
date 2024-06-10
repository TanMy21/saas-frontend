import { JwtPayload, jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../app/slices/authSlice";

interface ICustomePayload extends JwtPayload {
  UserInfo?: {
    email?: string;
    admin?: boolean;
  };
}

const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  let isAdmin = false;
  let isAuthenticated = false;

  if (token) {
    const decoded = jwtDecode(token) as ICustomePayload;
    const { email, admin } = decoded.UserInfo || {};
    isAuthenticated = true;
    if (admin) {
      isAdmin = true;
    }
    console.log("A 1: ", isAuthenticated);

    return { email, isAdmin, isAuthenticated };
  }

  console.log("A 2: ", isAuthenticated);

  return { email: "", isAdmin, isAuthenticated };
};
export default useAuth;
