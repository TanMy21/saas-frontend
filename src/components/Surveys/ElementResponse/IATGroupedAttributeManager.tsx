import { Box } from "@mui/material";

import { useGetOptionsOfQuestionQuery } from "../../../app/slices/optionApiSlice";
import { RootState } from "../../../app/store";
import { useAppSelector } from "../../../app/typedReduxHooks";
import { IATStimulusManagerProps } from "../../../types/surveyBuilderTypes";
import { getIATUiConfig, isIATOptionInGroup } from "../../../utils/iatUtils";
import { OptionType } from "../../../utils/types";

import { IATAttributeGroupPanel } from "./IATAttributeGroupPanel";

export const IATGroupedAttributeManager = ({
  qID,
  display,
}: IATStimulusManagerProps) => {
  const isMobile = display === "mobile";

  const question = useAppSelector(
    (state: RootState) => state.question.selectedQuestion,
  );

  const uiConfig = getIATUiConfig(question?.questionPreferences?.uiConfig);

  const { data: options = [] as OptionType[] } = useGetOptionsOfQuestionQuery(
    qID!,
    {
      skip: !qID,
    },
  );

  console.log("OPtions: ", options);


  const themeAOptions = [...options]
    .filter((option) => isIATOptionInGroup(option.settings, "THEME_A"))
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const themeBOptions = [...options]
    .filter((option) => isIATOptionInGroup(option.settings, "THEME_B"))
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <Box
      sx={{
        bgcolor: "#FFFFFF",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        gap: 2,
      }}
    >
      <IATAttributeGroupPanel
        qID={qID}
        group="THEME_A"
        title={uiConfig.iatThemeA.label}
        options={themeAOptions}
        allOptions={options}
      />

      <IATAttributeGroupPanel
        qID={qID}
        group="THEME_B"
        title={uiConfig.iatThemeB.label}
        options={themeBOptions}
        allOptions={options}
      />
    </Box>
  );
};
