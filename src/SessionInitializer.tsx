import { useEffect, useState } from "react";

import { Box, CircularProgress } from "@mui/material";

import { useRefreshMutation } from "./app/slices/authApiSlice";
import {
  selectCurrentToken,
  setRestoringSession,
} from "./app/slices/authSlice";
import { RootState } from "./app/store";
import { useAppDispatch, useAppSelector } from "./app/typedReduxHooks";
import { showToast } from "./utils/showToast";

const SessionInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectCurrentToken);
  const restoringSession = useAppSelector(
    (state: RootState) => state.auth.restoringSession,
  );

  const [refresh] = useRefreshMutation();
  const [restoreFailed, setRestoreFailed] = useState(false);

  useEffect(() => {
    let active = true;
    const persist = localStorage.getItem("persist") === "true";
    setRestoreFailed(false);

    if (persist && !token) {
      dispatch(setRestoringSession(true));

      void refresh()
        .unwrap()
        .then(() => {
          if (active) dispatch(setRestoringSession(false));
        })
        .catch(() => {
          if (!active) return;

          if (localStorage.getItem("persist") !== "true") {
            dispatch(setRestoringSession(false));
          } else {
            setRestoreFailed(true);
          }
        });
    } else {
      dispatch(setRestoringSession(false));
    }

    return () => {
      active = false;
    };
  }, [token, refresh, dispatch]);

  useEffect(() => {
    if (!restoringSession || !restoreFailed) return;

    const id = "session-restore-error";

    showToast.error("Please login again.", { id });

    return () => showToast.dismiss(id);
  }, [restoringSession, restoreFailed]);

  if (restoringSession && restoreFailed) {
    return null;
  }

  if (restoringSession) {
    return (
      <Box
        component="div"
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
