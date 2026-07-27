import { lazy, Suspense } from "react";

import { createBrowserRouter } from "react-router-dom";

import PersistLogin from "../app/slices/PersistLogin";
import RequireAuth from "../components/auth/RequireAuth";
import RouteLogoLoader from "../components/Loaders/RouteLogoLoader";
import PublicGuard from "../layouts/PublicGuard";
import RootLayout from "../layouts/RootLayout";
import ErrorPage from "../pages/ErrorPage";

const Dashboard = lazy(() => import("../pages/Dashboard"));
const QuestionFlow = lazy(() => import("../pages/QuestionFlow"));
const Settings = lazy(() => import("../pages/Settings"));
const SurveyBuilder = lazy(() => import("../pages/SurveyBuilder"));
const SurveyResults = lazy(() => import("../pages/SurveyResults"));
const EmailNotVerified = lazy(() => import("../pages/EmailNotVerified"));

const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const Homepage = lazy(() => import("../pages/Homepage"));
const LoginAgain = lazy(() => import("../pages/LoginAgain"));
const Signin = lazy(() => import("../pages/Signin"));
const Signup = lazy(() => import("../pages/Signup"));
const VerifyUser = lazy(() => import("../pages/VerifyUser"));

const SurveysListMain = lazy(
  () => import("../components/Surveys/SurveysListMain"),
);
const AcceptInvite = lazy(() =>
  import("../pages/AcceptInvite").then((module) => ({
    default: module.AcceptInvite,
  })),
);

const Onboarding = lazy(() =>
  import("../pages/OnboardingSSO").then((module) => ({
    default: module.Onboarding,
  })),
);

const PendingInvites = lazy(() =>
  import("../pages/PendingInvites").then((module) => ({
    default: module.PendingInvites,
  })),
);
const router = createBrowserRouter([
  {
    element: (
      <Suspense fallback={<RouteLogoLoader />}>
        <RootLayout />
      </Suspense>
    ),
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
      { path: "/invite/:token", element: <AcceptInvite /> },
      { path: "/verify", element: <VerifyUser /> },
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
                path: "/onboarding",
                element: <Onboarding />,
              },
              {
                path: "/pending-invites",
                element: <PendingInvites />,
              },
              { path: "/not-verified", element: <EmailNotVerified /> },
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
    ],
  },
]);

export default router;
