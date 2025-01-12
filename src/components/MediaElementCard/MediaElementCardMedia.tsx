import { useEffect, useState } from "react";

import { Box, CardMedia, IconButton } from "@mui/material";
import { BiImageAdd } from "react-icons/bi";
import { toast } from "react-toastify";

import { useUploadImageMutation } from "../../app/slices/optionApiSlice";
import { ErrorData, MediaElementMediaProps } from "../../utils/types";
import MediaElementImageUploadModal from "../Modals/MediaElementImageUploadModal";

import MediaElementCardIconBtns from "./MediaElementCardIconBtns";

const MediaElementCardMedia = ({
  open,
  setOpen,
  optionID,
  image,
}: MediaElementMediaProps) => {
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const [selectedOptionID, setSelectedOptionID] = useState<string | null>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [
    uploadImage,
    {
      isSuccess,
      isLoading,
      isError: isErrorUploadImage,
      error: errorUploadImage,
    },
  ] = useUploadImageMutation();

  const handleOpen = (optionID: string) => {
    setSelectedOptionID(optionID);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFile(null);
    setPreview(null);
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
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      width={"98%"}
      height={"100%"}
      maxHeight={"100%"}
      border={"2px solid #E4BD34"}
      bgcolor={"#E4BD34"}
      position={"relative"}
      sx={{
        margin: "auto",
        borderRadius: "8px",
        "&:hover .control-buttons": {
          visibility: "visible",
          opacity: 1,
          transition: "opacity 0.3s ease",
        },
      }}
      onMouseEnter={() => setIsHovered(optionID)}
      onMouseLeave={() => setIsHovered(null)}
    >
      {image ? (
        <>
          <CardMedia
            component="img"
            height="100%"
            image={image}
            sx={{ borderRadius: "8px" }}
          />
          <MediaElementCardIconBtns
            optionID={optionID}
            handleOpen={handleOpen}
            isHovered={isHovered}
          />
        </>
      ) : (
        <>
          <IconButton onClick={() => handleOpen(optionID)}>
            <BiImageAdd color={"#745C07"} size={"48px"} />
          </IconButton>
          <MediaElementImageUploadModal
            open={open}
            handleClose={handleClose}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            preview={preview}
            setPreview={setPreview}
            selectedOptionID={selectedOptionID}
            uploadImage={uploadImage}
            isLoading={isLoading}
          />
        </>
      )}
    </Box>
  );
};

export default MediaElementCardMedia;
