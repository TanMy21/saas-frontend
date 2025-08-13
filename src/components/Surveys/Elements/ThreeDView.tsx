import { useState } from "react";

import FavoriteIcon from "@mui/icons-material/Favorite";
import { IconButton } from "@mui/material";
import { Replace, X } from "lucide-react";

import { RootState } from "../../../app/store";
import { useAppSelector } from "../../../app/typedReduxHooks";
import { ThreeDViewProps } from "../../../utils/types";
import Replace3DModelModal from "../../Modals/Replace3DModelModal";

import { Interactive3DModelViewer } from "./Interactive3DModelViewer";

const ThreeDView = ({ url }: ThreeDViewProps) => {
  const [isOpenReplaceModal, setIsOpenReplaceModal] = useState(false);
  const question = useAppSelector(
    (state: RootState) => state.question.selectedQuestion
  );

  const questionID = question?.questionID;
  const modelFileName = question?.Model3D?.name;

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          height: "98%",
          border: "2px solid red",
          gap: "32px",
        }}
      >
        {/* Left Column */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            padding: "8px",
            justifyContent: "space-between",
            alignItems: "center",
            width: "16%",
            height: "600px",
            border: "2px solid green",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "98%",
              height: "8%",
              border: "2px solid red",
            }}
          >
            <IconButton
              className="template-icon-btn"
              onClick={() => setIsOpenReplaceModal(true)}
              sx={{
                position: "absolute",
                top: 24,
                left: 24,
                zIndex: 2,
                backgroundColor: "#FFFFFF",
                color: "#424242",
                borderRadius: "50%",
                "&:hover": {
                  backgroundColor: "#F5F5F5",
                },
              }}
            >
              <Replace />
            </IconButton>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
              width: "98%",
              height: "16%",
              border: "2px solid red",
            }}
          >
            <IconButton
              sx={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                bgcolor: "#EF4444",
                color: "#FFFFFF",
                boxShadow: 3,
                "&:hover": { bgcolor: "#DC2626", transform: "scale(1.05)" },
                "&:active": { transform: "scale(0.95)" },
                transition: "all 0.15s ease",
              }}
              aria-label="delete"
            >
              <X fontSize={"large"} fontWeight={700} />
            </IconButton>
          </div>
        </div>

        {/* Middle Column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "60%",
            height: "600px",
            border: "2px solid green",
          }}
        >
          <Interactive3DModelViewer
            src={url}
            autoRotate
            autoRotateSpeed={0.4}
            height={440}
          />
        </div>

        {/* Right Column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "16px",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "16%",
            height: "600px",
            border: "2px solid green",
          }}
        >
          <IconButton
            sx={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              bgcolor: "#22C55E",
              color: "#FFFFFF",
              boxShadow: 3,
              "&:hover": { bgcolor: "#16A34A", transform: "scale(1.05)" },
              "&:active": { transform: "scale(0.95)" },
              transition: "all 0.15s ease",
            }}
            aria-label="like"
          >
            <FavoriteIcon fontSize="large" />
          </IconButton>
        </div>
      </div>
      <Replace3DModelModal
        open={isOpenReplaceModal}
        onClose={() => setIsOpenReplaceModal(false)}
        questionID={questionID!}
        currentFileName={modelFileName}
      />
    </>
  );
};

export default ThreeDView;
