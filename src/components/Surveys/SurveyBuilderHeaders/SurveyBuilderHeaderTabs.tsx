import AssessmentIcon from "@mui/icons-material/Assessment";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { Tab, Tabs } from "@mui/material";
import { PiFlowArrowBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

import { useElectricTheme } from "../../../theme/useElectricTheme";
import { SurveyBuilderHeaderTabsProps } from "../../../utils/types";

const SurveyBuilderHeaderTabs = ({
  tabValue,
  setTabValue,
  surveyID,
  survey,
  workspaceId,
  workspaceName,
}: SurveyBuilderHeaderTabsProps) => {
  const navigate = useNavigate();
  const { tabStyles } = useElectricTheme();
  const headerProps = {
    tabValue,
    survey,
    workspaceId,
    workspaceName,
  };

  const handleScreenChange = (
    _event: React.SyntheticEvent,
    newValue: string
  ) => {
    setTabValue(newValue);

    if (newValue === "results") {
      navigate(`/s/results/${surveyID}`, { state: { headerProps } });
    } else if (newValue === "flow") {
      navigate(`/s/flow/${surveyID}`, { state: { headerProps } });
    } else if (newValue === "create") {
      navigate(`/survey/${surveyID}`, { state: { headerProps } });
    }
  };

  return (
    <Tabs
      value={tabValue}
      centered
      onChange={handleScreenChange}
      sx={{
        ...tabStyles.base,
        "& .MuiTabs-indicator": {
          height: "3px",
          backgroundColor: tabStyles.indicatorColorMap[tabValue],
        },
      }}
    >
      <Tab
        icon={<BorderColorIcon sx={{ fontSize: "24px" }} />}
        label="Create"
        value="create"
        sx={tabStyles.createTab}
      />
      <Tab
        icon={<PiFlowArrowBold size={24} />}
        label="Flow"
        value="flow"
        sx={tabStyles.flowTab}
      />
      <Tab
        icon={<AssessmentIcon sx={{ fontSize: "24px" }} />}
        label="Results"
        value="results"
        sx={tabStyles.resultsTab}
      />
    </Tabs>
  );
};

export default SurveyBuilderHeaderTabs;
