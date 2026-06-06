import { useState } from "react";

import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";

import { RootState } from "../../../app/store";
import QuestionImageUploadModal from "../../Modals/QuestionImageUploadModal";

import ElementImageIconButtons from "./ElementImageIconButtons";

const ElementImageContainer = () => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [uploadImageModalOpen, setUploadImageModalOpen] =
    useState<boolean>(false);
  const question = useSelector(
    (state: RootState) => state.question.selectedQuestion,
  );

  const { questionID, questionImages } = question || {};
  const firstImage = questionImages?.[0];
  const imageUrl = firstImage?.imageUrl;
  const imageWidth = firstImage?.width || 300;
  const imageHeight = firstImage?.height || 200;
  const questionImageID = firstImage?.questionImageID;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "340px",
        margin: "0 auto",
        mb: 5,
        // border: "2px solid red",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: imageWidth,
          height: imageHeight,
          backgroundColor: "#F8F9FE",
          borderRadius: "8px",
          // border: "2px dashed blue",
          position: "relative",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Box
          key={imageUrl}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            borderRadius: "8px",
            overflow: "hidden",
            zIndex: 1,
          }}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              //   alt={questionImageAltText}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
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
          <QuestionImageUploadModal
            uploadImageModalOpen={uploadImageModalOpen}
            setUploadImageModalOpen={setUploadImageModalOpen}
            questionID={questionID!}
          />
        </Box>
        {isHovered && (
          <Box
            sx={{
              position: "absolute",
              top: "4%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "92%",
              height: "8%",
              // border: "2px solid green",
              pointerEvents: "auto",
              zIndex: 20,
              px: 1.5,
            }}
          >
            <ElementImageIconButtons
              questionID={questionID!}
              questionImageID={questionImageID!}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ElementImageContainer;
