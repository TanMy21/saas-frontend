import { useEffect } from "react";

import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { useUpdateWorkspaceNameMutation } from "../../app/slices/workspaceApiSlice";
// import { useAppTheme } from "../../theme/useAppTheme";
import {
  ErrorData,
  WorkspaceRename,
  WorkspaceRenameModalProps,
} from "../../utils/types";

const RenameWorkspaceModal = ({
  open,
  onClose,
  selectedWorkspace,
  setSelectedWorkspace,
}: WorkspaceRenameModalProps) => {
  // const { background, textStyles } = useAppTheme();
  const [updateWorkspaceName, { isLoading, isSuccess, isError, error }] =
    useUpdateWorkspaceNameMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkspaceRename>();

  const { workspaceId, name } = selectedWorkspace ?? {};

  const renameWorkspace = async (data: WorkspaceRename) => {
    const { name } = data;
    const updated = await updateWorkspaceName({ workspaceId, name }).unwrap();

    if (selectedWorkspace?.workspaceId === updated.workspaceId) {
      setSelectedWorkspace((prev) =>
        prev ? { ...prev, name: updated.name } : prev
      );
    }

    onClose();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Workspace Renamed Successfully !", {
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
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 10,
          border: "1px solid",
          borderColor: "grey.200",
          width: "100%",
          maxWidth: 500,
          mx: 2,
          transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            pt: 3,
            pb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                p: 1,
                backgroundColor: "#EFF6FF",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <EditIcon style={{ width: 20, height: 20, color: "#2563EB" }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "grey.900" }}
              >
                Rename workspace
              </Typography>
              <Typography variant="body2" sx={{ color: "grey.500", mt: 0.5 }}>
                Choose a new name for your workspace
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              p: 1,
              color: "grey.400",
              transition: "all 0.2s",
              "&:hover": {
                color: "grey.600",
                bgcolor: "grey.100",
              },
              borderRadius: 2,
            }}
          >
            <CloseIcon style={{ width: 28, height: 28 }} />
          </IconButton>
        </Box>

        {/* Form (React Hook Form) */}
        <Box
          component="form"
          onSubmit={handleSubmit(renameWorkspace)}
          sx={{ px: 3, pb: 3 }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography
              component="label"
              htmlFor="workspace-name"
              sx={{
                fontSize: 14,
                fontWeight: 700,
                color: "grey.700",
                mb: 1,
                display: "block",
              }}
            >
              Workspace name
            </Typography>
            <TextField
              id="workspace-name"
              type="text"
              fullWidth
              placeholder="Enter workspace name..."
              inputProps={{
                maxLength: 50,
                autoFocus: true,
                style: {
                  padding: "14px 16px",
                  background: "rgba(249,250,251,0.5)",
                  borderRadius: 16,
                },
              }}
              sx={{
                "& .MuiInputBase-root": {
                  bgcolor: "rgba(249,250,251,0.5)",
                  borderRadius: 2,
                  transition: "all 0.2s",
                  "&:hover": { bgcolor: "#fff" },
                  "&.Mui-focused": {
                    bgcolor: "#fff",
                    boxShadow: "0 0 0 2px #2563eb22",
                  },
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "grey.200",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "grey.300",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                  borderWidth: 2,
                },
                mt: 0.5,
              }}
              error={!!errors.name}
              helperText={errors.name ? "Workspace name is required" : ""}
              {...register("name", { required: true, maxLength: 50 })}
            />
          </Box>

          {/* Actions */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              type="button"
              onClick={onClose}
              variant="outlined"
              fullWidth
              sx={{
                color: "grey.700",
                bgcolor: "grey.100",
                borderColor: "grey.200",
                fontWeight: 600,
                borderRadius: 2,
                py: 1.5,
                transition: "all 0.2s",
                "&:hover": {
                  bgcolor: "grey.200",
                  transform: "scale(0.98)",
                  border: "none",
                },
                "&:active": { transform: "scale(0.95)" },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              fullWidth
              disabled={isLoading}
              variant="contained"
              sx={{
                bgcolor: "#2563EB",
                fontWeight: 500,
                borderRadius: 2,
                py: 1.5,
                boxShadow: "none",
                "&:hover": {
                  bgcolor: "#1e40af",
                  transform: "scale(0.98)",
                },
                "&:active": { transform: "scale(0.95)" },
                "&.Mui-disabled": {
                  bgcolor: "#93c5fd",
                  color: "#fff",
                  cursor: "not-allowed",
                },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
            >
              {isLoading ? (
                <>
                  <CircularProgress
                    size={18}
                    thickness={4}
                    sx={{ color: "#fff", mr: 1 }}
                  />
                  Renaming...
                </>
              ) : (
                "Rename"
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default RenameWorkspaceModal;
