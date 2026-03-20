import { useEffect, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Avatar,
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { useCreateNewUserMutation } from "../../app/slices/userApiSlice";
import { AccountSettings, CreateOrgUserFormData } from "../../types/userTypes";
import { roles } from "../../utils/constants";
import { createOrgUserSchema } from "../../utils/schema";

export default function CreateOrgUserForm({ user }: AccountSettings) {
  const [createNewUser, { isLoading, isSuccess, isError, error }] =
    useCreateNewUserMutation();

  const orgID = user.organizationMembers[0].relatedOrgID;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<CreateOrgUserFormData>({
    resolver: zodResolver(createOrgUserSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      role: "",
    },
  });

  const firstname = watch("firstname");
  const lastname = watch("lastname");
  const role = watch("role");

  // Avatar initials
  const initials = useMemo(() => {
    if (!firstname && !lastname) return null;
    return `${firstname?.[0] || ""}${lastname?.[0] || ""}`.toUpperCase();
  }, [firstname, lastname]);

  const onSubmit = async (data: CreateOrgUserFormData) => {
    try {
      await createNewUser({
        ...data,
        orgID,
        email: data.email.toLowerCase(),
      }).unwrap();

      reset();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("User created successfully");
    }

    if (isError) {
      const e = error as any;
      toast.error(e?.data?.message || "Something went wrong");
    }
  }, [isSuccess, isError, error]);

  const selectedRole = roles[role as keyof typeof roles];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          px: 4,
          pt: 4,
          pb: 1,
        }}
      >
        <Avatar
          sx={{
            width: 48,
            height: 48,
            border: "2px solid",
            borderColor: "divider",
            bgcolor: "rgba(15,23,42,0.04)",
            color: "text.primary",
            fontWeight: 600,
          }}
        >
          {initials || <UserPlus size={18} />}
        </Avatar>

        <Box>
          <Typography fontSize={18} fontWeight={600}>
            Add team member
          </Typography>
          <Typography fontSize={13} color="text.secondary">
            Invite someone to your organization
          </Typography>
        </Box>
      </Box>

      {/* Form Body */}
      <Box sx={{ px: 4, pt: 3, pb: 2 }}>
        <Stack spacing={2.5}>
          {/* Name */}
          <Stack direction="row" spacing={2}>
            <TextField
              label="First name"
              fullWidth
              size="small"
              {...register("firstname")}
              error={!!errors.firstname}
              helperText={errors.firstname?.message}
            />

            <TextField
              label="Last name"
              fullWidth
              size="small"
              {...register("lastname")}
              error={!!errors.lastname}
              helperText={errors.lastname?.message}
            />
          </Stack>

          {/* Email */}
          <TextField
            label="Email address"
            fullWidth
            size="small"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          {/* Role */}
          <TextField
            select
            label="Role"
            fullWidth
            size="small"
            {...register("role")}
            error={!!errors.role}
            helperText={errors.role?.message}
          >
            {Object.entries(roles).map(([key, value]) => (
              <MenuItem key={key} value={key}>
                {value.label}
              </MenuItem>
            ))}
          </TextField>

          {/* Role description */}
          {selectedRole && (
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                alignItems: "flex-start",
                bgcolor: "rgba(0,116,235,0.06)",
                px: 2,
                py: 1.5,
                borderRadius: 2,
              }}
            >
              <Typography fontSize={12} color="text.secondary">
                <strong>{selectedRole.label}:</strong>{" "}
                {selectedRole.description}
              </Typography>
            </Box>
          )}

          {/* Divider */}
          <Box sx={{ borderTop: "1px solid", borderColor: "divider" }} />

          {/* Note */}
          <Typography fontSize={12} color="text.secondary">
            User will receive access and can change password later.
          </Typography>
        </Stack>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          px: 4,
          py: 3,
        }}
      >
        <Stack direction="row" spacing={1.5} justifyContent="flex-end">
          <Button
            type="button"
            onClick={() => reset()}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
              fontWeight: 600,
              color: "text.primary",
              backgroundColor: "rgba(15,23,42,0.06)",
              "&:hover": { backgroundColor: "rgba(15,23,42,0.10)" },
            }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={!isDirty || isLoading}
            sx={{
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
              },
              "&.Mui-disabled": { opacity: 0.5, color: "#fff" },
            }}
          >
            {isLoading ? "Creating..." : "Create User"}
          </Button>
        </Stack>
      </Box>
    </form>
  );
}
