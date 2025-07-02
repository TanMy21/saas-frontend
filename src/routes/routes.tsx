import { createBrowserRouter } from "react-router-dom";

import PersistLogin from "../app/slices/PersistLogin";
import RequireAuth from "../components/RequireAuth";
import SurveysListMain from "../components/Surveys/SurveysListMain";
import Dashboard from "../pages/Dashboard";
import EmailNotVerified from "../pages/EmailNotVerified";
import ErrorPage from "../pages/ErrorPage";
import ForgotPassword from "../pages/ForgotPassword";
import Homepage from "../pages/Homepage";
import QuestionFlow from "../pages/QuestionFlow";
import ResetPassword from "../pages/ResetPassword";
import Settings from "../pages/Settings";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";
import SurveyBuilder from "../pages/SurveyBuilder";
import SurveyResults from "../pages/SurveyResults";
import VerifyUser from "../pages/VerifyUser";

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
    errorElement: <ErrorPage />,
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
            path: "/s/flow/:surveyID",
            element: <QuestionFlow />,
          },
          {
            path: "/s/results/:surveyID",
            element: <SurveyResults />,
          },
          {
            path: "/a/settings",
            element: <Settings />,
          },
        ],
      },
    ],
  },
]);

export default router;
