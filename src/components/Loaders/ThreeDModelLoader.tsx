import { Box } from "@mui/material";
import { Html } from "@react-three/drei";

const ThreeDModelLoader = () => {
  return (
    <Html center>
      <Box
        sx={{
          px: 1.5,
          py: 1,
          bgcolor: "rgba(255,255,255,.92)",
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,.08)",
          fontSize: 12,
        }}
      >
        Loading 3D model…
      </Box>
    </Html>
  );
};

export default ThreeDModelLoader;
