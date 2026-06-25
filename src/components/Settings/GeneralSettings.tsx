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
          backgroundColor: "rgba(248,250,252,0.65)",
          px: { xs: 2.5, sm: 4 },
          py: 2.5,
        }}
      >
        <Stack
          direction={{ xs: "column-reverse", sm: "row" }}
          spacing={1.25}
          justifyContent="flex-end"
        >
          <Button
            type="button"
            onClick={() => reset()}
            sx={{
              minHeight: 42,
              width: { xs: "100%", sm: "auto" },
              px: 2.5,
              borderRadius: 2,
              fontWeight: 700,
              fontSize: "0.875rem",
              color: "#334155",
              backgroundColor: "rgba(15,23,42,0.055)",
              transition: "background-color 180ms ease, transform 180ms ease",

              "&:hover": {
                backgroundColor: "rgba(15,23,42,0.09)",
              },

              "&:active": {
                transform: "translateY(1px)",
              },
            }}
          >
            Discard changes
          </Button>

          <Button
            type="submit"
            disabled={!isDirty || isLoading}
            sx={{
              minHeight: 42,
              width: { xs: "100%", sm: "auto" },
              px: 3,
              borderRadius: 2,
              fontWeight: 750,
              fontSize: "0.875rem",
              letterSpacing: "0.01em",
              color: "#fff",
              backgroundImage:
                "linear-gradient(90deg, #0074EB 0%, #005BC4 100%)",
              boxShadow: "0 8px 18px rgba(0,116,235,0.22)",
              transition:
                "transform 180ms ease, box-shadow 180ms ease, opacity 180ms ease",

              "&:hover:not(.Mui-disabled)": {
                transform: "translateY(-1px)",
                boxShadow: "0 12px 24px rgba(0,116,235,0.3)",
                backgroundImage:
                  "linear-gradient(90deg, #0074EB 0%, #005BC4 100%)",
              },

              "&:active:not(.Mui-disabled)": {
                transform: "translateY(0)",
              },

              "&.Mui-disabled": {
                color: "#fff",
                opacity: 0.48,
                boxShadow: "none",
              },
            }}
          >
            {isLoading ? "Saving changes..." : "Save changes"}
          </Button>
        </Stack>
      </Box>
    </form>
  );
}
