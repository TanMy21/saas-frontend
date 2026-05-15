import { Box } from "@mui/material";

import { useResetPasswordMutation } from "../../app/slices/authApiSlice";
import { useToast } from "../../hooks/useToast";
import { ResetPassword } from "../../utils/types";

import NewPasswordForm from "./NewPasswordForm";
import PasswordResetSuccessCard from "./PasswordResetSuccessCard";

const ResetPasswordCard = ({ code }: ResetPassword) => {
  const [resetPassword, { isSuccess, isError, error }] =
    useResetPasswordMutation();

  useToast({
    isError,
    error,
  });

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "60%",
          borderRadius: "12px",
        }}
      >
        {isSuccess ? (
          <PasswordResetSuccessCard />
        ) : (
          <NewPasswordForm code={code} resetPassword={resetPassword} />
        )}
      </Box>
    </>
  );
};

export default ResetPasswordCard;
