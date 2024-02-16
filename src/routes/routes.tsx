import { createBrowserRouter } from "react-router-dom";
// import Layout from "../layout";
import ErrorPage from "../pages/ErrorPage";
import Homepage from "../pages/Homepage";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import Protected from "../components/Protected";
import Workspace from "../pages/Workspace";
import PersistLogin from "../app/slices/PersistLogin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
    errorElement: <ErrorPage />,
  },
  { path: "/register", element: <Signup /> },
  { path: "/login", element: <Signin /> },
  {
    element: <PersistLogin />,
    children: [
      {
        path: "/dash",
        element: (
          // <Protected>
          <Dashboard />
          // </Protected>
        ),
      },
      {
        path: "/workspace",
        element: (
          // <Protected>
          <Workspace />
          // </Protected>
        ),
      },
    ],
  },
  // {
  //   path: "/workspace",
  //   element: (
  //     <Protected>
  //       <Workspace />
  //     </Protected>
  //   ),
  // },
  // {
  //   path: "/dash",
  //   element: (
  //     <Protected>
  //       <Dashboard />
  //     </Protected>
  //   ),
  // },
]);

export default router;
