import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import ErrorPage from "../pages/ErrorPage";
import Homepage from "../pages/Homepage";
import PersistLogin from "../app/slices/PersistLogin";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";
import SurveysListMain from "../components/Surveys/SurveysListMain";
import SurveyBuilder from "../pages/SurveyBuilder";
import SurveyResults from "../pages/SurveyResults";
import RequireAuth from "../components/RequireAuth";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import VerifyUser from "../pages/VerifyUser";
import EmailNotVerified from "../pages/EmailNotVerified";

const router = createBrowserRouter([
  { path: "/", element: <Homepage />, errorElement: <ErrorPage /> },
  { path: "/register", element: <Signup /> },
  { path: "/login", element: <Signin /> },
  { path: "/forgot", element: <ForgotPassword /> },
  { path: "/reset", element: <ResetPassword /> },
  { path: "/verify/:verificationCode", element: <VerifyUser /> },
  { path: "/not-verified", element: <EmailNotVerified /> },
  {
    element: <PersistLogin />,
    children: [
      {
        element: <RequireAuth />,
        children: [
          {
            path: "/dash",
            element: <Dashboard />,
            children: [
              { path: "w/:workspaceId", element: <SurveysListMain /> },
            ],
          },
          {
            path: "/survey/:surveyID",
            element: <SurveyBuilder />,
          },
          {
            path: "/s/results/:surveyID",
            element: <SurveyResults />,
          },
        ],
      },
    ],
  },
]);

export default router;
