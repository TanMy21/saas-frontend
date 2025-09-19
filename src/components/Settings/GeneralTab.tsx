import { Box, Grid, Stack, Typography } from "@mui/material";
import { type UseFormRegister, type FieldErrors } from "react-hook-form";

import { UpdateUserInfoFormData } from "../../utils/types";

import LabeledField from "./LabelField";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2.5,
    backgroundColor: "rgba(255,255,255,0.5)",
    transition: "box-shadow 200ms ease, border-color 200ms ease",
    "& fieldset": { borderColor: "rgba(148,163,184,0.35)" },
    "&:hover fieldset": { borderColor: "rgba(59,130,246,0.6)" },
    "&.Mui-focused fieldset": {
      borderColor: "rgba(59,130,246,0.9)",
      boxShadow: "0 0 0 4px rgba(59,130,246,0.12)",
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
    <Box sx={{ p: 4 }}>
      {/* Section heading */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800} color="text.primary">
          General Information
        </Typography>
        <Typography color="text.secondary" sx={{ ml: 0.5 }}>
          Update your profile information and personal details
        </Typography>
      </Box>

      {/* Form fields */}
      <Stack spacing={1} sx={{ p: 2 }}>
        {/* Names  */}
        <Grid container spacing={3} alignItems="flex-start">
          <Grid item xs={12} md={6}>
            <LabeledField
              topLabel="First Name"
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
              topLabel="Last Name"
              placeholder="Enter your last name"
              fullWidth
              sx={fieldSx}
              error={!!errors.lastname}
              helperText={errors.lastname?.message}
              {...register("lastname")}
            />
          </Grid>
        </Grid>

        {/* Email (read-only) */}
        <Grid container spacing={3} alignItems="flex-start">
          <Grid item xs={12} md={12}>
            <LabeledField
              topLabel="Email Address"
              placeholder="Enter your email address"
              fullWidth
              sx={{
                ...fieldSx,
                "& .MuiOutlinedInput-root": {
                  ...fieldSx["& .MuiOutlinedInput-root"],
                  bgcolor: "rgba(2,6,23,0.04)",
                },
              }}
              error={!!errors.email}
              InputProps={{ readOnly: userEmailReadonly }}
              disabled={userEmailReadonly}
              {...register("email")}
            />
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}
