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
import LogoLoader from "../components/Loaders/LogoLoader";
import usePersist from "../hooks/persist";
import { useAppTheme } from "../theme/useAppTheme";
import { loginSchema } from "../utils/schema";
import { ErrorData, FetchBaseQueryError, LoginFormData } from "../utils/types";

const Signin = () => {
  const { primary, background, grey, shadows, gradient, borders, brand } =
    useAppTheme();
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

  if (isLoading)
    return (
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "100%",
          margin: "auto",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LogoLoader />
      </Box>
    );

  document.body.style.overflowY = "hidden";

  return (
    <Container
      component="main"
      maxWidth="xl"
      sx={{ overflowY: "hidden", overflowX: "hidden" }}
    >
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
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
            <Box sx={{ width: "60%", height: "60%", margin: "auto" }}>
              <Link to="/" style={{ textDecoration: "none" }}>
                <img
                  src="/Logo.png"
                  alt="logo"
                  style={{
                    maxWidth: "25%",
                    maxHeight: "25%",
                    objectFit: "contain",
                  }}
                />
              </Link>
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                background: gradient.background,
                WebkitBackgroundClip: "text",
                color: "transparent",
                display: "inline-block",
              }}
            >
              Welcome back
            </Typography>
            <Typography variant="body1" sx={{ color: grey[600] }}>
              Create . Share . Learn
            </Typography>
          </Box>

          <Paper
            sx={{
              p: 4,
              borderRadius: 5,
              boxShadow: shadows[9],
            }}
          >
            <form onSubmit={handleSubmit(submitLoginData)}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email address"
                InputLabelProps={{ style: { color: grey[500] } }}
                autoComplete="email"
                autoFocus
                {...register("email")}
                variant="filled"
                sx={{
                  mb: 2,
                  borderRadius: 3,
                  backgroundColor: brand.bgColor3,
                  "& .MuiFilledInput-root": {
                    borderRadius: 3,
                    backgroundColor: brand.bgColor3,
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
                InputLabelProps={{ style: { color: grey[600] } }}
                id="password"
                autoComplete="password"
                variant="filled"
                {...register("password")}
                sx={{
                  mb: 2,
                  borderRadius: 3,
                  backgroundColor: brand.bgColor3,
                  "& .MuiFilledInput-root": {
                    borderRadius: 3,
                    backgroundColor: brand.bgColor3,
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
                    color: primary.main,
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
                  borderRadius: 4,
                  fontWeight: "medium",
                  background: gradient.background,
                  color: background.paper,
                  textTransform: "unset",
                  "&:hover": { opacity: 0.9 },
                }}
              >
                Sign in <LoginIcon />
              </Button>
              <Divider sx={{ color: brand.divider1, my: 3 }}>
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
                  borderRadius: 4,
                  color: brand.btnTxt1,
                  borderColor: borders.subtle,
                  textTransform: "unset",
                  "&:hover": {
                    borderColor: borders.subtle,
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
                Don't have an account?{" "}
                <Link
                  to="/register"
                  style={{
                    color: primary.main,
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
