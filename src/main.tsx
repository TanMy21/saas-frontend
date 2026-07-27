import { ThemeProvider } from "@mui/material";
import { type BeforeSendFn } from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";

import store from "./app/store";
import AppErrorBoundary from "./AppErrorBoundary";
import AppToaster from "./components/alert/AppToaster";
import { EditLockConfirmProvider } from "./context/EditLockConfirmContext";
import GlobalFeedbackOverlays from "./layouts/GlobalFeedbackLayout";
import { GlobalGenerateLoaderOverlay } from "./layouts/GlobalGenerateLoaderOverlay";
import { GlobalImportLoaderOverlay } from "./layouts/GlobalImporLoaderOverlay";
import router from "./routes/routes";
import "./index.css";
import "../src/utils/sentry";
import SessionInitializer from "./SessionInitializer";
import electricBlueLightTheme from "./theme/electricBlueLightTheme";
import { sanitizeTelemetryUrl } from "./utils/sanitizeTelemetryUrl";

const scrubPostHogEvent: BeforeSendFn = (event) => {
  if (!event?.properties) return event;

  const urlProperties = [
    "$current_url",
    "$pathname",
    "$referrer",
    "current_url",
    "url",
    "referrer",
  ];

  urlProperties.forEach((propertyName) => {
    const value = event.properties[propertyName];

    if (typeof value === "string") {
      event.properties[propertyName] = sanitizeTelemetryUrl(value);
    }
  });

  return event;
};

const options = {
  api_host: import.meta.env.VITE_POSTHOG_HOST,
  autocapture: false,
  mask_all_text: true,
  before_send: scrubPostHogEvent,
  session_recording: {
    maskAllInputs: true,
  },
};

createRoot(document.getElementById("root")!).render(
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
              <EditLockConfirmProvider>
                <RouterProvider router={router} />
                <GlobalFeedbackOverlays />
                <GlobalImportLoaderOverlay />
                <GlobalGenerateLoaderOverlay />
              </EditLockConfirmProvider>
            </SessionInitializer>
          </PostHogProvider>
        </ThemeProvider>
      </AppErrorBoundary>
    </Provider>
    {/* <Toaster position="bottom-right" reverseOrder={false} /> */}
    <AppToaster />
    {/* <ToastContainer /> */}
  </>,
  // </React.StrictMode>
);
