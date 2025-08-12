import FavoriteIcon from "@mui/icons-material/Favorite";
import { IconButton } from "@mui/material";
import { X } from "lucide-react";

import { ThreeDViewProps } from "../../../utils/types";

import { Interactive3DModelViewer } from "./Interactive3DModelViewer";

const ThreeDView = ({ url }: ThreeDViewProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "98%",
        border: "2px solid red",
        gap: "32px", // gap: 4 in MUI spacing = 4 * 8px = 32px
      }}
    >
      {/* Left Column */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "16px",
          justifyContent: "flex-end",
          alignItems: "center",
          width: "16%",
          height: "580px",
          border: "2px solid green",
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

      {/* Middle Column */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "60%",
          height: "580px",
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
          height: "580px",
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
  );
};

export default ThreeDView;
