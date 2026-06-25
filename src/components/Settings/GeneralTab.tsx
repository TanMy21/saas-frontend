import { Box, Grid, Typography } from "@mui/material";
import { type UseFormRegister, type FieldErrors } from "react-hook-form";

import { UpdateUserInfoFormData } from "../../utils/types";

import LabeledField from "./LabelField";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    minHeight: 48,
    borderRadius: 2.25,
    backgroundColor: "rgba(255,255,255,0.72)",
    transition:
      "border-color 180ms ease, box-shadow 180ms ease, background-color 180ms ease",

    "& fieldset": {
      borderColor: "rgba(148,163,184,0.38)",
      transition: "border-color 180ms ease",
    },

    "&:hover": {
      backgroundColor: "#fff",
      "& fieldset": {
        borderColor: "rgba(0,116,235,0.58)",
      },
    },

    "&.Mui-focused": {
      backgroundColor: "#fff",
      boxShadow: "0 0 0 4px rgba(0,116,235,0.11)",

      "& fieldset": {
        borderColor: "#0074EB",
        borderWidth: 1,
      },
    },

    "& input": {
      fontSize: "0.925rem",
      fontWeight: 500,
      color: "#0F172A",
    },

    "& input::placeholder": {
      color: "#94A3B8",
      opacity: 1,
    },
  },
};

const readOnlyFieldSx = {
  "& .MuiOutlinedInput-root": {
    minHeight: 48,
    borderRadius: 2.25,
    backgroundColor: "rgba(15,23,42,0.035)",

    "& fieldset": {
      borderColor: "rgba(148,163,184,0.3)",
    },

    "& input": {
      fontSize: "0.925rem",
      fontWeight: 500,
      color: "#475569",
      WebkitTextFillColor: "#475569",
    },
  },
};

export default function GeneralTab({
  register,
  errors,
  userEmailReadonly = true,
}: {
  register: UseFormRegister<UpdateUserInfoFormData>;
  errors: FieldErrors<UpdateUserInfoFormData>;
  userEmailReadonly?: boolean;
}) {
  return (
    <Box
      sx={{
        maxWidth: 820,
        p: { xs: 2.5, sm: 4 },
      }}
    >
      {/* Clear page hierarchy: title explains the area, subtitle explains the outcome. */}
      <Box sx={{ mb: 3.5 }}>
        <Typography
          component="h2"
          sx={{
            fontSize: { xs: "1.25rem", sm: "1.4rem" },
            fontWeight: 800,
            lineHeight: 1.25,
            letterSpacing: "-0.02em",
            color: "text.primary",
          }}
        >
          Profile details
        </Typography>

        <Typography
          sx={{
            mt: 0.75,
            fontSize: "0.9rem",
            lineHeight: 1.6,
            color: "text.secondary",
          }}
        >
          Update the details shown
        </Typography>
      </Box>

      {/* A single grid keeps spacing consistent between all fields. */}
      <Grid container spacing={{ xs: 2.25, md: 2.75 }}>
        <Grid item xs={12} md={6}>
          <LabeledField
            topLabel="First name"
            placeholder="Enter your first name"
            fullWidth
            sx={fieldSx}
            error={!!errors.firstname}
            helperText={errors.firstname?.message}
            {...register("firstname")}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <LabeledField
            topLabel="Last name"
            placeholder="Enter your last name"
            fullWidth
            sx={fieldSx}
            error={!!errors.lastname}
            helperText={errors.lastname?.message}
            {...register("lastname")}
          />
        </Grid>

        <Grid item xs={12}>
          <LabeledField
            topLabel="Email address"
            placeholder="Enter your email address"
            fullWidth
            sx={userEmailReadonly ? readOnlyFieldSx : fieldSx}
            error={!!errors.email}
            helperText={
              errors.email?.message ??
              (userEmailReadonly
                ? "This email cannot be changed"
                : undefined)
            }
            InputProps={{
              readOnly: userEmailReadonly,
            }}
            inputProps={{
              "aria-readonly": userEmailReadonly,
            }}
            {...register("email")}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
