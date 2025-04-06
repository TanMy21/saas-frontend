import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import {
  useGetMeQuery,
  useUpdateUserInfoMutation,
} from "../../app/slices/userApiSlice";
import { updateUserInfoSchema } from "../../utils/schema";
import { ErrorData, UpdateUserInfoFormData } from "../../utils/types";
import FormErrors from "../FormErrors";

const UpdateInfo = () => {
  const { data: user, isLoading: isLoadingUser } = useGetMeQuery("User", {
    refetchOnMountOrArgChange: true,
  });
  const [updateUserInfo, { isSuccess, isError, error }] =
    useUpdateUserInfoMutation();

  const { firstname: firstName, lastname: lastName, email: userEmail } = user;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserInfoFormData>({
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          margin: "auto",
          gap: 1,
          p: 2,
          width: "98%",
          height: "96%",
          // border: "2px solid red",
        }}
      >
        <Typography variant="h4" gutterBottom>
          General Info
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ color: "#808792" }}>
          Use the form below to update your profile
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            width: "98%",
            height: "80%",
            // border: "2px solid green",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              // border: "2px solid blue",
              gap: 2,
              mb: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: "49%",
                height: "100%",
                flexDirection: "column",
              }}
            >
              <TextField
                label="First name"
                variant="filled"
                fullWidth
                autoFocus
                error={!!errors.firstname}
                InputLabelProps={{ style: { color: "gray" } }}
                {...register("firstname")}
                sx={{
                  borderRadius: "12px",
                  backgroundColor: "#E9EDF6",
                  "& .MuiFilledInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#E9EDF6",
                    borderBottom: "none !important",
                    "&:before, &:after": {
                      display: "none",
                      backgroundColor: "#E9EDF6",
                    },
                  },
                }}
              />
              {errors.firstname && (
                <FormErrors errors={errors.firstname.message} />
              )}
            </Box>
            <Box
              sx={{
                display: "flex",
                width: "49%",
                height: "100%",
                flexDirection: "column",
              }}
            >
              <TextField
                label="Last name"
                InputLabelProps={{ style: { color: "gray" } }}
                variant="filled"
                fullWidth
                error={!!errors.lastname}
                {...register("lastname")}
                sx={{
                  borderRadius: "12px",
                  backgroundColor: "#E9EDF6",
                  "& .MuiFilledInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#E9EDF6",
                    borderBottom: "none !important",
                    "&:before, &:after": {
                      display: "none",
                      backgroundColor: "#E9EDF6",
                    },
                  },
                }}
              />
              {errors.lastname && (
                <FormErrors errors={errors.lastname.message} />
              )}
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
            <TextField
              label="Email"
              InputLabelProps={{ style: { color: "gray" } }}
              variant="filled"
              disabled
              fullWidth
              {...register("email")}
              sx={{
                mb: 2,
                borderRadius: "12px",
                backgroundColor: "#E9EDF6",
                "& .MuiFilledInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#E9EDF6",
                  borderBottom: "none !important",
                  "&:before, &:after": {
                    display: "none",
                    backgroundColor: "#E9EDF6",
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              height: "48px",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Button
              type="submit"
              variant="contained"
              sx={{
                width: "16%",
                mb: 2,
                textTransform: "capitalize",
                backgroundColor: "#8020CE",
                fontWeight: 600,
                borderRadius: 4,
                "&:hover": {
                  backgroundColor: "#8020CE",
                },
              }}
            >
              Update
            </Button>
          </Box>
        </Box>
      </Box>
    </form>
  );
};

export default UpdateInfo;
