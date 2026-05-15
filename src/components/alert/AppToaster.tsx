import { Toaster } from "react-hot-toast";

const AppToaster = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={10}
      toastOptions={{
        // Default 
        duration: 3500,
        // Shared base styling.
        style: {
          borderRadius: "10px",
          padding: "14px 16px",
          fontSize: "14px",
          fontWeight: 500,
          maxWidth: "420px",
          lineHeight: "1.4",
          boxShadow:
            "0 10px 30px rgba(15, 23, 42, 0.14), 0 2px 8px rgba(15, 23, 42, 0.08)",
        },
        // Success toast styling.
        success: {
          duration: 3500,
          style: {
            background: "#16A34A",
            color: "#FFFFFF",
          },
          iconTheme: {
            primary: "#FFFFFF",
            secondary: "#16A34A",
          },
        },
        // Error toast styling.
        error: {
          duration: 4500,
          style: {
            background: "#DC2626",
            color: "#FFFFFF",
          },
          iconTheme: {
            primary: "#FFFFFF",
            secondary: "#DC2626",
          },
        },
        // Loading toast styling.
        loading: {
          style: {
            background: "#0F172A",
            color: "#FFFFFF",
          },
        },
      }}
    />
  );
};

export default AppToaster;