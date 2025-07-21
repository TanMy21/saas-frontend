import { useEffect } from "react";

import { Box, CircularProgress } from "@mui/material";

import { useRefreshMutation } from "./app/slices/authApiSlice";
import {
  logOut,
  selectCurrentToken,
  setCredentials,
  setRestoringSession,
} from "./app/slices/authSlice";
import { RootState } from "./app/store";
import { useAppDispatch, useAppSelector } from "./app/typedReduxHooks";

const SessionInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectCurrentToken);
  const restoringSession = useAppSelector(
    (state: RootState) => state.auth.restoringSession
  );

  const [refresh] = useRefreshMutation();

  useEffect(() => {
    const persist = localStorage.getItem("persist") === "true";
    if (persist && !token) {
      dispatch(setRestoringSession(true));
      refresh()
        .unwrap()
        .then((data) => {
          dispatch(setCredentials(data));
          dispatch(setRestoringSession(false));
        })
        .catch(() => {
          dispatch(logOut());
          dispatch(setRestoringSession(false));
        });
    } else {
      dispatch(setRestoringSession(false));
    }
    // eslint-disable-next-line
  }, []);

  if (restoringSession) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  return <>{children}</>;
};

export default SessionInitializer;
