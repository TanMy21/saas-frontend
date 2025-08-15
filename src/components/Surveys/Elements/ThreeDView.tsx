import { useEffect, useState } from "react";

import FavoriteIcon from "@mui/icons-material/Favorite";
import { IconButton } from "@mui/material";
import { Replace, X } from "lucide-react";

import { RootState } from "../../../app/store";
import { useAppSelector } from "../../../app/typedReduxHooks";
import { ThreeDViewProps } from "../../../utils/types";
import Model3dLoader from "../../Loaders/Model3dLoader";
import Replace3DModelModal from "../../Modals/Replace3DModelModal";

import ElementQuestionText from "./ElementQuestionText";
import { Interactive3DModelViewer } from "./Interactive3DModelViewer";

const ThreeDView = ({ url, showQuestion, display }: ThreeDViewProps) => {
  const [isOpenReplaceModal, setIsOpenReplaceModal] = useState(false);
  const [viewerUrl, setViewerUrl] = useState<string | null>(url ?? null);
  const question = useAppSelector(
    (state: RootState) => state.question.selectedQuestion
  );

  const questionID = question?.questionID;
  const modelFileName = question?.Model3D?.name;
  const ready = !!viewerUrl;

  useEffect(() => {
    setViewerUrl(url ?? null);
  }, [url]);

  console.log("ThreeDView showQuestion:", showQuestion);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          height: "100%",
          // border: "2px solid red",
          gap: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "98%",
            padding: "8px",
            // height: "120px",
            gap: "16px",
            // border: "2px solid green",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "4%",
              // height: "98%",
              // border: "2px solid red",
            }}
          >
            <IconButton
              className="template-icon-btn"
              onClick={() => setIsOpenReplaceModal(true)}
              sx={{
                position: "absolute",
                top: 24,
                left: 20,
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
          {showQuestion && (
            <div
              style={{
                display: "flex",
                width: "96%",
                height: "98%",
                padding: "4px",
                // border: "2px solid red",
              }}
            >
              <ElementQuestionText display={display} />
            </div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            width: "96%",
            padding: "4px",
            height: "400px",
            // border: "2px solid blue",
          }}
        >
          <div
            style={{
              display: "flex",
              margin: "auto",
              width: "60%",
              height: "98%",
            }}
          >
            {ready ? (
              <Interactive3DModelViewer
                key={viewerUrl}
                src={viewerUrl}
                autoRotate
                autoRotateSpeed={0.4}
                height={400}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "grid",
                  placeItems: "center",
                  borderRadius: 12,
                  background: "#fafafa",
                  color: "#666",
                  fontSize: 14,
                }}
              >
                <Model3dLoader />
                Loading your 3D model …
              </div>
            )}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            width: "96%",
            height: "64px",
            // border: "2px solid green",
          }}
        >
          <div
            style={{
              display: "flex",
              margin: "auto",
              width: "32%",
              height: "80%",
              gap: "16px",
              // border: "2px solid red",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                // alignItems: "flex-end",
                width: "48%",
                height: "96%",
                // border: "2px solid red",
              }}
            >
              <IconButton
                sx={{
                  width: 48,
                  height: 48,
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
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                // alignItems: "center",
                width: "48%",
                height: "96%",
                // border: "2px solid green",
              }}
            >
              <IconButton
                sx={{
                  width: 48,
                  height: 48,
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
                <FavoriteIcon fontSize="medium" />
              </IconButton>
            </div>
          </div>
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
