import { useEffect, useState } from "react";

import { Box, Button, TextField, Typography } from "@mui/material";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

import {
  useCreateOrgMutation,
  useLazyGoogleAuthQuery,
} from "../app/slices/authApiSlice";
import { setCredentials } from "../app/slices/authSlice";
import { useAppDispatch } from "../app/typedReduxHooks";

export const Onboarding = () => {
  const [orgName, setOrgName] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const [createOrg, { isLoading }] = useCreateOrgMutation();
  const [googleAuth, { data: googleAuthData, isError }] =
    useLazyGoogleAuthQuery();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const isGoogleAuth = params.get("auth") === "g";

    // trigger token fetch
    if (isGoogleAuth) {
      googleAuth({});
    }

    if (googleAuthData) {
      const { accessToken } = googleAuthData;
      dispatch(setCredentials({ accessToken }));
    }

    if (isError) {
      toast.error("Authentication failed", {
        position: "top-right",
      });
      navigate("/login");
    }
  }, [location, googleAuthData, dispatch, googleAuth, isError, navigate]);

  const handleSubmit = async () => {
    try {
      await createOrg({ organizationName: orgName }).unwrap();

      toast.success("Organization created", {
        position: "top-right",
      });

      navigate("/dash");
    } catch (err: any) {
      toast.error(err?.data?.message || "Error creating org", {
        position: "top-right",
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8fafc",
        px: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 420,
          backgroundColor: "#fff",
          borderRadius: 3,
          p: 4,
          boxShadow: "0px 10px 30px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        {/* Title */}
        <Typography
          sx={{
            fontSize: 22,
            fontWeight: 600,
            color: "#0f172a",
          }}
        >
          Name your organization
        </Typography>

        {/* Subtitle */}
        <Typography
          sx={{
            fontSize: 14,
            color: "#64748b",
            mt: 1,
            mb: 2,
          }}
        >
          This will be your organization’s identity
        </Typography>

        <TextField
          fullWidth
          placeholder="e.g. Acme Inc"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />

        <Button
          fullWidth
          onClick={handleSubmit}
          disabled={isLoading || !orgName.trim()}
          sx={{
            mt: 2,
            px: 3,
            py: 1,
            borderRadius: 2,
            fontWeight: 700,
            color: "#fff",
            backgroundImage: "linear-gradient(90deg,#0074EB 0%,#005BC4 100%)",
            boxShadow: "0 10px 20px rgba(0,116,235,0.25)",
            transition: "transform 200ms ease, box-shadow 200ms ease",
            "&:hover": {
              transform: "scale(1.03)",
              boxShadow: "0 14px 28px rgba(0,116,235,0.32)",
              backgroundImage: "linear-gradient(90deg,#0074EB 0%,#005BC4 100%)",
            },
            "&.Mui-disabled": { opacity: 0.5, color: "#fff" },
          }}
        >
          {isLoading ? "Creating..." : "Continue"}
        </Button>
      </Box>
    </Box>
  );
};
