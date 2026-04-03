import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Drawer, IconButton, Typography } from "@mui/material";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import {
  useCreateNewUserMutation,
  useGetOrgUserByIdQuery,
  useUpdateOrgUserMutation,
} from "../../app/slices/userApiSlice";
import useAuth from "../../hooks/useAuth";
import { memberFormSchema, MemberFormValues } from "../../utils/schema";

import { MemberFormFields } from "./MemberFormFields";

export const MemberDrawer = ({
  open,
  mode,
  member,
  onClose,
  isLimitReached,
}: any) => {
  const { role: actorRole } = useAuth();
  const isEdit = mode === "edit";

  const { data: userData, isLoading: loadingUser } = useGetOrgUserByIdQuery(
    member?.userID,
    {
      skip: !open || !isEdit || !member?.userID,
    },
  );

  const isOwner = userData?.role === "OWNER";

  const [
    createUser,
    {
      isLoading: creating,
      isSuccess: createSuccess,
      isError: createErrorFlag,
      error: createError,
    },
  ] = useCreateNewUserMutation();

  const [
    updateUser,
    {
      isLoading: updating,
      isSuccess: updateSuccess,
      isError: updateErrorFlag,
      error: updateError,
    },
  ] = useUpdateOrgUserMutation();

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      role: "VIEWER",
    },
  });

  const canEditRole = (() => {
    if (!isEdit) return true;
    if (userData?.role === "OWNER") return false;
    return actorRole === "OWNER" || actorRole === "ADMIN";
  })();

  useEffect(() => {
    if (isEdit && member) {
      form.reset({
        firstname: member.firstname,
        lastname: member.lastname,
        email: member.email,
        role: member.role,
      });
    }

    if (isEdit && userData) {
      form.reset({
        firstname: userData.user.firstname,
        lastname: userData.user.lastname,
        email: userData.user.email,
        role: userData.role,
      });
    }

    if (!isEdit) {
      form.reset({
        firstname: "",
        lastname: "",
        email: "",
        role: "VIEWER",
      });
    }
  }, [member, userData, isEdit]);

  const getErrorMessage = (err: any): string => {
    return (
      err?.data?.message || err?.error || err?.message || "Something went wrong"
    );
  };

  useEffect(() => {
    if (createSuccess) {
      toast.success("Member invited successfully");
      onClose();
    }
  }, [createSuccess]);

  useEffect(() => {
    if (updateSuccess) {
      toast.success("Member updated successfully");
      onClose();
    }
  }, [updateSuccess]);

  useEffect(() => {
    if (createErrorFlag && createError) {
      toast.error(getErrorMessage(createError));
    }
  }, [createErrorFlag, createError]);

  useEffect(() => {
    if (updateErrorFlag && updateError) {
      toast.error(getErrorMessage(updateError));
    }
  }, [updateErrorFlag, updateError]);

  const onSubmit = async (values: MemberFormValues) => {
    if (!isEdit) {
      if (isLimitReached) {
        toast.error("User limit reached");
        return;
      }

      await createUser({
        ...values,
        email: values.email.toLowerCase(),
      });
    } else {
      await updateUser({
        userID: member.userID,
        ...values,
      });
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: 420,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 4,
            py: 3,
            borderBottom: "1px solid",
            borderColor: "divider",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography fontSize={18} fontWeight={600}>
            {isEdit ? "Edit Member" : "Add Member"}
          </Typography>

          <IconButton onClick={onClose}>
            <X size={18} />
          </IconButton>
        </Box>

        {/* Body */}
        <Box sx={{ px: 4, py: 3, flex: 1 }}>
          {isEdit && loadingUser ? (
            <Typography fontSize={14} color="text.secondary">
              Loading user...
            </Typography>
          ) : (
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <MemberFormFields
                form={form}
                isEdit={isEdit}
                canEditRole={canEditRole}
                role={actorRole}
              />
            </form>
          )}
        </Box>

        {/* Footer */}
        <Box
          sx={{
            px: 4,
            py: 3,
            borderTop: "1px solid",
            borderColor: "divider",
            display: "flex",
            justifyContent: "flex-end",
            gap: 1.5,
          }}
        >
          <Button
            type="button"
            onClick={() => onClose()}
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

          {!isOwner && (
            <Button
              sx={{
                px: 3,
                py: 1,
                borderRadius: 2,
                fontWeight: 700,
                color: "#fff",
                backgroundImage:
                  "linear-gradient(90deg,#0074EB 0%,#005BC4 100%)",
                boxShadow: "0 10px 20px rgba(0,116,235,0.25)",
                transition: "transform 200ms ease, box-shadow 200ms ease",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: "0 14px 28px rgba(0,116,235,0.32)",
                },
                "&.Mui-disabled": { opacity: 0.5, color: "#fff" },
              }}
              onClick={form.handleSubmit(onSubmit)}
              disabled={
                creating ||
                updating ||
                (isEdit && loadingUser) ||
                (isEdit && isOwner)
              }
            >
              {isEdit
                ? updating
                  ? "Saving..."
                  : "Save"
                : creating
                  ? "Creating..."
                  : "Create"}
            </Button>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};
