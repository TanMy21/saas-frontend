import { zodResolver } from "@hookform/resolvers/zod";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import {
  Box,
  Button,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { useElectricTheme } from "../../theme/useElectricTheme";
import { forgetPasswordSchema } from "../../utils/schema";
import {
  ForgotPasswordRequest,
  PasswordResetFormProps,
} from "../../utils/types";
import FormErrors from "../FormErrors";

const PasswordResetForm = ({
  setSubmittedEmail,
  forgotPassword,
  isLoading,
  isSuccess,
}: PasswordResetFormProps) => {
  const { primary, background, grey, textStyles, shadows } = useElectricTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordRequest>({
    resolver: zodResolver(forgetPasswordSchema),
  });

  const submitForgotPasswordRequest = async (data: ForgotPasswordRequest) => {
    const { email } = data;
    setSubmittedEmail(email);
    try {
      await forgotPassword(email).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = (data: ForgotPasswordRequest) => {
    submitForgotPasswordRequest(data);
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "60%",
        bgcolor: background.soft1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 600,
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              mb: 1,
            }}
          >
            <Typography sx={textStyles.gradientSecondary}>
              Reset password
            </Typography>
          </Box>
          <Typography sx={{ color: grey[955] }}>
            We'll send you instructions via email
          </Typography>
        </Box>
        {/* Main Card */}
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: shadows[9],
          }}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            {/* Email Input */}
            <Box>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                InputLabelProps={{ style: { color: grey[600] } }}
                {...register("email")}
                variant="filled"
                sx={{
                  mb: 2,
                  "& .MuiFilledInput-root": {
                    borderRadius: 4,
                    backgroundColor: background.soft1,
                    borderBottom: "none !important",
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: background.soft1,
                    },
                    "&.Mui-focused": {
                      backgroundColor: background.soft1,
                      boxShadow: "none",
                    },
                    "&:before, &:after": {
                      display: "none",
                    },
                  },
                  "& .MuiInputAdornment-root": {
                    backgroundColor: background.soft1,
                    borderRadius: "12px 0 0 12px",
                    paddingLeft: "8px",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutlineIcon sx={{ color: grey[600] }} />
                    </InputAdornment>
                  ),
                }}
              />
              {errors.email && <FormErrors errors={errors.email?.message} />}
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || isSuccess}
              fullWidth
              variant="gradientPrimary"
            >
              {isLoading ? (
                "Sending..."
              ) : isSuccess ? (
                <>
                  <CheckCircleIcon style={{ marginRight: 8 }} />
                  Instructions sent
                </>
              ) : (
                <>
                  Send reset instructions
                  <ArrowForwardIcon style={{ marginLeft: 8 }} />
                </>
              )}
            </Button>

            {/* Back to Sign In */}
            <Link to="/login" style={{ textDecoration: "none" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  color: primary.main,
                  fontWeight: "medium",
                  "&:hover": { textDecoration: "none" },
                }}
              >
                <ArrowBackIcon />
                Back to sign in
              </Box>
            </Link>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default PasswordResetForm;
