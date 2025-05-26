import { Box, Container } from "@mui/material";
import { useSearchParams } from "react-router-dom";

import InvalidResetLinkCard from "../components/auth/InvalidResetLinkCard";
import ResetPasswordCard from "../components/auth/ResetPasswordForm";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const exp = Number(searchParams.get("exp"));
  const now = Date.now();
  const linkIsValid = code && exp && exp > now;

  return (
    <Container component="main" maxWidth="xl" sx={{ marginTop: "2%" }}>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "90%",
            p: 2,
          }}
        >
          <Box sx={{ width: "100%" }}>
            {linkIsValid ? (
              <ResetPasswordCard code={code} />
            ) : (
              <InvalidResetLinkCard />
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ResetPassword;
