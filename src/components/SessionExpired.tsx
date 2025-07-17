

import { logOut, setSessionExpired } from "../app/slices/authSlice";
import { RootState } from "../app/store";
import { useAppDispatch, useAppSelector } from "../app/typedReduxHooks";

import SessionExpiredModal from "./Modals/SessionExpiredModal";

const SessionExpired = () => {
  console.log("SessionExpired component rendered");
  const sessionExpired = useAppSelector(
    (state: RootState) => state.auth.sessionExpired
  );
  const dispatch = useAppDispatch();

  const handleSessionExpired = () => {
    dispatch(logOut());
    dispatch(setSessionExpired(false));
    localStorage.removeItem("authExp");
    window.location.href = "/login";
  };

  return (
    <SessionExpiredModal
      open={!!sessionExpired}
      onConfirm={handleSessionExpired}
    />
  );
};

export default SessionExpired;
