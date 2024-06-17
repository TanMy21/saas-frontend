import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  Modal,
  RadioGroup,
} from "@mui/material";
import { DownloadResponsesModalProps, ErrorData } from "../../utils/types";
import CloseIcon from "@mui/icons-material/Close";
import { CustomRadioButton } from "../CustomRadioButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { DownloadFormData, downloadDataSchema } from "../../utils/schema";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
// import {
//   exportToCsv,
//   exportToPdf,
//   exportToXlsx,
// } from "../../utils/DataDownload";
import { useExportDataMutation } from "../../app/slices/exportDataApi";
import { useEffect } from "react";
import { toast } from "react-toastify";

const DownloadResponsesModal = ({
  rowData,
  columns,
  open,
  handleClose,
}: DownloadResponsesModalProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DownloadFormData>({
    resolver: zodResolver(downloadDataSchema),
    defaultValues: {
      fileFormatGroup: "csv",
    },
  });

  const [exportData, { isError, error }] = useExportDataMutation();

  const handleDownloadFormSubmit: SubmitHandler<DownloadFormData> = (data) => {
    const { fileFormatGroup } = data;

    exportData({ format: fileFormatGroup, selectedRows: rowData, columns });
  };

  useEffect(() => {
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
  }, [isError, error]);

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
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
            height: "36vh",
            bgcolor: "background.paper",
            borderRadius: 1,
            p: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              // gap: "4px",
              margin: "auto",
              width: "100%",
              height: "100%",
              // border: "2px solid orange",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                margin: "auto",
                width: "100%",
                height: "12%",
                // border: "2px solid black",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  width: "90%",
                  height: "92%",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  // border: "2px solid red",
                }}
              >
                Choose Format to download responses
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "10%",
                  height: "92%",
                  // border: "2px solid red",
                }}
              >
                <IconButton
                  aria-label="more"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  onClick={handleClose}
                  sx={{ top: "10%" }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "4%",
                margin: "auto",
                width: "100%",
                height: "60%",
                // border: "2px solid green",
              }}
            >
              <form onSubmit={handleSubmit(handleDownloadFormSubmit)}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    margin: "auto",
                    padding: "2%",
                    width: "96%",
                    height: "60%",
                    // border: "2px solid black",
                  }}
                >
                  <FormControl error={!!errors.fileFormatGroup}>
                    <Controller
                      name="fileFormatGroup"
                      control={control}
                      render={({ field }) => (
                        <>
                          <RadioGroup {...field}>
                            <FormControlLabel
                              value="csv"
                              control={<CustomRadioButton />}
                              label="CSV"
                            />
                            <FormControlLabel
                              value="xlsx"
                              control={<CustomRadioButton />}
                              label="XLSX"
                            />
                            {/* <FormControlLabel
                              value="pdf"
                              control={<CustomRadioButton />}
                              label="pdf"
                            /> */}
                          </RadioGroup>
                        </>
                      )}
                    />
                    {errors.fileFormatGroup && (
                      <FormHelperText>
                        {errors.fileFormatGroup.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Box>
                <Divider sx={{ marginTop: "2%", borderBottomWidth:"2px" }} />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    margin: "auto",
                    marginTop: "4%",
                    paddingRight: "2%",
                    width: "96%",
                    height: "24%",
                    // border: "2px solid black",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      gap: "12px",
                      width: "48%",
                      height: "100%",
                      // border: "2px solid blue",
                    }}
                  >
                    <Button
                      onClick={handleClose}
                      fullWidth
                      variant="outlined"
                      sx={{ textTransform: "capitalize" }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      fullWidth
                      variant="outlined"
                      sx={{ textTransform: "capitalize" }}
                    >
                      Download
                    </Button>
                  </Box>
                </Box>
              </form>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default DownloadResponsesModal;
