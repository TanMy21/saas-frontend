import * as Sentry from "@sentry/react";
import { ErrorBoundary } from "react-error-boundary";

import { AppErrorBoundaryProps, ErrorFallbackProps } from "./utils/types";

function ErrorFallback(props: ErrorFallbackProps) {
  const { resetErrorBoundary } = props;

  return (
    <div role="alert" style={{ textAlign: "center", padding: "2rem" }}>
      <img
        src="/error_500.svg"
        alt="Something went wrong"
        style={{ maxWidth: "300px", marginBottom: "1rem" }}
      />
      <h2>Oops! Something went wrong.</h2>
      <p style={{ color: "red" }}>
        Something unexpected happened. Please try again.
      </p>
      <button
        onClick={() => {
          resetErrorBoundary();
          window.location.href = "/dash";
        }}
        style={{ marginTop: "1rem" }}
      >
        Go Home
      </button>
    </div>
  );
}

export default function AppErrorBoundary(props: AppErrorBoundaryProps) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        Sentry.captureException(error, {
          extra: {
            componentStack: info.componentStack,
          },
        });
      }}
      onReset={() => {
        window.location.reload();
      }}
    >
      {props.children}
    </ErrorBoundary>
  );
}
