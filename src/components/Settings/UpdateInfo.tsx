import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import {
  useGetMeQuery,
  useUpdateUserInfoMutation,
} from "../../app/slices/userApiSlice";
import { updateUserInfoSchema } from "../../utils/schema";
import { ErrorData, UpdateUserInfoFormData } from "../../utils/types";

const UpdateInfo = () => {
  const { data: user } = useGetMeQuery("User", {
    refetchOnMountOrArgChange: true,
  });
  const [updateUserInfo, { isSuccess, isError, error }] =
    useUpdateUserInfoMutation();

  const { firstname: firstName, lastname: lastName, email: userEmail } = user;

  const { register, handleSubmit } = useForm<UpdateUserInfoFormData>({
    resolver: zodResolver(updateUserInfoSchema),
    defaultValues: {
      firstname: firstName || "",
      lastname: lastName || "",
      email: userEmail || "",
    },
  });

  const handleUpdateUserInfo = async (data: UpdateUserInfoFormData) => {
    const { firstname, lastname, email } = data;

    try {
      await updateUserInfo({ firstname, lastname, email }).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("User Info Updated Successfully !", {
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
        theme: "colored",
      });
    }

    if (isError) {
      const errorData = error as ErrorData;
      if (Array.isArray(errorData.data.error)) {
        errorData.data.error.forEach((el) =>
          toast.error(el.message, {
            position: "top-right",
          })
        );
      } else {
        toast.error(errorData.data.message, {
          position: "top-right",
        });
      }
    }
  }, [isSuccess, isError, error]);

  return (
    <form onSubmit={handleSubmit(handleUpdateUserInfo)}>
      <Box>
        <Typography variant="h5" gutterBottom>
          General Info
        </Typography>
        <Typography variant="body1" gutterBottom>
          Use the form below to update your profile.
        </Typography>
        <Box>
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              {...register("firstname")}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              {...register("lastname")}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <TextField
              label="Email"
              variant="outlined"
              disabled
              fullWidth
              {...register("email")}
            />
          </Box>
          <Button
            type="submit"
            variant="contained"
            sx={{
              mt: 2,
              mb: 2,
              textTransform: "capitalize",
              backgroundColor: "#7F56D9",
              fontWeight: 600,
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: "#7F56D9",
              },
            }}
          >
            Update
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default UpdateInfo;
