import { PostHogProvider } from "posthog-js/react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import store from "./app/store";
import router from "./routes/routes";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import "../src/utils/analytics";
import "../src/utils/sentry";

const options = {
  api_host: import.meta.env.VITE_POSTHOG_HOST,
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <Provider store={store}>
      <PostHogProvider
        apiKey={import.meta.env.VITE_POSTHOG_KEY}
        options={options}
      >
        <RouterProvider router={router} />
      </PostHogProvider>
    </Provider>
    <ToastContainer />
  </>
);
