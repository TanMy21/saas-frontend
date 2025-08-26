import { ThemeProvider } from "@mui/material";
import { PostHogProvider } from "posthog-js/react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import store from "./app/store";
import AppErrorBoundary from "./AppErrorBoundary";
import router from "./routes/routes";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import "../src/utils/analytics";
import "../src/utils/sentry";
import SessionInitializer from "./SessionInitializer";
import electricBlueLightTheme from "./theme/electricBlueLightTheme";

const options = {
  api_host: import.meta.env.VITE_POSTHOG_HOST,
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <>
    <Provider store={store}>
      <AppErrorBoundary>
        <ThemeProvider theme={electricBlueLightTheme}>
          <PostHogProvider
            apiKey={import.meta.env.VITE_POSTHOG_KEY}
            options={options}
          >
            <SessionInitializer>
              <RouterProvider router={router} />
            </SessionInitializer>
          </PostHogProvider>
        </ThemeProvider>
      </AppErrorBoundary>
    </Provider>
    <Toaster position="bottom-right" reverseOrder={false} />
    <ToastContainer />
  </>
  // </React.StrictMode>
);
