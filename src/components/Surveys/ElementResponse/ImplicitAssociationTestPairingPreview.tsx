import { Box, Typography } from "@mui/material";

import { DEFAULT_IAT_PREVIEW } from "../../../utils/constants";

import { PairingRow } from "./PairingRow";


export const ImplicitAssociationTestPairingPreview = () => {
  return (
    <Box
      sx={{
        border: "1px solid #E2E8F0",
        borderRadius: 3,
        bgcolor: "#FFFFFF",
        p: 2,
      }}
    >
      <Typography sx={{ fontSize: 14, fontWeight: 800, color: "#0F172A", mb: 1 }}>
        Pairing logic
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <PairingRow
          label="Block 1"
          left={`${DEFAULT_IAT_PREVIEW.targetA} + ${DEFAULT_IAT_PREVIEW.attributeA}`}
          right={`${DEFAULT_IAT_PREVIEW.targetB} + ${DEFAULT_IAT_PREVIEW.attributeB}`}
        />

        <PairingRow
          label="Block 2"
          left={`${DEFAULT_IAT_PREVIEW.targetA} + ${DEFAULT_IAT_PREVIEW.attributeB}`}
          right={`${DEFAULT_IAT_PREVIEW.targetB} + ${DEFAULT_IAT_PREVIEW.attributeA}`}
        />
      </Box>
    </Box>
  );
};