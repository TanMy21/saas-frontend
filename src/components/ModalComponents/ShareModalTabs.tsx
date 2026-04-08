import { Tab, Tabs } from "@mui/material";
import { CodeIcon, LinkIcon, MailIcon } from "lucide-react";

import { TabType } from "../../types/surveyBuilderTypes";

const ShareModalTabs = ({
  tab,
  setTab,
}: {
  tab: TabType;
  setTab: (val: TabType) => void;
}) => {
  return (
    <Tabs
      value={tab}
      onChange={(_, val: TabType) => setTab(val)}
      sx={{
        px: 2,
        minHeight: 40,
        borderBottom: "1px solid #eee",
        "& .MuiTabs-flexContainer": { gap: 2.5 },
        "& .MuiTabs-indicator": { height: 2, bottom: 1 },
      }}
    >
      <Tab
        label="Link"
        value="link"
        icon={<LinkIcon size={20} />}
        iconPosition="start"
        sx={{
          minHeight: 40,
          py: 1.5,
          alignItems: "flex-end",
          "& .MuiTab-iconWrapper": {
            marginBottom: 0,
            marginRight: 1.5,
          },
        }}
      />
      <Tab
        label="Email"
        value="email"
        icon={<MailIcon size={20} />}
        iconPosition="start"
        sx={{
          minHeight: 40,
          py: 1.5,
          alignItems: "flex-end",
          "& .MuiTab-iconWrapper": {
            marginBottom: 0,
            marginRight: 1.5,
          },
        }}
      />
      <Tab
        label="Embed"
        value="embed"
        icon={<CodeIcon size={20} />}
        iconPosition="start"
        sx={{
          minHeight: 40,
          py: 1.5,
          alignItems: "flex-end",
          "& .MuiTab-iconWrapper": {
            marginBottom: 0,
            marginRight: 1.5,
          },
        }}
      />
    </Tabs>
  );
};

export default ShareModalTabs;
