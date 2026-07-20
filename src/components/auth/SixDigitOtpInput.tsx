import { useEffect, useRef, useState } from "react";

import { Box, TextField } from "@mui/material";

import { useAppTheme } from "../../theme/useAppTheme";
import { SixDigitOtpInputProps } from "../../types/userTypes";
import { OTP_LENGTH } from "../../utils/constants";
import FormErrors from "../FormErrors";

export const SixDigitOtpInput = ({
  value,
  onChange,
  errorMessage,
  disabled = false,
}: SixDigitOtpInputProps) => {
  const { primary, background, grey } = useAppTheme();

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!value) {
      setDigits(Array(OTP_LENGTH).fill(""));
      return;
    }

    if (/^\d{6}$/.test(value)) {
      setDigits(value.split(""));
    }
  }, [value]);

  const updateDigits = (nextDigits: string[]) => {
    setDigits(nextDigits);
    onChange(nextDigits.join(""));
  };

  const focusInput = (index: number) => {
    const input = inputRefs.current[index];

    if (!input) return;

    input.focus();
    input.select();
  };

  const insertDigits = (startIndex: number, input: string) => {
    const numericDigits = input.replace(/\D/g, "");

    if (!numericDigits) return;

    const nextDigits = [...digits];

    const availableDigits = numericDigits.slice(0, OTP_LENGTH - startIndex);

    availableDigits.split("").forEach((digit, offset) => {
      nextDigits[startIndex + offset] = digit;
    });

    updateDigits(nextDigits);

    const nextIndex = Math.min(
      startIndex + availableDigits.length,
      OTP_LENGTH - 1,
    );

    focusInput(nextIndex);
  };

  const handleChange = (index: number, input: string) => {
    if (disabled) return;

    const numericDigits = input.replace(/\D/g, "");

    if (!numericDigits) {
      const nextDigits = [...digits];

      nextDigits[index] = "";

      updateDigits(nextDigits);
      return;
    }

    insertDigits(index, numericDigits);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    index: number,
  ) => {
    if (disabled) return;

    if (event.key === "Backspace") {
      event.preventDefault();

      const nextDigits = [...digits];

      if (nextDigits[index]) {
        nextDigits[index] = "";
        updateDigits(nextDigits);
        return;
      }

      if (index > 0) {
        nextDigits[index - 1] = "";
        updateDigits(nextDigits);
        focusInput(index - 1);
      }

      return;
    }

    if (event.key === "Delete") {
      event.preventDefault();

      const nextDigits = [...digits];

      nextDigits[index] = "";

      updateDigits(nextDigits);
      return;
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusInput(index - 1);
      return;
    }

    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      event.preventDefault();
      focusInput(index + 1);
    }
  };

  const handlePaste = (
    event: React.ClipboardEvent<HTMLDivElement>,
    index: number,
  ) => {
    event.preventDefault();

    if (disabled) return;

    const pastedDigits = event.clipboardData.getData("text").replace(/\D/g, "");

    if (!pastedDigits) return;

    insertDigits(index, pastedDigits);
  };

  return (
    <Box>
      <Box
        role="group"
        aria-label="Six-digit password reset code"
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: {
            xs: 0.75,
            sm: 1.25,
          },
        }}
      >
        {digits.map((digit, index) => (
          <TextField
            key={index}
            value={digit}
            disabled={disabled}
            variant="filled"
            error={Boolean(errorMessage)}
            autoComplete={index === 0 ? "one-time-code" : "off"}
            inputRef={(element: HTMLInputElement | null) => {
              inputRefs.current[index] = element;
            }}
            onChange={(event) => {
              handleChange(index, event.target.value);
            }}
            onKeyDown={(event) => {
              handleKeyDown(event, index);
            }}
            onPaste={(event) => {
              handlePaste(event, index);
            }}
            onFocus={() => {
              inputRefs.current[index]?.select();
            }}
            inputProps={{
              maxLength: 1,
              inputMode: "numeric",
              pattern: "[0-9]*",
              "aria-label": `Reset code digit ${index + 1}`,
              style: {
                textAlign: "center",
                fontSize: "1.5rem",
                fontWeight: 700,
                padding: "14px 0",
              },
            }}
            sx={{
              width: {
                xs: 42,
                sm: 52,
              },
              "& .MuiFilledInput-root": {
                borderRadius: 2,
                backgroundColor: background.soft1,
                border: errorMessage ? undefined : `1px solid ${grey[300]}`,
                "&:hover": {
                  backgroundColor: background.soft1,
                },
                "&.Mui-focused": {
                  backgroundColor: background.soft1,
                  borderColor: primary.main,
                },
                "&.Mui-disabled": {
                  backgroundColor: background.soft1,
                },
                "&:before, &:after": {
                  display: "none",
                },
              },
            }}
          />
        ))}
      </Box>

      {errorMessage && (
        <Box sx={{ mt: 1 }}>
          <FormErrors errors={errorMessage} />
        </Box>
      )}
    </Box>
  );
};
