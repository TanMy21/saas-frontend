import { useState } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ClearIcon from "@mui/icons-material/Clear";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import { Box, IconButton, TextField, Typography } from "@mui/material";
import { IoMoveSharp } from "react-icons/io5";

import {
  useDeleteOptionMutation,
  useUpdateOptionTextandValueMutation,
} from "../../../app/slices/optionApiSlice";
import { MediaOptionProps } from "../../../utils/types";
import MediaElementCardIconBtns from "../../MediaElementCard/MediaElementCardIconBtns";
import MediaElementImageUploadModal from "../../Modals/MediaElementImageUploadModal";

const MediaOption = ({ option }: MediaOptionProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: option.optionID });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [uploadImageModalOpen, setUploadImageModalOpen] =
    useState<boolean>(false);
  const [editText, setEditText] = useState<string>(option.value);
  const imageSrc = option.image ? option.image : null;

  const [updateOptionTextandValue] = useUpdateOptionTextandValueMutation();
  const [deleteOption] = useDeleteOptionMutation();

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(event.target.value);
  };

  const handleBlur = async () => {
    await updateOptionTextandValue({
      optionID: option.optionID,
      value: editText,
    });
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  const deleteChoice = async () => {
    try {
      await deleteOption(option.optionID).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      sx={{
        transform: CSS.Transform.toString(transform),
        touchAction: "none",
        zIndex: transform ? 10 : "auto",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#F9F9F9",
        border: "2px solid #F1F1F1",
        borderRadius: 4,
        flex: 1,
        minHeight: { xs: 160, sm: 200, md: 240, xl: 240 },
        overflow: "hidden",
        boxShadow: transform ? "0 8px 20px rgba(0, 0, 0, 0.12)" : "none",
        transition:
          transition ?? "border-color 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          borderColor: "#F9F9F9",
          borderWidth: "2px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: { xs: 140, sm: 160, md: 180, xl: 200 },
          flexShrink: 0,
          // border: "1px solid red",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Box
          sx={{
            flexGrow: 1,
            // border: "1px dashed grey",
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            overflow: "hidden",
          }}
        >
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={option.value}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <Box
              onClick={() => setUploadImageModalOpen(true)}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: "#676767",
                fontWeight: "bold",
              }}
            >
              <InsertPhotoIcon sx={{ fontSize: 24 }} />
              <span>Upload Image</span>
            </Box>
          )}
          <MediaElementImageUploadModal
            uploadImageModalOpen={uploadImageModalOpen}
            setUploadImageModalOpen={setUploadImageModalOpen}
            optionID={option.optionID}
          />
        </Box>
        {isHovered && (
          <Box
            sx={{
              position: "absolute",
              display: "flex",
              gap: 2,
              width: "96%",
              height: 40,
              top: 4,
              right: 4,
              // border: "2px solid red",
              pointerEvents: "none",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "16%",
                height: "96%",
                // border: "2px solid green",
                pointerEvents: "auto",
              }}
            >
              <IconButton
                sx={{
                  position: "absolute",
                  top: 4,
                  left: 4,
                  cursor: "grab",
                  color: "#848484",
                  backgroundColor: "white",
                  "&:hover": {
                    backgroundColor: "white",
                  },
                }}
              >
                <IoMoveSharp style={{ fontSize: 16 }} />
              </IconButton>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "64%",
                height: "92%",
                // border: "2px solid green",
                pointerEvents: "auto",
              }}
            >
              <MediaElementCardIconBtns optionID={option.optionID} />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "16%",
                height: "96%",
                // border: "2px solid green",
                pointerEvents: "auto",
              }}
            >
              <IconButton
                onClick={deleteChoice}
                sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  color: "red",
                  backgroundColor: "white",
                  "&:hover": {
                    backgroundColor: "white",
                  },
                }}
              >
                <ClearIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          </Box>
        )}
      </Box>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "flex-start",
          flexGrow: 1,
          gap: 1,
          p: 1,
          width: "100%",
          minHeight: 80,
          height: "100%",
          backgroundColor: "white",
          // border: "1px solid red",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: option.value.length > 24 ? "center" : "flex-start",
            pt: option.value.length <= 30 ? "4px" : 0,
            // border: "2px solid red",
            width: "16%",
            minHeight: "80%",
            height: "auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#5B6AD0",
              borderRadius: 1,
              color: "white",
              width: 24,
              height: 24,
              fontSize: 12,
              fontWeight: "bold",
            }}
          >
            {option.text}
          </Box>
        </Box>
        <Box
          onDoubleClick={handleDoubleClick}
          sx={{
            display: "flex",
            flex: 1,
            justifyContent: "flex-start",
            alignItems: "flex-start",
            // border: "2px solid red",
            // width: "64%",
            padding: "4px 8px",
            paddingRight: "16px",
            minHeight: 40,
            height: "auto",
            overflowWrap: "break-word",
          }}
        >
          {isEditing ? (
            <TextField
              id="outlined-basic"
              variant="outlined"
              type="text"
              value={editText}
              multiline
              minRows={1}
              maxRows={4}
              onChange={handleChange}
              onBlur={handleBlur}
              autoFocus
              InputProps={{
                sx: {
                  // height: "100%",
                  padding: "0px",
                  "& input": {
                    padding: "4px 8px",
                  },
                },
              }}
              sx={{
                backgroundColor: "transparent",
                width: "100%",
                // height: "100%",
                "& .MuiOutlinedInput-root": {
                  // height: "100%",
                  "& fieldset": {
                    border: "none",
                  },
                },
              }}
            />
          ) : (
            <Typography
              sx={{
                fontSize: "16px",
                wordBreak: "break-word",
                // width: "96%",
                padding: "4px",
                // overflowWrap: "break-word",
                whiteSpace: "pre-wrap",
                lineHeight: 1.4,
              }}
              onClick={handleClick}
            >
              {option.value}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default MediaOption;
