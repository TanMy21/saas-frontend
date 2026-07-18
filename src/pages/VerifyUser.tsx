import {
  ClipboardEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MarkEmailReadRoundedIcon from "@mui/icons-material/MarkEmailReadRounded";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link, Navigate, useNavigate } from "react-router-dom";

import {
  useSendLogoutMutation,
  useVerifyEmailMutation,
} from "../app/slices/authApiSlice";
import { logOut } from "../app/slices/authSlice";
import { useResendVerificationEmailMutation } from "../app/slices/userApiSlice";
import { useAppDispatch } from "../app/typedReduxHooks";
import useAuth from "../hooks/useAuth";
import { useAppTheme } from "../theme/useAppTheme";
import { OTP_PATTERN } from "../utils/constants";
import { showToast } from "../utils/showToast";
import {
  clearPendingVerification,
  getPendingVerificationEmail,
  getResendErrorMessage,
  getVerificationErrorMessage,
  getVerificationResendSeconds,
  startVerificationResendCooldown,
} from "../utils/verificationSession";

const OTP_LENGTH = 6;
const createEmptyOtp = () => Array<string>(OTP_LENGTH).fill("");

const OtpInput = styled("input", {
  shouldForwardProp: (prop) => prop !== "hasValue" && prop !== "hasError",
})<{ hasValue: boolean; hasError: boolean }>(({ hasValue, hasError }) => ({
  width: "100%",
  minWidth: 0,
  aspectRatio: "1 / 1.08",
  boxSizing: "border-box",
  padding: 0,
  border: "1.5px solid",
  borderColor: hasValue
    ? "rgba(37, 99, 235, 0.7)"
    : hasError
      ? "rgba(220, 38, 38, 0.55)"
      : "rgba(148, 163, 184, 0.38)",
  borderRadius: 12,
  outline: "none",
  backgroundColor: hasValue ? "#eff6ff" : "#f8fafc",
  color: "#0f172a",
  fontFamily: "inherit",
  fontSize: "1.35rem",
  fontWeight: 750,
  textAlign: "center",
  caretColor: "#2563eb",
  transition:
    "border-color 160ms ease, box-shadow 160ms ease, background-color 160ms ease, transform 160ms ease",
  "&:hover": {
    borderColor: "rgba(37, 99, 235, 0.58)",
    backgroundColor: "#ffffff",
  },
  "&:focus": {
    borderColor: "#2563eb",
    backgroundColor: "#ffffff",
    boxShadow: "0 0 0 4px rgba(37, 99, 235, 0.11)",
    transform: "translateY(-1px)",
  },
  "@media (min-width: 600px)": {
    borderRadius: 15,
    fontSize: "1.65rem",
  },
}));

const OtpGrid = styled("div")({
  display: "grid",
  gridTemplateColumns: `repeat(${OTP_LENGTH}, minmax(0, 1fr))`,
  gap: 6,
  "@media (min-width: 600px)": {
    gap: 10,
  },
});

const VerificationHeader = ({ email }: { email: string }) => {
  const { grey } = useAppTheme();

  return (
    <div style={{ marginBottom: 32, textAlign: "center" }}>
      <Typography
        variant="h4"
        fontWeight={750}
        sx={{
          letterSpacing: "-0.035em",
          color: "#0f172a",
          fontSize: { xs: "1.8rem", sm: "2.125rem" },
        }}
      >
        Verify your email
      </Typography>

      <Typography sx={{ color: grey[700], mt: 1.25, lineHeight: 1.7 }}>
        Enter the six-digit code we sent to
      </Typography>
      <Typography
        sx={{
          mt: 0.5,
          color: "#1e3a8a",
          fontWeight: 700,
          overflowWrap: "anywhere",
        }}
      >
        {email}
      </Typography>
    </div>
  );
};

const VerifyUser = () => {
  const { shadows, primary } = useAppTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();

  const [email] = useState(() => getPendingVerificationEmail() ?? "");
  const [otpDigits, setOtpDigits] = useState<string[]>(createEmptyOtp);
  const [errorMessage, setErrorMessage] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");
  const [resendSeconds, setResendSeconds] = useState(() =>
    getVerificationResendSeconds(),
  );

  const submittingRef = useRef(false);
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const [resendVerificationEmail, { isLoading: isResending }] =
    useResendVerificationEmailMutation();
  const [sendLogout] = useSendLogoutMutation();

  useEffect(() => {
    const updateCountdown = () => {
      setResendSeconds(getVerificationResendSeconds());
    };

    updateCountdown();
    const intervalId = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  if (!email) {
    return <Navigate to="/register" replace />;
  }

  const otp = otpDigits.join("");

  const focusOtpInput = (index: number) => {
    otpInputRefs.current[Math.max(0, Math.min(index, OTP_LENGTH - 1))]?.focus();
  };

  const insertOtpDigits = (startIndex: number, value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, OTP_LENGTH - startIndex);

    if (!digits) {
      return;
    }

    setOtpDigits((currentDigits) => {
      const nextDigits = [...currentDigits];

      digits.split("").forEach((digit, offset) => {
        nextDigits[startIndex + offset] = digit;
      });

      return nextDigits;
    });

    setErrorMessage("");
    setNoticeMessage("");
    focusOtpInput(Math.min(startIndex + digits.length, OTP_LENGTH - 1));
  };

  const handleOtpChange = (index: number, value: string) => {
    const digits = value.replace(/\D/g, "");

    if (digits.length > 1) {
      insertOtpDigits(index, digits);
      return;
    }

    setOtpDigits((currentDigits) => {
      const nextDigits = [...currentDigits];
      nextDigits[index] = digits;
      return nextDigits;
    });

    setErrorMessage("");
    setNoticeMessage("");

    if (digits && index < OTP_LENGTH - 1) {
      focusOtpInput(index + 1);
    }
  };

  const handleOtpKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !otpDigits[index] && index > 0) {
      event.preventDefault();
      setOtpDigits((currentDigits) => {
        const nextDigits = [...currentDigits];
        nextDigits[index - 1] = "";
        return nextDigits;
      });
      focusOtpInput(index - 1);
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusOtpInput(index - 1);
    }

    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      event.preventDefault();
      focusOtpInput(index + 1);
    }
  };

  const handleOtpPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    insertOtpDigits(0, event.clipboardData.getData("text"));
  };

  const handleVerify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submittingRef.current || isLoading || !OTP_PATTERN.test(otp)) {
      return;
    }

    submittingRef.current = true;
    setErrorMessage("");
    setNoticeMessage("");

    try {
      await verifyEmail({ email, otp }).unwrap();

      clearPendingVerification();
      showToast.success("Email verified successfully.");

      // An existing unverified JWT still contains verified: false.
      // End that session before returning to login.
      if (isAuthenticated) {
        try {
          await sendLogout().unwrap();
        } catch {
          // Verification succeeded even if server-side logout failed.
        }

        dispatch(logOut());
      }

      navigate("/login", { replace: true });
    } catch (error) {
      setErrorMessage(getVerificationErrorMessage(error));
    } finally {
      submittingRef.current = false;
    }
  };

  const handleResend = async () => {
    if (isResending || resendSeconds > 0) {
      return;
    }

    setErrorMessage("");
    setNoticeMessage("");

    try {
      const response = await resendVerificationEmail({ email }).unwrap();

      // A newly requested OTP invalidates the previous value.
      setOtpDigits(createEmptyOtp());
      startVerificationResendCooldown();
      setResendSeconds(60);
      focusOtpInput(0);

      // Display the backend's deliberately generic response.
      setNoticeMessage(response.message);
    } catch (error) {
      setErrorMessage(getResendErrorMessage(error));
    }
  };

  const canVerify = OTP_PATTERN.test(otp) && !isLoading;

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        py: { xs: 5, sm: 7 },
        background:
          "radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.14), transparent 38%), linear-gradient(180deg, #f8fbff 0%, #ffffff 72%)",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          sx={{
            position: "relative",
            overflow: "hidden",
            p: { xs: 3, sm: 5 },
            borderRadius: { xs: 4, sm: 5 },
            border: "1px solid rgba(148, 163, 184, 0.2)",
            boxShadow: shadows[9],
            backgroundColor: "rgba(255, 255, 255, 0.96)",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: "0 0 auto 0",
              height: 5,
            },
          }}
        >
          <VerificationHeader email={email} />

          <Box
            component="form"
            onSubmit={handleVerify}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <div>
              <Typography
                component="label"
                sx={{
                  display: "block",
                  mb: 1.5,
                  textAlign: "center",
                  color: "#475569",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Verification code
              </Typography>

              <OtpGrid role="group" aria-label="Six-digit verification code">
                {otpDigits.map((digit, index) => (
                  <OtpInput
                    key={index}
                    ref={(input: HTMLInputElement | null) => {
                      otpInputRefs.current[index] = input;
                    }}
                    type="text"
                    value={digit}
                    required
                    autoFocus={index === 0}
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    aria-label={`Verification code digit ${index + 1}`}
                    aria-invalid={Boolean(errorMessage)}
                    hasValue={Boolean(digit)}
                    hasError={Boolean(errorMessage)}
                    onChange={(event) =>
                      handleOtpChange(index, event.target.value)
                    }
                    onKeyDown={(event) => handleOtpKeyDown(index, event)}
                    onPaste={handleOtpPaste}
                    onFocus={(event) => event.currentTarget.select()}
                  />
                ))}
              </OtpGrid>
            </div>

            {errorMessage && (
              <Alert severity="error" sx={{ borderRadius: 2.5 }}>
                {errorMessage}
              </Alert>
            )}
            {noticeMessage && (
              <Alert severity="info" sx={{ borderRadius: 2.5 }}>
                {noticeMessage}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={!canVerify}
              sx={{
                minHeight: 52,
                borderRadius: "14px",
                color: "#ffffff",
                fontSize: "0.98rem",
                fontWeight: 750,
                letterSpacing: "0.01em",
                backgroundColor: primary.main,
                boxShadow: "0 12px 24px rgba(37, 99, 235, 0.22)",
                transition: "transform 160ms ease, box-shadow 160ms ease",
                "&:hover": {
                  color: "#ffffff",
                  backgroundColor: primary.dark,
                  boxShadow: "0 15px 30px rgba(37, 99, 235, 0.3)",
                  transform: "translateY(-1px)",
                },
                "&.Mui-disabled": {
                  color: "rgba(255, 255, 255, 0.88)",
                  backgroundColor: primary.main,
                  boxShadow: "none",
                  opacity: 0.48,
                },
              }}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  Verifying...
                </>
              ) : (
                "Verify code"
              )}
            </Button>

            <div style={{ textAlign: "center" }}>
              <Typography
                component="span"
                sx={{ color: "#64748b", fontSize: "0.9rem" }}
              >
                Didn't receive the code?{" "}
              </Typography>
              <Button
                type="button"
                variant="text"
                disabled={isResending || resendSeconds > 0}
                onClick={handleResend}
                sx={{
                  minWidth: 0,
                  p: 0,
                  verticalAlign: "baseline",
                  color: "#2563eb",
                  fontSize: "0.9rem",
                  fontWeight: 750,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "transparent",
                    color: "#1d4ed8",
                  },
                }}
              >
                {isResending
                  ? "Requesting..."
                  : resendSeconds > 0
                    ? `Resend in ${resendSeconds}s`
                    : "Resend code"}
              </Button>
            </div>

            <Button
              component={Link}
              to="/login"
              variant="text"
              sx={{
                alignSelf: "center",
                color: "#64748b",
                fontWeight: 650,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "rgba(148, 163, 184, 0.08)",
                  color: "#334155",
                },
              }}
            >
              <ArrowBackIcon sx={{ mr: 0.75, fontSize: 18 }} />
              Back to login
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default VerifyUser;
