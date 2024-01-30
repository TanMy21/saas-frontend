import { createBrowserRouter } from "react-router-dom";
// import Layout from "../layout";
import ErrorPage from "../pages/ErrorPage";
import Homepage from "../pages/Homepage";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
    errorElement: <ErrorPage />,
  },
  { path: "/register", element: <Signup /> },
  { path: "/login", element: <Signin /> },
  { path: "/dash", element: <Dashboard /> },
]);

export default router;
