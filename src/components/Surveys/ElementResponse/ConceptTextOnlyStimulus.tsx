import { Box } from "@mui/material";

import { ConceptFitStimulusLayoutProps } from "../../../types/surveyBuilderTypes";

import { ConceptFitAttributeManager } from "./ConceptFitAttributeManager";

export const ConceptTextOnlyStimulus = (
  props: ConceptFitStimulusLayoutProps,
) => {
  const { display } = props;

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
          width: display === "mobile" ? "92%" : "72%",
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        <ConceptFitAttributeManager {...props} />
      </Box>
    </Box>
  );
};
