import { useEffect, useState } from "react";

import ClearIcon from "@mui/icons-material/Clear";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveIcon from "@mui/icons-material/Save";
import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import { FiUpload } from "react-icons/fi";
import { toast } from "react-toastify";

import { useUploadQuestionImageMutation } from "../../app/slices/elementApiSlice";
import { ErrorData, QuestionImageUploadModalProps } from "../../utils/types";

const QuestionImageUploadModal = ({
  uploadImageModalOpen,
  setUploadImageModalOpen,
  questionID,
}: QuestionImageUploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [
    uploadQuestionImage,
    {
      isSuccess,
      isLoading,
      isError: isErrorUploadImage,
      error: errorUploadImage,
    },
  ] = useUploadQuestionImageMutation();

  const handlePreviewImage = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("imgFile", selectedFile);

      uploadQuestionImage({ formData, questionID });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Image Saved !", {
        position: "top-right",
        autoClose: 2000,
        closeOnClick: true,
        theme: "colored",
      });
      setUploadImageModalOpen(false);
    }

    if (isErrorUploadImage) {
      const errorData = errorUploadImage as ErrorData;
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
  }, [isErrorUploadImage, errorUploadImage, isSuccess]);

  return (
    <Modal
      open={uploadImageModalOpen}
      onClose={() => setUploadImageModalOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        "& .MuiBackdrop-root": {
          backgroundColor: "transparent",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          height: 400,
          bgcolor: "background.paper",
          borderRadius: "2%",
          boxShadow: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              height: "10%",
              borderBottom: "1px solid #E0E0E0",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "90%",
                height: "90%",
                margin: "auto",
                // border: "2px solid black",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  Upload Image
                </Typography>
              </Box>
              <Box>
                <IconButton
                  aria-label="more"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  onClick={() => setUploadImageModalOpen(false)}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              width: "100%",
              height: "480px",
            }}
          >
            <Box
              sx={{
                width: "92%",
                height: "280px",
                margin: "auto",
                marginTop: "4%",
                border: "2px dashed #7866E3",
                borderRadius: "4%",
              }}
            >
              {preview ? (
                <>
                  <img
                    src={preview}
                    style={{
                      width: "100%",
                      height: "98%",
                      maxHeight: "98%",
                      objectFit: "contain",
                    }}
                  />
                  <IconButton
                    onClick={handlePreviewImage}
                    sx={{
                      backgroundColor: "red",
                      position: "absolute",
                      width: "24px",
                      height: "24px",
                      top: {
                        // md: "24%",
                        lg: "28%",
                        xl: "27%",
                      },
                      right: {
                        lg: "6%",
                        xl: "6%",
                      },
                      color: "white",
                      "&:hover": {
                        backgroundColor: "red",
                      },
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    margin: "auto",
                    marginTop: "4%",
                    width: "92%",
                    height: "92%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "70%",
                      height: "50px",
                      margin: "auto",
                      marginTop: "2%",
                    }}
                  >
                    <Typography
                      sx={{
                        marginTop: "12%",
                        fontSize: "40px",
                        color: "#7462E2",
                      }}
                    >
                      <FiUpload />
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "90%",
                      height: "80px",
                      margin: "auto",
                      marginTop: "2%",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "20px",
                        color: "black",
                        fontWeight: "bolder",
                      }}
                    >
                      Drop your image here
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "20px",
                            color: "black",
                            fontWeight: "bolder",
                          }}
                        >
                          or &nbsp;
                        </Typography>
                      </Box>
                      <Box>
                        <input
                          type="file"
                          id="img-ipload"
                          onChange={handleFileChange}
                          disabled={isLoading}
                          style={{ display: "none" }}
                        />
                        <label
                          htmlFor="img-ipload"
                          style={{
                            cursor: "pointer",
                            fontSize: "20px",
                            color: "#FE834E",
                            fontWeight: "bolder",
                          }}
                        >
                          Browse
                        </label>
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "90%",
                      height: "60px",
                      margin: "auto",
                      marginTop: "-8%",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "16px",
                        color: "#656F87",
                      }}
                    >
                      Supported Files: JPEG, PNG
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "16px",
                        color: "#656F87",
                      }}
                    >
                      Max Size: 5MB
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
          <Box
            sx={{
              width: "100%",
              height: "20%",
              borderTop: "1px solid #E0E0E0",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
                marginTop: "4%",
                // border: "2px solid black",
              }}
            >
              <Box>
                <Button
                  onClick={handleUpload}
                  component="label"
                  role={undefined}
                  variant="contained"
                  size="small"
                  tabIndex={-1}
                  startIcon={isLoading ? <SaveIcon /> : <CloudUploadIcon />}
                >
                  {isLoading ? "saving image ..." : "Upload Image"}
                </Button>
              </Box>
              <Box
                sx={{
                  marginLeft: "4%",
                  marginRight: "4%",
                }}
              >
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setUploadImageModalOpen(false)}
                  sx={{
                    textTransform: "capitalize",
                    color: "black",
                  }}
                >
                  Close
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default QuestionImageUploadModal;
