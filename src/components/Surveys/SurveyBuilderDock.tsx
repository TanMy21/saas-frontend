import { useState } from "react";

import UploadIcon from "@mui/icons-material/Upload";
import { Box, IconButton, Tooltip } from "@mui/material";
import { BsFillShareFill } from "react-icons/bs";
import { CiMobile3 } from "react-icons/ci";
import { IoMdSettings } from "react-icons/io";
import { IoDesktop } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { RiAiGenerate } from "react-icons/ri";
import { useParams } from "react-router-dom";

import { DockItemProps, SurveyIslandProps } from "../../utils/types";
import GenerateSurveyModal from "../Modals/GenerateSurveyModal";
import ImportQuestionsModal from "../Modals/ImportQuestionsModal";
import ShareSurveyModal from "../Modals/ShareSurveyModal";
import SurveySettingsModal from "../Modals/SurveySettingsModal";
import SurveyTitleEditModal from "../Modals/SurveyTitleEditModal";
import SnackbarAlert from "../SnackbarAlert";

const DOCK_HEIGHT = 36;
const DEFAULT_ICON_SIZE = 36;
const HOVER_ICON_SIZE = 64;

const SurveyBuilderDock = ({ setDisplay }: SurveyIslandProps) => {
  const { surveyID } = useParams();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openShare, setOpenShare] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [openGenerate, setOpenGenerate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [shareBtnSelected, setShareBtnSelected] = useState(false);

  const items = [
    {
      id: "mobile",
      icon: <CiMobile3 />,
      label: "Mobile view",
      action: () => setDisplay("mobile"),
    },
    {
      id: "desktop",
      icon: <IoDesktop />,
      label: "Desktop view",
      action: () => setDisplay("desktop"),
    },
    {
      id: "share",
      icon: <BsFillShareFill />,
      label: "Share survey",
      action: () => setOpenShare(true),
    },
    {
      id: "edit-sruvey",
      icon: <MdEdit />,
      label: "Edit survey",
      action: () => setOpenEdit(true),
    },
    {
      id: "settings",
      icon: <IoMdSettings />,
      label: "Settings",
      action: () => setOpenSettings(true),
    },
    {
      id: "import",
      icon: <UploadIcon />,
      label: "Import questions",
      action: () => setOpenImport(true),
    },
    {
      id: "generate",
      icon: <RiAiGenerate />,
      label: "Generate questions",
      action: () => setOpenGenerate(true),
    },
  ];

  return (
    <Box
      sx={{
        position: "sticky",
        left: 0,
        right: 0,
        margin: "auto",
        marginTop: { md: "5%", xl: "2%" },
        marginBottom: "0%",
        backgroundColor: "#FFF",
        borderRadius: 5,
        border: "2px solid #E0E0E0",
        padding: "8px 16px",
        boxShadow: 0.2,
        display: "flex",
        gap: 2,
        width: "fit-content",
        height: DOCK_HEIGHT,
        alignItems: "flex-end",
        zIndex: 20,
      }}
    >
      {items.map(({ id, icon, label, action }) => (
        <DockItem
          key={id}
          action={action}
          icon={icon}
          label={label}
          isHovered={hovered === id}
          setHovered={setHovered}
          id={id}
        />
      ))}

      <ShareSurveyModal
        open={openShare}
        setOpen={setOpenShare}
        setShareBtnSelected={setShareBtnSelected}
        openSnackbar={openSnackbar}
        setOpenSnackbar={setOpenSnackbar}
      />

      <SurveyTitleEditModal openEdit={openEdit} setOpenEdit={setOpenEdit} />

      <SurveySettingsModal
        surveyID={surveyID!}
        openSettings={openSettings}
        setOpenSettings={setOpenSettings}
      />

      <ImportQuestionsModal
        openImport={openImport}
        setOpenImport={setOpenImport}
      />

      <GenerateSurveyModal
        openGenerate={openGenerate}
        setOpenGenerate={setOpenGenerate}
      />

      <SnackbarAlert
        openSnackbar={openSnackbar}
        handleCloseSnackbar={() => setOpenSnackbar(false)}
      />
    </Box>
  );
};

const DockItem = ({
  action,
  icon,
  label,
  isHovered,
  setHovered,
  id,
}: DockItemProps) => {
  return (
    <Tooltip
      title={label}
      arrow
      enterDelay={200}
      leaveDelay={100}
      PopperProps={{
        modifiers: [{ name: "offset", options: { offset: [0, -10] } }],
      }}
    >
      <IconButton
        onClick={action}
        onMouseEnter={() => setHovered(id)}
        onMouseLeave={() => setHovered(null)}
        sx={{
          fontSize: isHovered ? HOVER_ICON_SIZE : DEFAULT_ICON_SIZE,
          width: isHovered ? HOVER_ICON_SIZE : DEFAULT_ICON_SIZE,
          height: isHovered ? HOVER_ICON_SIZE : DEFAULT_ICON_SIZE,
          transition: "width 0.2s ease-in-out, height 0.2s ease-in-out",
        }}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
};

export default SurveyBuilderDock;
