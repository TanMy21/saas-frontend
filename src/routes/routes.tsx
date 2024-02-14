import { createBrowserRouter } from "react-router-dom";
// import Layout from "../layout";
import ErrorPage from "../pages/ErrorPage";
import Homepage from "../pages/Homepage";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import Protected from "../components/Protected";
import Profile from "../pages/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
    errorElement: <ErrorPage />,
  },
  { path: "/register", element: <Signup /> },
  { path: "/login", element: <Signin /> },
  {
    path: "/profile",
    element: (
      <Protected>
        <Profile />
      </Protected>
    ),
  },
  {
    path: "/dash",
    element: (
      <Protected>
        <Dashboard />
      </Protected>
    ),
  },
]);

export default router;
