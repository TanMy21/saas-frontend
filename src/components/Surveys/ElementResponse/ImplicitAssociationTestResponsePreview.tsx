import { Box } from "@mui/material";

import { useGetOptionsOfQuestionQuery } from "../../../app/slices/optionApiSlice";
import { isIATOptionInGroup } from "../../../utils/iatUtils";
import { ElementProps, OptionType } from "../../../utils/types";

import { IATCombinedBlockPreview } from "./IATCombinedBlockPreview";
import { IATGroupedAttributeManager } from "./IATGroupedAttributeManager";
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

  const sortedThemeAAttributes = [...options]
    .filter((option) => isIATOptionInGroup(option.settings, "THEME_A"))
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const sortedThemeBAttributes = [...options]
    .filter((option) => isIATOptionInGroup(option.settings, "THEME_B"))
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const firstStimulus =
    sortedThemeAAttributes[0]?.text ||
    sortedThemeBAttributes[0]?.text ||
    "Add attributes";

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
        <IATCombinedBlockPreview centerStimulus={firstStimulus} />

        <IATGroupedAttributeManager qID={qID} display={display} />

        <ImplicitAssociationTestBuilderNote />
      </Box>
    </Box>
  );
};
