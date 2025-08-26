import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import toast, { ToastOptions } from "react-hot-toast";

const colors = {
  info: "#2563EB",
  success: "#16A34A",
  error: "#DC2626",
  warning: "#D97706",
};

export const toastInfo = (message: string) => {
  toast.custom((t) => (
    <div
      style={{
        background: "#FEF9C3",
        color: "#92400E",
        padding: "12px 16px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <InfoOutlinedIcon style={{ color: "#D97706" }} />
      <span>{message}</span>
    </div>
  ));
};

export const toastSuccess = (msg: string, options?: ToastOptions) =>
  toast(msg, {
    icon: <CheckCircleIcon style={{ color: colors.success }} />,
    ...options,
  });

export const toastError = (msg: string, options?: ToastOptions) =>
  toast(msg, {
    icon: <ErrorOutlineIcon style={{ color: colors.error }} />,
    ...options,
  });

export const toastWarning = (msg: string, options?: ToastOptions) =>
  toast(msg, {
    icon: <WarningAmberIcon style={{ color: colors.warning }} />,
    ...options,
  });
