import { Box, Stack, TextField, Typography } from "@mui/material";

export const MemberFormFields = ({
  form,
  isEdit,
  canEditRole,
  actorRole,
}: any) => {
  const { register, watch, setValue, formState } = form;
  const isOwner = actorRole === "OWNER";

  const roleValue = watch("role");

  return (
    <Stack spacing={2.5}>
      {/* Name */}
      <Stack direction="row" spacing={2}>
        <TextField
          label="First name"
          fullWidth
          size="small"
          {...register("firstname")}
          disabled={isEdit && isOwner}
          error={!!formState.errors.firstname}
          helperText={formState.errors.firstname?.message}
        />

        <TextField
          label="Last name"
          fullWidth
          size="small"
          {...register("lastname")}
          disabled={isEdit && isOwner}
          error={!!formState.errors.lastname}
          helperText={formState.errors.lastname?.message}
        />
      </Stack>

      {/* Email */}
      <TextField
        label="Email"
        fullWidth
        size="small"
        disabled={isEdit}
        {...register("email")}
        error={!!formState.errors.email}
        helperText={formState.errors.email?.message}
      />

      {/* Role */}
      <Box>
        <Typography fontSize={14} fontWeight={600} mb={1}>
          Role
        </Typography>

        {!isEdit && (
          <Typography fontSize={12} color="text.secondary" mb={1.5}>
            Assign a role to control access level
          </Typography>
        )}

        {canEditRole ? (
          <Stack spacing={1.5}>
            {[
              {
                value: "ADMIN",
                label: "Admin",
                desc: "Can manage users and workspace settings",
              },
              {
                value: "ANALYST",
                label: "Analyst",
                desc: "Can view and analyze data",
              },
            ].map((role) => (
              <Box
                key={role.value}
                onClick={() => setValue("role", role.value)}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor:
                    roleValue === role.value ? "primary.main" : "divider",
                  cursor: "pointer",
                  bgcolor:
                    roleValue === role.value
                      ? "rgba(0,116,235,0.05)"
                      : "transparent",
                }}
              >
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    border: "2px solid",
                    borderColor:
                      roleValue === role.value ? "primary.main" : "grey.400",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mt: "3px",
                  }}
                >
                  {roleValue === role.value && (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                      }}
                    />
                  )}
                </Box>

                <Box>
                  <Typography fontSize={14} fontWeight={600}>
                    {role.label}
                  </Typography>
                  <Typography fontSize={12} color="text.secondary">
                    {role.desc}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "grey.50",
            }}
          >
            <Typography fontSize={14} fontWeight={600}>
              {roleValue}
            </Typography>
          </Box>
        )}
      </Box>
    </Stack>
  );
};
