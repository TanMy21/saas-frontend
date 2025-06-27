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
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAddNewUserMutation } from "../app/slices/userApiSlice";
import FormErrors from "../components/FormErrors";
import { useAppTheme } from "../theme/useAppTheme";
import { registerSchema } from "../utils/signupSchema";
import { ErrorData, RegisterFormData } from "../utils/types";

const Signup = () => {
  const { primary, background, grey, shadows, gradient, borders, brand } =
    useAppTheme();
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
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        overflowY: "auto",
        // border: "3px solid red",
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", sm: "100%", md: "80%", lg: "80%", xl: "80%" },
          minHeight: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          margin: "auto",
          p: { xs: 0, sm: 0, md: 1 },
          flexShrink: 0,
          backgroundColor: "#F8F9FF",
          // border: "2px solid green",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            margin: {
              xs: "8% 0",
              sm: "8% 0",
              md: "0% auto",
              lg: "4% auto",
              xl: "4% auto",
            },
            gap: "2px",
            width: { xs: "100%", sm: "100%", md: "40%", lg: "48%", xl: "36%" },
            // border: "2px solid blue",
            "@media (orientation: portrait)": {
              width: { xs: "96%", sm: "96%", md: "80%" },
            },
            "@media screen and (max-height: 500px)": {
              width: "100%",
              margin: 0,
            },
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              margin: "0 auto",
              width: "60%",
              height: { md: "8%", lg: "12%", xl: "12%" },
              // border: "2px solid red",
            }}
          >
            <Box
              sx={{
                display: "flex",
                margin: "auto",
                justifyContent: "center",
                alignItems: "center",
                width: { xs: "40%", sm: "40%", md: "36%", xl: "32%" },
                height: "98%",
                // border: "2px solid green",
              }}
            >
              <Link
                to="/"
                style={{
                  margin: "auto",
                  marginLeft: "2%",
                  textDecoration: "none",
                }}
              >
                <img
                  src="/Logo.png"
                  alt="logo"
                  style={{
                    maxWidth: "80%",
                    maxHeight: "96%",
                    objectFit: "contain",
                  }}
                />
              </Link>
            </Box>
          </Box>
          {/* text */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              margin: "0 auto",
              justifyContent: "center",
              alignItems: "center",
              width: "80%",
              height: "40px",
              // border: "2px solid red",
            }}
          >
            <Typography
              variant="body1"
              sx={{ fontSize: "20px", color: grey[600] }}
            >
              Create . Share . Understand
            </Typography>
          </Box>
          {/* form */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              margin: "1% auto",
              width: "96%",
              height: "76%",
              // border: "2px solid red",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: {
                  xs: "92%",
                  sm: "92%",
                  md: "60%",
                  lg: "72%",
                  xl: "88%",
                },
                backgroundColor: "white",
                p: { xs: 3, sm: 4 },
                borderRadius: 3,
                boxShadow: shadows[9],
              }}
            >
              <form onSubmit={handleSubmit(submitRegisterData)}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "98%",
                    height: "96%",
                    gap: 1,
                    // border: "2px solid black",
                  }}
                >
                  {/* firstname & lastname */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: {
                        xs: "column",
                        sm: "column",
                        md: "row",
                        lg: "row",
                        xl: "row",
                      },
                      justifyContent: "center",
                      gap: 2,
                      width: "100%",
                      height: "4%",
                      mb: 2,
                      // border: "2px solid red",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        width: {
                          xs: "100%",
                          sm: "100%",
                          md: "48%",
                          lg: "48%",
                          xl: "48%",
                        },
                        flexDirection: "column",
                        gap: "2%",
                      }}
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
                      sx={{
                        display: "flex",
                        width: {
                          xs: "100%",
                          sm: "100%",
                          md: "48%",
                          lg: "48%",
                          xl: "48%",
                        },
                        flexDirection: "column",
                        gap: "2%",
                      }}
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
                  {/* email */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      width: "100%",
                      height: "4%",
                      // border: "2px solid red",
                    }}
                  >
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
                    {errors.email && (
                      <FormErrors errors={errors.email.message} />
                    )}
                  </Box>
                  {/* password */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      width: "100%",
                      height: "4%",
                      // border: "2px solid red",
                    }}
                  >
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
                  </Box>
                  {/* confirmPassword */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      width: "100%",
                      height: "4%",
                      // border: "2px solid red",
                    }}
                  >
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
                  </Box>
                  {/* organization */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      width: "100%",
                      height: "4%",
                      // border: "2px solid red",
                    }}
                  >
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
                  </Box>
                  {/* create button */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      width: "100%",
                      height: "4%",
                      // border: "2px solid red",
                    }}
                  >
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={isLoading}
                      sx={{
                        py: 1,
                        borderRadius: 4,
                        fontWeight: "medium",
                        background: gradient.background,
                        color: background.paper,
                        textTransform: "unset",
                        "&:hover": { opacity: 0.9 },
                      }}
                    >
                      {isLoading ? "Creating account..." : "Join the Flow →"}
                    </Button>
                  </Box>
                  <Divider sx={{ my: 1, color: brand.divider1 }}>
                    or continue with
                  </Divider>
                  {/* sso button */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      width: "100%",
                      height: "6%",
                      // border: "2px solid red",
                    }}
                  >
                    <Button
                      onClick={handleGoogleAuth}
                      fullWidth
                      variant="outlined"
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 1,
                        py: 1,
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
                  </Box>
                </Box>
              </form>
            </Box>
          </Box>
          {/*footer: already have an account */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              width: "100%",
              mt: 1,
              height: "6%",
              // border: "2px solid red",
            }}
          >
            <Typography
              variant="body2"
              sx={{ textAlign: "center", color: grey[600] }}
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
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Signup;
