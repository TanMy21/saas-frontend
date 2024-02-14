import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import Container from "@mui/material/Container";
import { Link, useNavigate } from "react-router-dom";
import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormErrors from "../components/FormErrors";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../app/slices/authApiSlice";
import { setCredentials } from "../app/slices/authSlice";
import { toast } from "react-toastify";
import { useEffect } from "react";
import usePersist from "../hooks/persist";

interface LoginFormData {
  email: string;
  password: string;
}

const Signin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [persist, setPersist] = usePersist();

  const [login, { isSuccess, isLoading, isError, error }] = useLoginMutation();

  if (isLoading) return <p>Loading...</p>;

  useEffect(() => {
    if (isError) {
      if (Array.isArray((error as any).data.error)) {
        (error as any).data.error.forEach((el: any) =>
          toast.error(el.message, {
            position: "top-right",
          })
        );
      } else {
        toast.error((error as any).data.message, {
          position: "top-right",
        });
      }
    }
  }, [isError]);


  useEffect(() => {
    if (isSuccess) {
      setPersist((prev) => !prev);
    }
  }, [isSuccess, setPersist]);
  


  const loginSchema: ZodType<LoginFormData> = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const submitLoginData = async (data: LoginFormData) => {
    const { email, password } = data;
    //unwrap for try catch block add if needed
    const { accessToken } = await login({ email, password }).unwrap();
    console.log("Sign IN: ", accessToken);
    dispatch(setCredentials({ accessToken }));
    navigate("/dash");
  };

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
          }}
        >
          <Link to="/" style={{ textDecoration: "none" }}>
            <Typography variant="h1" component="h2">
              Logo
            </Typography>
          </Link>
          <Typography component="h1" variant="h5">
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
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link to="#" style={{ padding: 5 }}>
                    Forgot Password
                  </Link>
                </Grid>
                <Grid item>
                  <Link to="/register" style={{ padding: 5 }}>
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
