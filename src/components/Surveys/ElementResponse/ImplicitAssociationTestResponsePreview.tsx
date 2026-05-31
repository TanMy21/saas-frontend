import { Box } from "@mui/material";

import { ElementProps } from "../../../utils/types";

import { ImplicitAssociationTestBlockPreview } from "./ImplicitAssociationTestBlockPreview";
import { ImplicitAssociationTestBuilderNote } from "./ImplicitAssociationTestBuilderNote";
import { ImplicitAssociationTestPairingPreview } from "./ImplicitAssociationTestPairingPreview";

export const ImplicitAssociationTestResponsePreview = ({
  qID,
  display,
}: ElementProps) => {
  const isMobile = display === "mobile";

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        mt: 3,
      }}
    >
      <Box
        sx={{
          width: isMobile ? "92%" : "76%",
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        <ImplicitAssociationTestBlockPreview />

        <ImplicitAssociationTestPairingPreview />

        <ImplicitAssociationTestBuilderNote />
      </Box>
    </Box>
  );
};
