import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
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

  const [_persist, setPersist] = usePersist();

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
      console.error("Failed:", error);
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
    if (isError && error !== undefined) {
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

    if (error) {
      console.error("Failed to fetch access token:", error);
      navigate("/login");
    }
  }, [location, googleAuthData, dispatch, navigate, googleAuth, error]);

  if (isLoading) return <CircularProgress />;

  return (
    <Container component="main" maxWidth="xs">
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
            variant="h5"
            sx={{ fontWeight: 800, color: "#101828" }}
          >
            Sign in
          </Typography>
          <form onSubmit={handleSubmit(submitLoginData)}>
            <Box sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                autoFocus
                {...register("email")}
              />
              {errors.email && <FormErrors errors={errors.email.message} />}
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                {...register("password")}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
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
                Sign In
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={handleGoogleAuth}
                sx={{
                  mt: 1,
                  mb: 2,
                  fontWeight: 700,
                  backgroundColor: "#E3F3FB",
                  textTransform: "capitalize",
                  color: "#424242",
                  borderRadius: "4px",
                  "&:hover": {
                    backgroundColor: "#E3F3FB",
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
                  <Box sx={{ marginTop: "4%" }}>
                    <FcGoogle size={20} />
                  </Box>
                  <Box sx={{ fontWeight: 700, fontSize: "12px" }}>
                    Log In with Google
                  </Box>
                </Box>
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link
                    to="/forgot"
                    style={{
                      padding: 5,
                      textDecoration: "none",
                      fontWeight: 600,
                      color: "#494454",
                    }}
                  >
                    Forgot Password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link
                    to="/register"
                    style={{
                      padding: 5,
                      textDecoration: "none",
                      fontWeight: 600,
                      color: "#494454",
                    }}
                  >
                    Register
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Signin;
