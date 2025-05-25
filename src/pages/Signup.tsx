import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import BusinessIcon from "@mui/icons-material/Business";
import LockIcon from "@mui/icons-material/Lock";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAddNewUserMutation } from "../app/slices/userApiSlice";
import FormErrors from "../components/FormErrors";
import { useElectricTheme } from "../theme/useElectricTheme";
import { registerSchema } from "../utils/signupSchema";
import { ErrorData, RegisterFormData } from "../utils/types";

const Signup = () => {
  const { primary, background, grey, shadows, gradient, borders, brand } =
    useElectricTheme();
  const [addNewUser, { isLoading, isSuccess, isError, error }] =
    useAddNewUserMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Registration Successful!, check email", {
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
      window.location.href = `${import.meta.env.VITE_BASE_URL}/auth/google/callback`;
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
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 3,
            // backgroundColor: "#F8F9FF",
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 480, mt: "-8%" }}>
            <Box
              sx={{
                width: "80%",
                height: "60%",
                margin: "auto",
                textAlign: "center",
                mb: 2,
              }}
            >
              <Link to="/" style={{ textDecoration: "none" }}>
                <img
                  src="/Logo.png"
                  alt="Your Image"
                  style={{
                    maxWidth: "20%",
                    maxHeight: "20%",
                    objectFit: "contain",
                  }}
                />
              </Link>
              <Typography
                variant="body1"
                sx={{ fontSize: "20px", color: grey[500] }}
              >
                Create your account
              </Typography>
            </Box>
            <Paper
              sx={{
                p: 4,
                borderRadius: 3,
                boxShadow: shadows[9],
              }}
            >
              <form onSubmit={handleSubmit(submitRegisterData)}>
                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: "2%" }}
                  >
                    <TextField
                      required
                      fullWidth
                      id="firstName"
                      label="First name"
                      variant="filled"
                      InputLabelProps={{ style: { color: grey[500] } }}
                      autoFocus
                      {...register("firstname")}
                      sx={{
                        borderRadius: 3,
                        backgroundColor: brand.bgColor2,
                        "& .MuiFilledInput-root": {
                          borderRadius: 3,
                          backgroundColor: brand.bgColor2,
                          borderBottom: "none !important",
                          "&:before, &:after": {
                            display: "none",
                            backgroundColor: brand.bgColor2,
                          },
                        },
                      }}
                    />
                    {errors.firstname && (
                      <FormErrors errors={errors.firstname.message} />
                    )}
                  </Box>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: "2%" }}
                  >
                    <TextField
                      required
                      fullWidth
                      id="lastName"
                      label="Last name"
                      InputLabelProps={{ style: { color: grey[500] } }}
                      variant="filled"
                      {...register("lastname")}
                      sx={{
                        borderRadius: 3,
                        backgroundColor: brand.bgColor2,
                        "& .MuiFilledInput-root": {
                          borderRadius: 3,
                          backgroundColor: brand.bgColor2,
                          borderBottom: "none !important",
                          "&:before, &:after": {
                            display: "none",
                            backgroundColor: brand.bgColor2,
                          },
                        },
                      }}
                    />{" "}
                    {errors.lastname && (
                      <FormErrors errors={errors.lastname.message} />
                    )}
                  </Box>
                </Box>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email address"
                  InputLabelProps={{ style: { color: grey[500] } }}
                  variant="filled"
                  {...register("email")}
                  sx={{
                    mb: 2,
                    borderRadius: 3,
                    backgroundColor: brand.bgColor2,
                    "& .MuiFilledInput-root": {
                      borderRadius: 3,
                      backgroundColor: brand.bgColor2,
                      borderBottom: "none !important",
                      "&:before, &:after": {
                        display: "none",
                        backgroundColor: brand.bgColor2,
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailOutlineIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                {errors.email && <FormErrors errors={errors.email.message} />}
                <TextField
                  required
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  variant="filled"
                  InputLabelProps={{ style: { color: grey[500] } }}
                  autoComplete="new-password"
                  {...register("password")}
                  sx={{
                    mb: 2,
                    borderRadius: 3,
                    backgroundColor: brand.bgColor2,
                    "& .MuiFilledInput-root": {
                      borderRadius: 3,
                      backgroundColor: brand.bgColor2,
                      borderBottom: "none !important",
                      "&:before, &:after": {
                        display: "none",
                        backgroundColor: brand.bgColor2,
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />{" "}
                {errors.password && (
                  <FormErrors errors={errors.password.message} />
                )}
                <TextField
                  required
                  fullWidth
                  label="Confirm password"
                  InputLabelProps={{ style: { color: grey[500] } }}
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  variant="filled"
                  autoComplete="confirm-password"
                  {...register("confirmPassword")}
                  sx={{
                    mb: 2,
                    borderRadius: 3,
                    backgroundColor: brand.bgColor2,
                    "& .MuiFilledInput-root": {
                      borderRadius: 3,
                      backgroundColor: brand.bgColor2,
                      borderBottom: "none !important",
                      "&:before, &:after": {
                        display: "none",
                        backgroundColor: brand.bgColor2,
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />{" "}
                {errors.confirmPassword && (
                  <FormErrors errors={errors.confirmPassword.message} />
                )}
                <TextField
                  required
                  fullWidth
                  label="Organization"
                  type="organization"
                  id="organization"
                  variant="filled"
                  InputLabelProps={{ style: { color: grey[500] } }}
                  autoComplete="organization"
                  {...register("organization")}
                  sx={{
                    mb: 2,
                    borderRadius: 3,
                    backgroundColor: brand.bgColor2,
                    "& .MuiFilledInput-root": {
                      borderRadius: 3,
                      backgroundColor: brand.bgColor2,
                      borderBottom: "none !important",
                      "&:before, &:after": {
                        display: "none",
                        backgroundColor: brand.bgColor2,
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon />
                      </InputAdornment>
                    ),
                  }}
                />{" "}
                {errors.organization && (
                  <FormErrors errors={errors.organization.message} />
                )}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  sx={{
                    py: 1.5,
                    borderRadius: 4,
                    fontWeight: "medium",
                    background: gradient.background,
                    color: background.paper,
                    textTransform: "unset",
                    "&:hover": { opacity: 0.9 },
                  }}
                >
                  {isLoading ? "Creating account..." : "Create account →"}
                </Button>
                <Divider sx={{ my: 3, color: brand.divider1 }}>
                  or continue with
                </Divider>
                <Button
                  onClick={handleGoogleAuth}
                  fullWidth
                  variant="outlined"
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 1,
                    py: 1.5,
                    borderRadius: 3,
                    color: brand.btnTxt1,
                    border: borders.subtle,
                    textTransform: "unset",
                    "&:hover": {
                      border: borders.subtle,
                    },
                  }}
                >
                  <FcGoogle size={24} />
                  Continue with Google
                </Button>
                <Typography
                  variant="body2"
                  sx={{ textAlign: "center", mt: 2, color: grey[600] }}
                >
                  Already have an account? &nbsp;
                  <Link
                    to="/login"
                    style={{
                      textDecoration: "none",
                      color: primary.main,
                      fontWeight: "bold",
                    }}
                  >
                    Sign in
                  </Link>
                </Typography>
              </form>
            </Paper>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Signup;
