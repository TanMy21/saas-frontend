import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import ErrorPage from "../pages/ErrorPage";
import Homepage from "../pages/Homepage";
import PersistLogin from "../app/slices/PersistLogin";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";
import SurveysListMain from "../components/Surveys/SurveysListMain";
import SurveyBuilder from "../pages/SurveyBuilder";

const router = createBrowserRouter([
  { path: "/", element: <Homepage />, errorElement: <ErrorPage /> },
  { path: "/register", element: <Signup /> },
  { path: "/login", element: <Signin /> },
  {
    element: <PersistLogin />,
    children: [
      {
        path: "/dash",
        element: <Dashboard />,
        children: [{ path: "w/:workspaceId", element: <SurveysListMain /> }],
      },
      {
        path: "/survey/:surveyID/create",
        element: <SurveyBuilder />,
      },
      {
        path: "/s/create",
        element: <SurveyBuilder />,
      },

      // {
      //   path: "/s/results/:surveyID",
      //   element: <SurveyShare />,
      // },
    ],
  },
]);

export default router;
