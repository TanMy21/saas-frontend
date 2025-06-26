import { Box } from "@mui/material";

import { ScaleResponseProps } from "../../../utils/types";

import ProgressiveSlider from "./ProgressiveSlider";
import ScaleCounter from "./ScaleCounter";

const ScaleResponse = ({ display }: ScaleResponseProps) => {
  return (
    <Box
      sx={{
        width: "80%",
        p: { xs: 2, sm: 3, md: 4, xl: 6 },
      }}
    >
      {display === "mobile" ? <ScaleCounter /> : <ProgressiveSlider />}
    </Box>
  );
};

export default ScaleResponse;
