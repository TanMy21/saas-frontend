import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import LockIcon from "@mui/icons-material/Lock";
import LoginIcon from "@mui/icons-material/Login";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  CircularProgress,
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
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  useLazyGoogleAuthQuery,
  useLoginMutation,
} from "../app/slices/authApiSlice";
import { setCredentials } from "../app/slices/authSlice";
import FormErrors from "../components/FormErrors";
import usePersist from "../hooks/persist";
import { loginSchema } from "../utils/schema";
import { ErrorData, FetchBaseQueryError, LoginFormData } from "../utils/types";

const Signin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //eslint-disable-next-line
  const [persist, setPersist] = usePersist();
  const [showPassword, setShowPassword] = useState(false);
  // const [googleAuthClicked, setGoogleAuthClicked] = useState(false);

  const [login, { isLoading, isError, error }] = useLoginMutation();
  const [
    googleAuth,
    {
      data: googleAuthData,
      isError: isGoogleAuthError,
      error: googleAuthError,
    },
  ] = useLazyGoogleAuthQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handlePersist = () => setPersist((prev) => !prev);

  const submitLoginData = async (data: LoginFormData) => {
    const { email, password } = data;
    try {
      const { accessToken } = await login({ email, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
      handlePersist();
      navigate("/dash");
    } catch (error) {
      const errorData = error as FetchBaseQueryError;
      if (!errorData.status) {
        toast.error("No Server Response", { position: "top-right" });
      } else if (errorData.status === 400) {
        toast.error("Missing Username or Password", {
          position: "top-right",
        });
      } else if (errorData.status === 401) {
        toast.error("Unauthorized", { position: "top-right" });
      } else {
        toast.error(errorData.data?.message || "An error occurred", {
          position: "top-right",
        });
      }
    }
  };

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
  }, [error]);

  useEffect(() => {
    if (isGoogleAuthError) {
      const errorData = googleAuthError as ErrorData;
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
  }, [isGoogleAuthError, googleAuthError]);

  const handleGoogleAuth = () => {
    try {
      window.location.href = `${import.meta.env.VITE_BASE_URL}/auth/google`;
    } catch (err: any) {
      toast.error(err?.data?.message, {
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const isGoogleAuth = queryParams.get("auth") === "g";

    if (isGoogleAuth && location.pathname === "/login") {
      googleAuth({});
    }

    if (googleAuthData) {
      const { accessToken } = googleAuthData;

      dispatch(setCredentials({ accessToken }));

      navigate("/dash");
    }

    if (isGoogleAuth && googleAuthError) {
      console.error("Failed to fetch access token:", error);
      navigate("/login");
    }
  }, [
    location,
    googleAuthData,
    dispatch,
    navigate,
    googleAuth,
    isGoogleAuthError,
    googleAuthError,
  ]);

  if (isLoading) return <CircularProgress />;

  document.body.style.overflowY = "hidden";

  return (
    <Container component="main" maxWidth="xl" sx={{ overflowY: "hidden" }}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          backgroundColor: "#F8F9FF",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 480,
            marginTop: "-4%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              textAlign: "center",
              mb: 3,
            }}
          >
            <Link to="/" style={{ textDecoration: "none" }}>
              <img
                src="/favicon.png"
                alt="Your Image"
                style={{
                  maxWidth: "25%",
                  maxHeight: "25%",
                  objectFit: "contain",
                }}
              />
            </Link>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                background: "linear-gradient(to right, #7C3AED, #EC4899)",
                WebkitBackgroundClip: "text",
                color: "transparent",
                display: "inline-block",
              }}
            >
              Welcome back
            </Typography>
            <Typography variant="body1" sx={{ color: "gray" }}>
              Sign in to your account
            </Typography>
          </Box>

          <Paper
            sx={{
              p: 4,
              borderRadius: "20px",
              boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            <form onSubmit={handleSubmit(submitLoginData)}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email address"
                InputLabelProps={{ style: { color: "gray" } }}
                autoComplete="email"
                autoFocus
                {...register("email")}
                variant="filled"
                sx={{
                  mb: 2,
                  borderRadius: "12px",
                  backgroundColor: "#F8F9FF",
                  "& .MuiFilledInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#F8F9FF",
                    borderBottom: "none !important",
                    "&:before, &:after": {
                      display: "none",
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
                margin="normal"
                required
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                InputLabelProps={{ style: { color: "gray" } }}
                id="password"
                autoComplete="password"
                variant="filled"
                {...register("password")}
                sx={{
                  mb: 2,
                  borderRadius: "12px",
                  backgroundColor: "#F8F9FF",
                  "& .MuiFilledInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#F8F9FF",
                    borderBottom: "none !important",
                    "&:before, &:after": {
                      display: "none",
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
              />

              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                <Link
                  to="/forgot"
                  style={{
                    color: "#6760E9",
                    fontSize: "14px",
                    textDecoration: "none",
                  }}
                >
                  Forgot password?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1,
                  py: 1.5,
                  borderRadius: "12px",
                  fontWeight: "medium",
                  background: "linear-gradient(to right, #7C3AED, #EC4899)",
                  color: "white",
                  textTransform: "unset",
                  "&:hover": { opacity: 0.9 },
                }}
              >
                Sign in <LoginIcon />
              </Button>

              <Divider sx={{ color: "#6B7280", my: 3 }}>
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
                  borderRadius: "12px",
                  color: "#6760EA",
                  borderColor: "#F1F3F5",
                  textTransform: "unset",
                  "&:hover": {
                    borderColor: "#F1F3F5",
                  },
                }}
              >
                <FcGoogle size={24} />
                Continue with Google
              </Button>

              <Typography
                variant="body2"
                sx={{ textAlign: "center", mt: 2, color: "gray" }}
              >
                Don't have an account?{" "}
                <Link
                  to="/register"
                  style={{
                    color: "#7C3AED",
                    fontWeight: "medium",
                    textDecoration: "none",
                  }}
                >
                  Sign up
                </Link>
              </Typography>
            </form>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default Signin;
