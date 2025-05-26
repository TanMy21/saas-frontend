import { useEffect } from "react";

import { Box } from "@mui/material";
import { toast } from "react-toastify";

import { useResetPasswordMutation } from "../../app/slices/authApiSlice";
import { ErrorData, ResetPassword } from "../../utils/types";

import NewPasswordForm from "./NewPasswordForm";
import PasswordResetSuccessCard from "./PasswordResetSuccessCard";

const ResetPasswordCard = ({ code }: ResetPassword) => {
  const [resetPassword, { isSuccess, isError, error }] =
    useResetPasswordMutation();

  useEffect(() => {
    if (isError) {
      const errorData = error as ErrorData;

      if (Array.isArray(errorData.data.error)) {
        errorData.data.error.forEach((el) =>
          toast.error(el.message, {
            position: "top-right",
          })
        );
      } else {
        toast.error(errorData.data.message, {
          position: "top-right",
        });
      }
    }
  }, [isError, error]);

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
