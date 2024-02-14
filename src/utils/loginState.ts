import Cookies from "js-cookie";

export function setLoginState(value: boolean) {
  Cookies.set("logged_in", JSON.stringify(value));
}

export function getLoginState() {
  // Get flag from local storage

  const loginState = JSON.parse(Cookies.get("logged_in") || "{}") || false;
  return loginState;
}
