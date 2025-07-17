import { Outlet } from "react-router-dom";

import { RootState } from "../app/store";
import { useAppSelector } from "../app/typedReduxHooks";
import SessionExpired from "../components/SessionExpired";
import SessionInitializer from "../SessionInitializer";

const RootLayout = () => {
  const sessionExpired = useAppSelector(
    (state: RootState) => state.auth.sessionExpired
  );

  if (sessionExpired) {
   console.error("Session expired, redirecting to session expired page.");
    return <SessionExpired />;
  }

  return (
    <>
      <SessionInitializer />
      {/* <SessionExpired /> */}
      {!sessionExpired && <Outlet />}
    </>
  );
};

export default RootLayout;
