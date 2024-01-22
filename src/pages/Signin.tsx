import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import Container from "@mui/material/Container";
import { Link } from "react-router-dom";
import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormErrors from "../components/FormErrors";

interface LoginFormData {
  email: string;
  password: string;
}

const Signin = () => {
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

  const submitLoginData = (data: LoginFormData) => {
    console.log("IT WORKED", data);
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
