import { useSelector } from "react-redux";
import { selectCurrentToken } from "../app/slices/authSlice";
import { JwtPayload, jwtDecode } from "jwt-decode";

const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  let isAdmin = false;
  let isAuthenticated = false;

  if (token) {
    const decoded = jwtDecode(token) as JwtPayload;
    console.log(decoded);
    const { email, admin } = decoded.UserInfo;
    isAuthenticated = true;
    if (admin) {
      isAdmin = true;
    }

    return { email, isAdmin, isAuthenticated };
  }

  return { email: "", isAdmin, isAuthenticated };
};
export default useAuth;
