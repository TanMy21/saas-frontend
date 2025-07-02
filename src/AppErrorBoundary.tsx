import { ErrorBoundary } from "react-error-boundary";
import { useNavigate } from "react-router-dom";

import { AppErrorBoundaryProps, ErrorFallbackProps } from "./utils/types";

function ErrorFallback(props: ErrorFallbackProps) {
  const navigate = useNavigate();
  const { error, resetErrorBoundary } = props;

  return (
    <div role="alert" style={{ textAlign: "center", padding: "2rem" }}>
      <img
        src="/error_500.svg"
        alt="Something went wrong"
        style={{ maxWidth: "300px", marginBottom: "1rem" }}
      />
      <h2>Oops! Something went wrong.</h2>
      <p style={{ color: "red" }}>{error.message}</p>
      <button
        onClick={() => {
          resetErrorBoundary();
          navigate("/dash");
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
      onReset={() => {
        window.location.reload();
      }}
    >
      {props.children}
    </ErrorBoundary>
  );
}
