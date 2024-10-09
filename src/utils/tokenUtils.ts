import { jwtDecode } from "jwt-decode";


export const isTokenExpired = (token: string | null) => {
  if (!token) return true;  
  const decoded = jwtDecode(token);  
  const { exp } = decoded;  
  const currentTime = Date.now(); 
  return exp! * 1000 < currentTime;  
};
