import { useEffect, useState } from "react";

import ClearIcon from "@mui/icons-material/Clear";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveIcon from "@mui/icons-material/Save";
import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import { FiUpload } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { useUploadQuestionTemplateImageMutation } from "../../app/slices/elementApiSlice";
import { setTemplateImage } from "../../app/slices/elementSlice";
import { useAppTheme } from "../../theme/useAppTheme";
import { ErrorData, QuestionImageUploadModalProps } from "../../utils/types";

const QuestionTemplateImageUpload = ({
  uploadImageModalOpen,
  setUploadImageModalOpen,
  questionID,
}: QuestionImageUploadModalProps) => {
  const { primary } = useAppTheme();
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [
    uploadQuestionTemplateImage,
    {
      isSuccess,
      isLoading,
      isError: isErrorUploadImage,
      error: errorUploadImage,
    },
  ] = useUploadQuestionTemplateImageMutation();

  const handlePreviewImage = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  const handleUpload = async () => {
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("imgFile", selectedFile);

        const data = await uploadQuestionTemplateImage({
          formData,
          questionID,
        }).unwrap();
        if (data) {
          dispatch(setTemplateImage({ url: data.questionImageTemplateUrl }));
          console.log(
            "Image uploaded successfully:",
            data.questionImageTemplateUrl
          );
        }
      }
    } catch (error) {
      console.error("Error uploading template:", error);
      toast.error("Error uploading template image", {
        position: "top-right",
        autoClose: 2000,
        closeOnClick: true,
        theme: "colored",
      });
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
      toast.success("Template Saved !", {
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
          width: 800,
          height: { md: 500, xl: 600 },
          bgcolor: "#f4f6f8",
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
              height: { md: "10%", xl: "8%" },
              borderBottom: "1px solid #E0E0E0",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "96%",
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
              height: {md:"400px",xl:"500px"},
            }}
          >
            <Box
              sx={{
                width: "92%",
                height: { md: "320px", xl: "440px" },
                margin: "auto",
                marginTop: "4%",
                border: "2px dashed #7866E3",
                borderRadius: "4%",
                overflow: "hidden",
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
                      objectFit: "cover",
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
                        xl: "20%",
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
                    marginTop: "16%",
                    width: "92%",
                    height: "60%",
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
                        marginTop: "8%",
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
                      marginTop: "-4%",
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
              height: "12%",
              borderTop: "1px solid #E0E0E0",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
                marginTop: "1%",
                pr: "4%",
                // border: "2px solid black",
              }}
            >
              <Box>
                <Button
                  onClick={handleUpload}
                  component="label"
                  role={undefined}
                  variant="submitBtn2"
                  size="medium"
                  tabIndex={-1}
                  startIcon={isLoading ? <SaveIcon /> : <CloudUploadIcon />}
                  sx={{
                    borderRadius: 5,
                    width: "200px",

                    textTransform: "none",
                    backgroundColor: primary.main,
                    "&:hover": {
                      backgroundColor: primary.main,
                    },
                  }}
                >
                  {isLoading ? "Saving image ..." : "Upload image"}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default QuestionTemplateImageUpload;
