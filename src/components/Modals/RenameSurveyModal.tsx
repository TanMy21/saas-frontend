import { useEffect } from "react";

import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { useRetitleSurveyMutation } from "../../app/slices/surveysApiSlice";
import { ErrorData, SurveyRenameProps } from "../../utils/types";
import { FormField } from "../ModalComponents/FormFields";

import { BaseModal } from "./BaseModal";

const RenameSurveyModal = ({ open, onClose, survey }: SurveyRenameProps) => {
  const [retitleSurvey, { isLoading, isSuccess, isError, error }] =
    useRetitleSurveyMutation();

  const {
    control,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<SurveyRenameProps>();

  const renameSurvey = async (data: SurveyRenameProps) => {
    const { surveyTitle } = data;
    const { surveyID } = survey!;
    try {
      await retitleSurvey({ surveyID, title: surveyTitle });
    } catch (error) {
      console.log(error);
    }
    onClose();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Survey Renamed Successfully !", {
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
          }),
        );
      } else {
        toast.error(errorData.data.message, {
          position: "top-right",
        });
      }
    }
  }, [isSuccess, isError, error]);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Rename survey"
      subtitle="Choose a new name for your survey"
      icon={<EditIcon style={{ width: 28, height: 28, color: "#2563EB" }} />}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(renameSurvey)}
        sx={{ px: 2, pb: 0.5 }}
      >
        <Box sx={{ mb: 1 }}>
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 700,
              color: "grey.700",
              mb: 1,
            }}
          >
            Survey name
          </Typography>

          {/* Form Field */}
          <FormField
            name="surveyTitle"
            control={control}
            errors={errors}
            touchedFields={touchedFields}
            placeholder="Enter survey name..."
            rules={{
              required: "Survey name is required",
              maxLength: {
                value: 300,
                message: "Max 300 characters",
              },
            }}
            inputProps={{
              maxLength: 50,
              autoFocus: true,
            }}
          />
        </Box>

        {/* Actions */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="submit" variant="modalSubmitBtn" disabled={isLoading}>
            {isLoading ? (
              <>
                <CircularProgress size={18} sx={{ color: "#fff", mr: 1 }} />
                Renaming...
              </>
            ) : (
              "Rename"
            )}
          </Button>
        </Box>
      </Box>
    </BaseModal>
  );
};

export default RenameSurveyModal;
