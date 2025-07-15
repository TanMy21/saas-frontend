import { useNavigate } from "react-router-dom";

import { logOut, setSessionExpired } from "../app/slices/authSlice";
import { RootState } from "../app/store";
import { useAppDispatch, useAppSelector } from "../app/typedReduxHooks";

import SessionExpiredModal from "./Modals/SessionExpiredModal";

const SessionExpired = () => {
  const sessionExpired = useAppSelector(
    (state: RootState) => state.auth.sessionExpired
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSessionExpired = () => {
    dispatch(logOut());
    dispatch(setSessionExpired(false));
    localStorage.removeItem("authExp");
    navigate("/login", { replace: true });
  };

  return (
    <SessionExpiredModal
      open={!!sessionExpired}
      onConfirm={handleSessionExpired}
    />
  );
};

export default SessionExpired;
