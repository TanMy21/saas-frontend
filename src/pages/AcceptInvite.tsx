import { useEffect, useMemo, useState } from "react";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Paper,
  Stack,
  Typography,
  TextField,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import toast from "react-hot-toast";
import { useNavigate, useParams, Link } from "react-router-dom";

import {
  useAcceptOrganizationInviteMutation,
  useValidateOrganizationInviteQuery,
} from "../app/slices/userApiSlice";
import { useAppTheme } from "../theme/useAppTheme";
import { getInitials } from "../utils/utils";

export const AcceptInvite = () => {
  const { textStyles, background, grey, shadows, iconStyle } = useAppTheme();
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    data: invite,
    isLoading: isInviteLoading,
    isError: isInviteError,
    error: inviteError,
  } = useValidateOrganizationInviteQuery(token!, {
    skip: !token,
    refetchOnMountOrArgChange: true,
  });

  const [
    acceptOrganizationInvite,
    {
      isLoading: isAcceptLoading,
      isSuccess: isAcceptSuccess,
      isError: isAcceptError,
      error: acceptError,
    },
  ] = useAcceptOrganizationInviteMutation();

  // Compute initials
  const initials = useMemo(() => {
    if (!invite) return "";
    return getInitials(invite.firstname, invite.lastname);
  }, [invite]);

  // Client-side validity for enabling the submit button
  const valid =
    !!token &&
    password.length >= 8 &&
    password === confirm &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !valid) return;

    try {
      await acceptOrganizationInvite({
        token,
        password,
      }).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!isInviteError) return;

    const err = inviteError as {
      data?: { message?: string; error?: Array<{ message: string }> };
    };

    if (Array.isArray(err?.data?.error)) {
      err.data.error.forEach((el) =>
        toast.error(el.message, { position: "top-right" }),
      );
    } else {
      toast.error(err?.data?.message || "Invalid or expired invite link", {
        position: "top-right",
      });
    }
  }, [isInviteError, inviteError]);

  useEffect(() => {
    if (isAcceptSuccess) {
      toast.success("Password set successfully. Please log in.", {
        position: "top-right",
      });

      const timeout = setTimeout(() => {
        navigate("/login");
      }, 1500);

      return () => clearTimeout(timeout);
    }

    if (isAcceptError) {
      const err = acceptError as {
        data?: { message?: string; error?: Array<{ message: string }> };
      };

      if (Array.isArray(err?.data?.error)) {
        err.data.error.forEach((el) =>
          toast.error(el.message, { position: "top-right" }),
        );
      } else {
        toast.error(err?.data?.message || "Failed to accept invite", {
          position: "top-right",
        });
      }
    }
  }, [isAcceptSuccess, isAcceptError, acceptError, navigate]);

  if (isInviteLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: grey[50],
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography sx={{ color: grey[700] }}>
            Validating invite...
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (!token || isInviteError || !invite) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: grey[50],
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Box
          sx={{
            margin: "auto",
            width: "100%",
            maxWidth: 480,
            textAlign: "center",
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography sx={textStyles.strongH4}>Invalid invite</Typography>
            <Typography sx={{ color: grey[900] }}>
              This invite link is no longer valid
            </Typography>
          </Box>

          <Paper
            sx={{
              p: 4,
              borderRadius: 3,
              boxShadow: shadows[9],
            }}
          >
            <Stack spacing={3}>
              <Box
                sx={{
                  width: "98",
                  height: 80,
                  display: "flex",
                  alignItems: "center",
                  mx: "auto",
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    background: background.softRed,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                  }}
                >
                  <Typography sx={iconStyle?.errorLarge}>!</Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: background.softRed,
                  borderRadius: 2,
                  p: 2,
                  gap: 2,
                }}
              >
                <Typography sx={textStyles.bodyDanger}>
                  Invite expired or invalid
                </Typography>
              </Box>

              <Box>
                <Typography sx={{ color: grey[900] }}>
                  Please contact
                </Typography>
                <Typography sx={{ color: grey[900] }}>
                  your organization owner or admin for a new invite.
                </Typography>
              </Box>

              <Button
                component={Link}
                to="/login"
                fullWidth
                variant="backLink1"
              >
                Back to login
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Box>
    );
  }

  // Success card display before redirecting to login
  if (isAcceptSuccess) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: grey[50],
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Paper
          sx={{
            width: "100%",
            maxWidth: 420,
            p: 4,
            borderRadius: 3,
            boxShadow: shadows[9],
            textAlign: "center",
          }}
        >
          <Stack spacing={2}>
            <Typography sx={textStyles.strongH4}>
              Password set successfully
            </Typography>
            <Typography sx={{ color: grey[700] }}>
              Redirecting you to login...
            </Typography>
          </Stack>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: grey[50],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          maxWidth: 420,
          p: 4,
          borderRadius: 3,
          boxShadow: shadows[9],
        }}
      >
        <Stack spacing={3}>
          <Stack spacing={1} alignItems="center" textAlign="center">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: background.soft5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                color: grey[900],
              }}
            >
              A
            </Box>

            <Typography sx={textStyles.strongH4}>You're invited 🎉</Typography>

            <Typography sx={{ color: grey[700], fontSize: 14 }}>
              Join <strong>{invite.organization.organizationName}</strong> as{" "}
              <strong>{invite.role}</strong>
            </Typography>
          </Stack>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              background: background.softGrey,
              borderRadius: 2,
              p: 2,
              border: `1px solid ${grey[200]}`,
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: grey[200],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {initials}
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: 10,
                  textTransform: "uppercase",
                  color: grey[600],
                }}
              >
                Invited Email
              </Typography>
              <Typography sx={{ fontSize: 14, color: grey[900] }}>
                {invite.email}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography sx={{ fontSize: 13, mb: 1 }}>New Password</Typography>

            <Box sx={{ position: "relative" }}>
              <TextField
                fullWidth
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                size="small"
              />

              <IconButton
                onClick={() => setShowPw((v) => !v)}
                sx={{
                  position: "absolute",
                  right: 6,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                {showPw ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </Box>

            {password && (
              <Typography sx={{ fontSize: 11, color: grey[600], mt: 0.5 }}>
                Use 8+ chars, uppercase, number & symbol
              </Typography>
            )}
          </Box>

          <Box>
            <Typography sx={{ fontSize: 13, mb: 1 }}>
              Repeat Password
            </Typography>

            <Box sx={{ position: "relative" }}>
              <TextField
                fullWidth
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter password"
                size="small"
                error={!!confirm && confirm !== password}
                helperText={
                  confirm && confirm !== password ? "Passwords don't match" : ""
                }
              />

              <IconButton
                onClick={() => setShowConfirm((v) => !v)}
                sx={{
                  position: "absolute",
                  right: 6,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                {showConfirm ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </Box>
          </Box>

          <Button
            type="submit"
            disabled={!valid || isAcceptLoading}
            sx={{
              mt: 1,
              py: 1.2,
              borderRadius: 2,
              fontWeight: 700,
              color: "#fff",
              backgroundColor: "#0074EB",
              "&:hover": {
                backgroundColor: "#005BC4",
              },
              "&.Mui-disabled": {
                opacity: 0.5,
                color: "#fff",
              },
            }}
          >
            {isAcceptLoading ? "Setting up..." : "Set Password & Join"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};
