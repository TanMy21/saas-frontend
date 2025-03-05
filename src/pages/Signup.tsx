import { useEffect } from "react";

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
import { useForm } from "react-hook-form";
import { FaSignInAlt } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAddNewUserMutation } from "../app/slices/userApiSlice";
import FormErrors from "../components/FormErrors";
import { registerSchema } from "../utils/signupSchema";
import { ErrorData, RegisterFormData } from "../utils/types";

const Signup = () => {
  const [addNewUser, { isLoading, isSuccess, isError, error }] =
    useAddNewUserMutation();

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
    // eslint-disable-next-line
    const { confirmPassword, ...newData } = data;
    await addNewUser(newData);
  };

  const handleGoogleAuth = () => {
    try {
      window.location.href = `${import.meta.env.VITE_BASE_URL}/auth/google`;
      console.log(
        "Google Auth: ",
        `${import.meta.env.VITE_BASE_URL}/auth/google`
      );
    } catch (err: any) {
      toast.error(err?.data?.message, {
        position: "top-right",
      });
    }
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
              borderRadius: "16px",
            }}
          >
            {/* <Link to="/" style={{ textDecoration: "none" }}>
              <Typography variant="h1" component="h2">
                Logo
              </Typography>
            </Link> */}

            <Typography
              component="h1"
              variant="h4"
              sx={{ fontWeight: 800, color: "#101828" }}
            >
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
                  disabled={isLoading}
                  sx={{
                    mt: 2,
                    mb: 2,
                    fontWeight: 700,
                    backgroundColor: "#4C6FFF",
                    textTransform: "capitalize",
                    borderRadius: "4px",
                    "&:hover": {
                      backgroundColor: "#4C6FFF",
                    },
                  }}
                >
                  {isLoading ? "Registering..." : "Sign Up"}
                </Button>
                <Button
                  onClick={handleGoogleAuth}
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 1,
                    mb: 2,
                    fontWeight: 700,
                    backgroundColor: "#E0EFFE",
                    textTransform: "capitalize",
                    color: "#007DFA",
                    borderRadius: "4px",
                    "&:hover": {
                      backgroundColor: "#E0EFFE",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Box sx={{ marginTop: "2%" }}>
                      <FcGoogle size={24} />
                    </Box>
                    <Box sx={{ fontWeight: 700, fontSize: "16px" }}>
                      Continue with Google
                    </Box>
                  </Box>
                </Button>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link to="/login" style={{ textDecoration: "none" }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 1,
                          fontWeight: 600,
                          color: "#494454",
                        }}
                      >
                        <Box>Already have an account?&nbsp; Sign in</Box>
                        <Box sx={{ fontSize: "24px", marginTop: "2%" }}>
                          <FaSignInAlt />
                        </Box>
                      </Box>
                    </Link>
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
