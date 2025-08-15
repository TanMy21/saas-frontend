import FavoriteIcon from "@mui/icons-material/Favorite";
import { IconButton } from "@mui/material";
import { X } from "lucide-react";

import { RootState } from "../../../app/store";
import { useAppSelector } from "../../../app/typedReduxHooks";
import { ThreeDViewProps } from "../../../utils/types";

import ElementQuestionText from "./ElementQuestionText";
import { Interactive3DModelViewer } from "./Interactive3DModelViewer";

const ThreeDMobileView = ({ url, display }: ThreeDViewProps) => {
  const showQuestion = useAppSelector(
    (state: RootState) =>
      state.question.selectedQuestion?.Model3D?.showQuestion ?? false
  );

  console.log("ThreeDMobileView showQuestion:", showQuestion);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "98%",
        margin: "auto",
        height: "100%",
        // border: "2px solid green",
        gap: "16px",
      }}
    >
      {showQuestion && (
        <div
          style={{
            display: "flex",
            width: "98%",
            // height: "200px",
            padding: "4px",
            // border: "2px solid red",
          }}
        >
          <ElementQuestionText display={display} />
        </div>
      )}
      <div
        style={{
          display: "flex",
          width: "98%",
          height: "60px",
          // border: "2px solid red",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "98%",
            height: "98%",
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
            alignItems: "center",
            width: "98%",
            height: "98%",
            // border: "2px solid red",
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
              "&:hover": { bgcolor: "#22C55E", transform: "scale(1.05)" },
              "&:active": { transform: "scale(0.95)" },
              transition: "all 0.15s ease",
            }}
            aria-label="delete"
          >
            <FavoriteIcon fontSize="medium" />
          </IconButton>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          width: "98%",
          height: "400px",
          padding: "4px",
          // border: "2px solid red",
        }}
      >
        <Interactive3DModelViewer
          src={url}
          autoRotate
          autoRotateSpeed={0.4}
          height={showQuestion ? 360 : 500}
        />
      </div>
    </div>
  );
};

export default ThreeDMobileView;
