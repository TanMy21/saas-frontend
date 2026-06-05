import { Box } from "@mui/material";

import { useGetOptionsOfQuestionQuery } from "../../../app/slices/optionApiSlice";
import { ElementProps, OptionType } from "../../../utils/types";

import { IATStimulusManager } from "./IATStimulusManager";
import { ImplicitAssociationTestBlockPreview } from "./ImplicitAssociationTestBlockPreview";
import { ImplicitAssociationTestBuilderNote } from "./ImplicitAssociationTestBuilderNote";

export const ImplicitAssociationTestResponsePreview = ({
  qID,
  display,
}: ElementProps) => {
  const isMobile = display === "mobile";

  const { data: options = [] as OptionType[] } = useGetOptionsOfQuestionQuery(
    qID!,
    {
      skip: !qID,
    },
  );

  const sortedStimuli = [...options].sort(
    (a, b) => (a.order || 0) - (b.order || 0),
  );

  const firstStimulus = sortedStimuli[0]?.text || "Add stimuli";

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
        <ImplicitAssociationTestBlockPreview centerStimulus={firstStimulus} />

        <IATStimulusManager qID={qID} display={display} />

        <ImplicitAssociationTestBuilderNote />
      </Box>
    </Box>
  );
};
