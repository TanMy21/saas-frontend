import { Alert, Box, Button, Container, Paper, TextField } from "@mui/material";
import { Link, useSearchParams } from "react-router-dom";
import FormErrors from "../components/FormErrors";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordFormData } from "../utils/types";
import { useForm } from "react-hook-form";
import { resetPasswordSchema } from "../utils/schema";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const exp = Number(searchParams.get("exp"));
  const now = Date.now();
  const linkIsValid = true;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const submitResetPassword = async (data: ResetPasswordFormData) => {
    const { password } = data;
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ marginTop: "12%" }}>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={8}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "80%",
            p: 4,
          }}
        >
          <Box sx={{ width: "100%" }}>
            {linkIsValid ? (
              <form onSubmit={handleSubmit(submitResetPassword)}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    mt: 3,
                  }}
                >
                  <Box>
                    <TextField
                      required
                      fullWidth
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                      {...register("password")}
                    />
                    {errors.password && (
                      <FormErrors errors={errors.password.message} />
                    )}
                  </Box>
                  <Box mt={2}>
                    <TextField
                      required
                      fullWidth
                      label="Confirm password"
                      type="password"
                      id="confirmPassword"
                      autoComplete="confirm-password"
                      {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && (
                      <FormErrors errors={errors.confirmPassword.message} />
                    )}
                  </Box>
                  <Box mt={1}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2, textTransform: "capitalize" }}
                    >
                      Reset Password
                    </Button>
                  </Box>
                </Box>
              </form>
            ) : (
              <Box>
                <Box>
                  <Alert severity="error" sx={{ fontSize: "24px" }}>
                    Invalid Link.
                  </Alert>
                </Box>
                <Box>
                  <Link to="/forgot" style={{ padding: 5 }}>
                    Request a new password reset link
                  </Link>
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ResetPassword;
