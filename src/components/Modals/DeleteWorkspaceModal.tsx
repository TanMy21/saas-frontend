import { useEffect } from "react";

import CloseIcon from "@mui/icons-material/Close";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
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
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useDeleteWorkspaceMutation } from "../../app/slices/workspaceApiSlice";
// import { useAppTheme } from "../../theme/useAppTheme";
import {
  ErrorData,
  WorkspaceDelete,
  WorkspaceDeleteModalProps,
} from "../../utils/types";

const DeleteWorkspaceModal = ({
  open,
  onClose,
  selectedWorkspace,
}: WorkspaceDeleteModalProps) => {
  // const { background, textStyles } = useAppTheme();
  const navigate = useNavigate();
  const { workspaceId, name } = selectedWorkspace ?? {};

  const expectedText = name ?? "";

  const {
    register,
    handleSubmit,

    watch,
  } = useForm<WorkspaceDelete>({
    mode: "onChange",
    defaultValues: { confirmationText: "" },
  });

  const confirmationText = watch("confirmationText") ?? "";

  const confirmationMatch =
    confirmationText === expectedText && confirmationText.length > 0;

  const [deleteWorkspace, { isSuccess, isLoading, isError, error }] =
    useDeleteWorkspaceMutation();

  const handleDeleteWorkspace = async (data: WorkspaceDelete) => {
    const { confirmationText } = data;
    if (confirmationText === name) {
      await deleteWorkspace(workspaceId);
      navigate("/dash");
    } else {
      toast.error("Workspace name does not match", { position: "top-right" });
    }
    onClose();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Workspace Deleted !", {
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
    <Modal open={open} onClose={onClose} disableEnforceFocus>
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: 1300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
        tabIndex={-1}
      >
        {/* Backdrop */}
        <Box
          onClick={onClose}
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(4px)",
            transition: "opacity 0.3s",
          }}
        />
        {/* Modal */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: 500,
            transform: "scale(1)",
            transition: "all 0.3s",
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              bgcolor: "#fff",
              borderRadius: 2,
              boxShadow: 12,
              border: "1px solid",
              borderColor: "#f3f4f6", // gray-100
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <Box
              sx={{
                px: 4,
                pt: 4,
                pb: 2,
                borderBottom: "1px solid",
                borderColor: "#f3f4f6",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "start",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      flexShrink: 0,
                      width: 40,
                      height: 40,
                      bgcolor: "#fee2e2",
                      borderRadius: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ReportProblemIcon
                      sx={{ color: "#dc2626", width: 22, height: 22 }}
                    />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#111827" }}
                  >
                    Delete this Workspace?
                  </Typography>
                </Box>
                <IconButton
                  onClick={onClose}
                  sx={{
                    flexShrink: 0,
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    color: "#6b7280",
                    "&:hover": { bgcolor: "#f3f4f6" },
                  }}
                >
                  <CloseIcon sx={{ width: 24, height: 24 }} />
                </IconButton>
              </Box>
            </Box>

            {/* Content */}
            <Box sx={{ px: 4, py: 4 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "#fef2f2",
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "#fee2e2",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 14,
                      color: "#991b1b",
                      fontWeight: 600,
                    }}
                  >
                    You will lose all the data associated with this workspace.
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Typography sx={{ color: "#111827", fontWeight: 600 }}>
                    <Box component="span" sx={{ color: "#dc2626" }}>
                      {expectedText}
                    </Box>{" "}
                    will be permanently deleted
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Typography
                      component="label"
                      htmlFor="confirmationText"
                      sx={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: "#374151",
                        mb: 0.5,
                      }}
                    >
                      Enter the workspace name to confirm
                    </Typography>
                    <form
                      onSubmit={handleSubmit(handleDeleteWorkspace)}
                      autoComplete="off"
                    >
                      <TextField
                        {...register("confirmationText", { required: true })}
                        id="confirmationText"
                        type="text"
                        placeholder={expectedText}
                        autoFocus
                        size="small"
                        fullWidth
                        // RHF now controls the value, so NO value or onChange here!
                        InputProps={{
                          sx: {
                            px: 1.5,
                            py: 1.2,
                            borderRadius: 2,
                            fontFamily: "monospace",
                            fontSize: 14,
                            background:
                              confirmationText === ""
                                ? "#fff"
                                : confirmationMatch
                                  ? "#f0fdf4"
                                  : "#fef2f2",
                            border: "2px solid",
                            borderColor:
                              confirmationText === ""
                                ? "#e5e7eb"
                                : confirmationMatch
                                  ? "#86efac"
                                  : "#fca5a5",
                            transition: "all 0.2s",
                            "&.Mui-focused": {
                              borderColor:
                                confirmationText === ""
                                  ? "#60a5fa"
                                  : confirmationMatch
                                    ? "#22c55e"
                                    : "#dc2626",
                              boxShadow:
                                confirmationText === ""
                                  ? "0 0 0 4px #dbeafe"
                                  : confirmationMatch
                                    ? "0 0 0 4px #bbf7d0"
                                    : "0 0 0 4px #fee2e2",
                              background: "#fff",
                            },
                          },
                        }}
                        inputProps={{
                          style: {
                            fontFamily: "monospace",
                            fontSize: 14,
                          },
                        }}
                      />
                      {confirmationText !== "" && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mt: 1,
                          }}
                        >
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              bgcolor: confirmationMatch
                                ? "#22c55e"
                                : "#dc2626",
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              color: confirmationMatch ? "#15803d" : "#dc2626",
                              fontWeight: 500,
                            }}
                          >
                            {confirmationMatch
                              ? "Workspace name confirmed"
                              : "Workspace name doesn't match"}
                          </Typography>
                        </Box>
                      )}

                      {/* Footer actions */}
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          justifyContent: "flex-end",
                          mt: 4,
                        }}
                      >
                        <Button
                          type="button"
                          onClick={onClose}
                          variant="outlined"
                          sx={{
                            px: 2.5,
                            py: 1.2,
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#374151",
                            bgcolor: "#fff",
                            border: "1px solid #d1d5db",
                            borderRadius: 2,
                            "&:hover": {
                              bgcolor: "#f3f4f6",
                              borderColor: "#9ca3af",
                            },
                            boxShadow: "none",
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={!confirmationMatch || isLoading}
                          sx={{
                            px: 2.5,
                            py: 1.2,
                            fontSize: 14,
                            fontWeight: 600,
                            borderRadius: 2,
                            color: confirmationMatch ? "#fff" : "#9ca3af",
                            bgcolor: confirmationMatch ? "#dc2626" : "#e5e7eb",
                            cursor: confirmationMatch
                              ? "pointer"
                              : "not-allowed",
                            "&:hover": confirmationMatch
                              ? { bgcolor: "#b91c1c" }
                              : {},
                            boxShadow: confirmationMatch
                              ? "0 1px 2px 0 rgb(0 0 0 / 0.05)"
                              : "none",
                            transition: "all 0.2s",
                          }}
                        >
                          {isLoading ? (
                            <CircularProgress
                              size={18}
                              sx={{ color: "#fff", mr: 1 }}
                            />
                          ) : null}
                          {isLoading ? "Deleting..." : "Yes, Delete it"}
                        </Button>
                      </Box>
                    </form>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteWorkspaceModal;
