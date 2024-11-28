// import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import store from "./app/store";
import router from "./routes/routes";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import "../src/utils/sentry";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
    <ToastContainer />
  </>
  // </React.StrictMode>
);
