import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerSchema } from "../utils/signupSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useAddNewUserMutation } from "../app/slices/userApiSlice";
import { ErrorData, RegisterFormData } from "../utils/types";
import FormErrors from "../components/FormErrors";

const Signup = () => {
  const [addNewUser, { isSuccess, isError, error }] = useAddNewUserMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Registration Successful !", {
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
        theme: "colored",
      });
      navigate("/login");
    }

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
  }, [isSuccess, isError, navigate, error]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const submitRegisterData = async (data: RegisterFormData) => {
    const { confirmPassword, ...newData } = data;
    await addNewUser(newData);
  };

  return (
    <>
      <Container component="main" sx={{ width: "100%", minHeight: "900px" }}>
        <Box
          sx={{
            marginTop: 12,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Paper
            elevation={2}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "50%",
              p: 4,
            }}
          >
            <Link to="/" style={{ textDecoration: "none" }}>
              <Typography variant="h1" component="h2">
                Logo
              </Typography>
            </Link>

            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <form onSubmit={handleSubmit(submitRegisterData)}>
              <Box sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="given-name"
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                      autoFocus
                      {...register("firstname")}
                    />
                    {errors.firstname && (
                      <FormErrors errors={errors.firstname.message} />
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      autoComplete="family-name"
                      {...register("lastname")}
                    />
                    {errors.lastname && (
                      <FormErrors errors={errors.lastname.message} />
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      autoComplete="email"
                      {...register("email")}
                    />
                    {errors.email && (
                      <FormErrors errors={errors.email.message} />
                    )}
                  </Grid>
                  <Grid item xs={12}>
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
                  </Grid>
                  <Grid item xs={12}>
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
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Organization"
                      type="organization"
                      id="organization"
                      autoComplete="organization"
                      {...register("organization")}
                    />
                    {errors.organization && (
                      <FormErrors errors={errors.organization.message} />
                    )}
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign Up
                </Button>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link to="/login">Already have an account? Sign in</Link>
                  </Grid>
                </Grid>
              </Box>
            </form>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default Signup;
