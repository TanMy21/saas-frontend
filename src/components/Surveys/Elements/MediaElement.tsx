import { useEffect, useState } from "react";

import ClearIcon from "@mui/icons-material/Clear";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ImageIcon from "@mui/icons-material/Image";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  Modal,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { BiImageAdd } from "react-icons/bi";
import { FiUpload } from "react-icons/fi";
import { MdAdd } from "react-icons/md";
import { toast } from "react-toastify";

import {
  useCreateNewOptionMutation,
  useDeleteOptionMutation,
  useGetOptionsOfQuestionQuery,
  useRemoveImageMutation,
  useUpdateOptionTextandValueMutation,
  useUploadImageMutation,
} from "../../../app/slices/optionApiSlice";
import { ElementProps, ErrorData, OptionType } from "../../../utils/types";

import ElementQuestionText from "./ElementQuestionText";

const MediaElement = ({
  qID,
  qNO,
  qText,
  qDescription,
  display,
}: ElementProps) => {
  const [open, setOpen] = useState(false);
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedOptionID, setSelectedOptionID] = useState<string | null>("");
  const [editingID, setEditingID] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");
  const [preview, setPreview] = useState<string | null>(null);

  const handleOpen = (optionID: string) => {
    setSelectedOptionID(optionID);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFile(null);
    setPreview(null);
  };

  // const [editingID, setEditingID] = useState<string | null>(null);

  const { data: options = [] as OptionType[] } = useGetOptionsOfQuestionQuery(
    qID!
  );

  const [createNewOption, { isError, error }] = useCreateNewOptionMutation();

  const [updateOptionTextandValue] = useUpdateOptionTextandValueMutation();

  const [
    uploadImage,
    {
      isSuccess,
      isLoading,
      isError: isErrorUploadImage,
      error: errorUploadImage,
    },
  ] = useUploadImageMutation();

  const btnContainerWidth = display === "mobile" ? "50%" : "20%";

  const [deleteOption] = useDeleteOptionMutation();
  const [removeImage] = useRemoveImageMutation();

  const addMedia = async () => {
    const order = options ? options.length + 1 : 1;

    try {
      if (options.length < 10) {
        const nextCharCode = "A".charCodeAt(0) + options.length;
        const nextChoiceLetter = String.fromCharCode(nextCharCode);

        await createNewOption({
          questionID: qID,
          text: `${nextChoiceLetter}`,
          value: `Choice ${nextChoiceLetter}`,
          order,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteChoice = async (optionID: string) => {
    try {
      await deleteOption(optionID).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveImage = async (optionID: string) => {
    try {
      await removeImage(optionID).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
    // optionID: string
  ) => {
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

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("imgFile", selectedFile);

      await uploadImage({ formData, optionID: selectedOptionID });
    }
  };

  const handlePreviewImage = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  const handleDoubleClick = (option: OptionType) => {
    setEditingID(option.optionID);
    setEditText(option.value);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(event.target.value);
  };

  const handleBlur = async () => {
    await updateOptionTextandValue({
      optionID: editingID,
      value: editText,
    });
    setEditingID(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Image Saved !", {
        position: "top-right",
        autoClose: 2000,
        closeOnClick: true,
        theme: "colored",
      });
      handleClose();
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
  }, [
    isError,
    isErrorUploadImage,
    error,
    errorUploadImage,
    options,
    isSuccess,
  ]);

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"start"}
      alignItems={"center"}
      margin={"auto"}
      width={"92%"}
      minHeight={"100%"}
      zIndex={20}
    >
      <Box
        display={"flex"}
        flexDirection={"row"}
        sx={{ width: "98%", marginTop: "4%" }}
      >
        <ElementQuestionText
          qID={qID}
          qNO={qNO}
          qText={qText}
          qDescription={qDescription}
          display={display}
        />
      </Box>
      <Box width={"96%"} minHeight={"60vh"} p={2}>
        <Grid
          container
          margin={"auto"}
          width={"100%"}
          height={"100%"}
          spacing={"8px"}
          columns={12}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
        >
          <Box
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"center"}
            sx={{ maxWidth: "70%", margin: "auto", flexWrap: "wrap" }}
          >
            {options.map((option) => (
              <Box
                key={option.optionID}
                sx={{
                  p: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  width: 180,
                  height: 210,
                  marginRight: "4px",
                }}
              >
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: {
                      xs: "100%",
                      sm: "90%",
                      md: "72%",
                      lg: 160,
                      xl: 180,
                    },
                    height: { xs: 150, sm: 170, md: 190, lg: 180, xl: 210 },
                    border: "1px solid #DFCF94",
                    bgcolor: "#DFCF94",
                  }}
                >
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    width={"90%"}
                    height={"76%"}
                    border={"2px solid #E4BD34"}
                    bgcolor={"#E4BD34"}
                    mt={1}
                    position={"relative"}
                    sx={{
                      "&:hover .control-buttons": {
                        visibility: "visible",
                        opacity: 1,
                        transition: "opacity 0.3s ease",
                      },
                    }}
                    onMouseEnter={() => setIsHovered(option.optionID)}
                    onMouseLeave={() => setIsHovered(null)}
                  >
                    {option.image ? (
                      <>
                        <img
                          src={option.image}
                          style={{
                            width: "100%",
                            height: "100%",
                            maxHeight: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <Box
                          className="control-buttons"
                          sx={{
                            position: "absolute",
                            top: "4%",
                            right: "4%",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "flex-end",
                            backgroundColor: "transparent",
                            alignSelf: "end",
                            gap: 1,
                            visibility: isHovered ? "visible" : "hidden",
                            opacity: isHovered ? 1 : 0,
                            transition: "opacity 0.3s ease",
                          }}
                        >
                          <Tooltip title="Replace">
                            <IconButton
                              onClick={() => handleOpen(option.optionID)}
                              sx={{
                                backgroundColor: "#E3E3E3",
                                color: "#3A3A3A",
                                width: "28px",
                                height: "28px",
                                borderRadius: "8%",
                                "&:hover": {
                                  backgroundColor: "#E3E3E3",
                                  color: "#3A3A3A",
                                },
                              }}
                            >
                              <ImageIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Remove">
                            <IconButton
                              onClick={() => handleRemoveImage(option.optionID)}
                              sx={{
                                width: "28px",
                                height: "28px",
                                borderRadius: "8%",
                                backgroundColor: "#E3E3E3",
                                color: "#3A3A3A",
                                "&:hover": {
                                  backgroundColor: "#E3E3E3",
                                  color: "#3A3A3A",
                                },
                              }}
                            >
                              <DeleteForeverIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </>
                    ) : (
                      <>
                        <IconButton onClick={() => handleOpen(option.optionID)}>
                          <BiImageAdd color={"#745C07"} size={"48px"} />
                        </IconButton>
                        <Modal
                          open={open}
                          onClose={handleClose}
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
                                      onClick={handleClose}
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
                                      startIcon={
                                        isLoading ? (
                                          <SaveIcon />
                                        ) : (
                                          <CloudUploadIcon />
                                        )
                                      }
                                    >
                                      {isLoading
                                        ? "saving image ..."
                                        : "Upload Image"}
                                    </Button>
                                  </Box>
                                  <Box
                                    sx={{ marginLeft: "4%", marginRight: "4%" }}
                                  >
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      onClick={handleClose}
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
                      </>
                    )}
                  </Box>
                  <Box
                    sx={{
                      width: "90%",
                      height: "20%",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "start",
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          width: "24px",
                          height: "24px",
                          bgcolor: "white",
                          borderRadius: "2px",
                          textOverflow: "clip",
                          border: "2px solid black",
                        }}
                      >
                        <Typography variant="subtitle2">
                          {option.text}
                        </Typography>
                      </Box>
                      <Box
                        onDoubleClick={() => handleDoubleClick(option)}
                        sx={{ cursor: "pointer" }}
                      >
                        {editingID === option.optionID ? (
                          <TextField
                            id="outlined-basic"
                            variant="outlined"
                            type="text"
                            value={editText}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            autoFocus
                            InputProps={{
                              sx: {
                                height: "100%",
                                padding: "0px",
                                "& input": {
                                  padding: "4px 8px",
                                },
                              },
                            }}
                            sx={{
                              backgroundColor: "transparent",
                              width: "100%",
                              height: "100%",
                              "& .MuiOutlinedInput-root": {
                                height: "100%",
                                "& fieldset": {
                                  border: "none",
                                },
                              },
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              marginLeft: "8%",
                              width: "68%",
                              border: "2px solid red",
                              overflow: "hidden",
                            }}
                          >
                            <Typography
                              ml={2}
                              sx={{
                                fontSize: "16px",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "clip",
                              }}
                              onClick={handleClick}
                            >
                              {option.value}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Card>
                <IconButton
                  className="close-button"
                  onClick={() => deleteChoice(option.optionID)}
                  z-index={10}
                  sx={{
                    position: "relative",
                    top: { lg: "-82%", xl: "-84%" },
                    right: { lg: "-44%", xl: "-50%" },
                    transform: "translateY(-80%)",
                    visibility: "visible",
                    width: "24px",
                    height: "24px",
                    backgroundColor: "red",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "darkred",
                      visibility: "visible",
                    },
                  }}
                >
                  <ClearIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
          <Box
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"center"}
            sx={{ width: btnContainerWidth, margin: "auto", padding: "4px" }}
          >
            {/* Add Card Button */}
            {options.length < 5 && (
              // <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  width: {
                    xs: "100%",
                    sm: "90%",
                    md: "72%",
                    lg: 160,
                    xl: 180,
                  },
                  height: { xs: 150, sm: 170, md: 190, lg: 180, xl: 184 },
                  marginTop: { lg: "12px", xl: "0px" },
                  border: "1px solid #DFCF94",
                  bgcolor: "#DFCF94",
                }}
              >
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  onClick={addMedia}
                  sx={{ width: "100%", height: "100%" }}
                >
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    width={"90%"}
                    height={"76%"}
                  >
                    <IconButton>
                      <MdAdd color={"#745C07"} size={"48px"} />
                    </IconButton>
                  </Box>
                </Box>
              </Card>
              // </Grid>
            )}
          </Box>
        </Grid>
      </Box>
    </Box>
  );
};
export default MediaElement;
