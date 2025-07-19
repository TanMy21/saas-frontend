import { ReactFlowProvider } from "@xyflow/react";
import { createBrowserRouter } from "react-router-dom";

import PersistLogin from "../app/slices/PersistLogin";
import RequireAuth from "../components/RequireAuth";
import SurveysListMain from "../components/Surveys/SurveysListMain";
import PublicGuard from "../layouts/PublicGuard";
import RootLayout from "../layouts/RootLayout";
import Dashboard from "../pages/Dashboard";
import EmailNotVerified from "../pages/EmailNotVerified";
import ErrorPage from "../pages/ErrorPage";
import ForgotPassword from "../pages/ForgotPassword";
import Homepage from "../pages/Homepage";
import LoginAgain from "../pages/LoginAgain";
import QuestionFlow from "../pages/QuestionFlow";
import ResetPassword from "../pages/ResetPassword";
import Settings from "../pages/Settings";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";
import SurveyBuilder from "../pages/SurveyBuilder";
import SurveyResults from "../pages/SurveyResults";
import VerifyUser from "../pages/VerifyUser";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: (
          <PublicGuard>
            <Homepage />
          </PublicGuard>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/register",
        element: (
          <PublicGuard>
            <Signup />
          </PublicGuard>
        ),
      },
      {
        path: "/login",
        element: (
          <PublicGuard>
            <Signin />
          </PublicGuard>
        ),
      },
      { path: "/forgot", element: <ForgotPassword /> },
      { path: "/reset", element: <ResetPassword /> },
      { path: "/verify/:verificationCode", element: <VerifyUser /> },
      { path: "/not-verified", element: <EmailNotVerified /> },
      { path: "/session-expired", element: <LoginAgain /> },
      {
        element: <PersistLogin />,
        // element: <RequireAuth />,
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
                element: (
                  <ReactFlowProvider>
                    <QuestionFlow />
                  </ReactFlowProvider>
                ),
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
    ],
  },
]);

export default router;
