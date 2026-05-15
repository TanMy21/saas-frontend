import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Stack, Button } from "@mui/material";
import { useForm } from "react-hook-form";

import { useUpdateUserInfoMutation } from "../../app/slices/userApiSlice";
import { useToast } from "../../hooks/useToast";
import { AccountSettings } from "../../types/userTypes";
import { updateUserInfoSchema } from "../../utils/schema";
import { UpdateUserInfoFormData } from "../../utils/types";

import GeneralTab from "./GeneralTab";

export default function AccountSettingsGeneral({ user }: AccountSettings) {
  const [updateUserInfo, { isSuccess, isError, error, isLoading }] =
    useUpdateUserInfoMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateUserInfoFormData>({
    resolver: zodResolver(updateUserInfoSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset(
        {
          firstname: user.firstname ?? "",
          lastname: user.lastname ?? "",
          email: user.email ?? "",
        },
        { keepDirtyValues: true },
      );
    }
  }, [user, reset]);

  const handleUpdateUserInfo = async (data: UpdateUserInfoFormData) => {
    const { firstname, lastname } = data;

    try {
      await updateUserInfo({ firstname, lastname, email: user.email }).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  useToast({
    isSuccess,
    isError,
    error,
    successMessage: "User info updated successfully!",
    errorFallbackMessage: "Could not update user info. Please try again.",
    successToastOptions: {
      duration: 3000,
    },
  });

  return (
    <form onSubmit={handleSubmit(handleUpdateUserInfo)}>
      <GeneralTab register={register} errors={errors} userEmailReadonly />

      {/* Footer actions */}
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
                backgroundImage:
                  "linear-gradient(90deg,#0074EB 0%,#005BC4 100%)",
              },
              "&.Mui-disabled": { opacity: 0.5, color: "#fff" },
            }}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </Stack>
      </Box>
    </form>
  );
}
