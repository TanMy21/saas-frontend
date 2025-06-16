import { useEffect } from "react";

import { Box, Button, Modal, Typography } from "@mui/material";
import { toast } from "react-toastify";

import { useDeleteSurveyMutation } from "../../app/slices/surveysApiSlice";
import { ErrorData, SurveyRenameProps } from "../../utils/types";

const DeleteSurveyModal = ({
  open,
  onClose,
  sID,
  sTitle,
}: SurveyRenameProps) => {
  const [deleteSurvey, { isSuccess, isError, error, isLoading }] =
    useDeleteSurveyMutation();
  const handleDeleteSurvey = async () => {
    try {
      await deleteSurvey(sID);
    } catch (error) {
      console.log(error);
    }
    onClose();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Survey Deleted !", {
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
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          minHeight: 120,
          bgcolor: "background.paper",
          borderRadius: 3,
          p: 4,
        }}
      >
        <Box>
          <Box
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-between"}
          >
            <Box>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Delete this Survey?
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography sx={{ fontSize: "0.9rem", color: "red" }}>
              You will lose all the data associated with this survey:
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              width: "98%",
              height: "60%",
              textWrap: "wrap",
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
                whiteSpace: "normal",
                wordBreak: "break-word",
                overflowWrap: "break-word",
                lineHeight: 1.4,
              }}
              mt={1}
              mb={1}
            >
              {sTitle} will be permanently deleted
            </Typography>
          </Box>
        </Box>
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              height: "40px",
              gap: 2,
              mt: 1,
              mb: "-4%",
            }}
          >
            <Button
              type="button"
              onClick={onClose}
              variant="outlined"
              size="small"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="dangerBtn"
              size="small"
              onClick={handleDeleteSurvey}
            >
              {isLoading ? "Deleting..." : "Yes, Delete it"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteSurveyModal;
