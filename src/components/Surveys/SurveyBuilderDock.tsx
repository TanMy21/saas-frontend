import { useState } from "react";

import UploadIcon from "@mui/icons-material/Upload";
import { Box, IconButton, Tab, Tabs, Tooltip } from "@mui/material";
import { BsFillShareFill } from "react-icons/bs";
import { CiMobile3 } from "react-icons/ci";
import { IoMdSettings } from "react-icons/io";
import { IoDesktop } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { RiAiGenerate } from "react-icons/ri";
import { useParams } from "react-router-dom";

import { useAppSelector } from "../../app/typedReduxHooks";
import { DockItemProps, SurveyIslandProps } from "../../utils/types";
import PublishSurveyAlert from "../alert/PublishSurveyAlert";
import GenerateSurveyModal from "../Modals/GenerateSurveyModal";
import ImportQuestionsModal from "../Modals/ImportQuestionsModal";
import ShareSurveyModal from "../Modals/ShareSurveyModal";
import SurveySettingsModal from "../Modals/SurveySettingsModal";
import SurveyTitleEditModal from "../Modals/SurveyTitleEditModal";
import SnackbarAlert from "../SnackbarAlert";

const DOCK_HEIGHT = 36;
const DEFAULT_ICON_SIZE = 36;
const DEFAULT_BUTTON_SIZE = 44;
const HOVER_ICON_SIZE = 64;
const HOVER_BUTTON_SIZE = 52;

type ViewValue = "mobile" | "desktop";

const ViewIconSegment = ({
  value = "desktop",
  onChange,
}: {
  value?: "mobile" | "desktop";
  onChange: (v: "mobile" | "desktop") => void;
}) => {
  const [v, setV] = useState<"mobile" | "desktop">(value);

  const setVal = (nv: "mobile" | "desktop") => {
    setV(nv);
    onChange(nv);
  };

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        p: 0.5,
        height: 36,
        borderRadius: 999,
        backgroundColor: "#F3F4F6",
      }}
    >
      {/* sliding thumb */}
      <Box
        sx={{
          position: "absolute",
          top: 3,
          left: v === "mobile" ? 3 : 3 + 36 + 4, // 3px inset + 36px btn + 4px gap
          width: 36,
          height: 30,
          borderRadius: 999,
          backgroundColor: "#fff",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          transition: "left 180ms ease",
        }}
      />
      <IconButton
        aria-label="Mobile view"
        onClick={() => setVal("mobile")}
        sx={{
          position: "relative",
          zIndex: 1,
          width: 36,
          height: 30,
          borderRadius: 999,
          color: v === "mobile" ? "#111827" : "#6B7280",
        }}
      >
        <CiMobile3 size={18} />
      </IconButton>
      <IconButton
        aria-label="Desktop view"
        onClick={() => setVal("desktop")}
        sx={{
          position: "relative",
          zIndex: 1,
          width: 36,
          height: 30,
          borderRadius: 999,
          color: v === "desktop" ? "#111827" : "#6B7280",
        }}
      >
        <IoDesktop size={18} />
      </IconButton>
    </Box>
  );
};

const SurveyBuilderDock = ({
  setDisplay,
  shareID,
  published,
}: SurveyIslandProps) => {
  const { surveyID } = useParams();
  const openGenerateState = useAppSelector(
    (state) => state.surveyBuilder.isGenerateModalOpen
  );
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [openShare, setOpenShare] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [openGenerate, setOpenGenerate] = useState(openGenerateState);
  const [openEdit, setOpenEdit] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [shareBtnSelected, setShareBtnSelected] = useState(false);

  const items = [
    // removed "mobile" & "desktop" from this array; handled by ViewTogglePill
    {
      id: "share",
      icon: <BsFillShareFill />,
      label: "Share survey",
      action: () => {
        if (!published) setOpenAlert(true);
        else setOpenShare(true);
      },
    },
    {
      id: "edit-sruvey",
      icon: <MdEdit />,
      label: "Edit survey title",
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
        mx: "auto",
        mt: { md: "5%", xl: "2%" },
        backgroundColor: "rgba(255,255,255,0.8)",
        borderRadius: 5,
        border: "1px solid rgba(0,0,0,0.06)",
        // Subtle glass & shadow
        backdropFilter: "saturate(160%) blur(8px)",
        WebkitBackdropFilter: "saturate(160%) blur(8px)",
        boxShadow:
          "0 6px 24px rgba(16,24,40,0.06), 0 2px 8px rgba(16,24,40,0.04)",
        px: 1.5,
        py: 0.75,
        display: "flex",
        alignItems: "center",
        gap: 1,
        width: "fit-content",
        minHeight: DOCK_HEIGHT,
        zIndex: 20,

        // Reduce motion
        "@media (prefers-reduced-motion: reduce)": {
          "& *": { transition: "none !important" },
        },
      }}
    >
      {/* ⬇️ NEW: Pill toggle for just the view */}
      <ViewIconSegment onChange={(val) => setDisplay(val)} />

      {/* ⬇️ A soft divider before the rest of the icons */}
      <Box
        sx={{
          width: 1,
          height: 28,
          mx: 0.5,
          borderRight: "1px solid #E5E7EB",
        }}
      />

      {/* Existing actions (unchanged behavior) */}
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

      {/* Modals & alerts (unchanged) */}
      <ShareSurveyModal
        open={openShare}
        setOpen={setOpenShare}
        setShareBtnSelected={setShareBtnSelected}
        openSnackbar={openSnackbar}
        setOpenSnackbar={setOpenSnackbar}
        shareID={shareID}
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
      <PublishSurveyAlert open={openAlert} setOpen={setOpenAlert} />
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
  const size = isHovered ? HOVER_BUTTON_SIZE : DEFAULT_BUTTON_SIZE;

  return (
    <Tooltip
      title={label}
      arrow
      enterDelay={200}
      leaveDelay={100}
      PopperProps={{
        modifiers: [{ name: "offset", options: { offset: [0, -12] } }],
      }}
    >
      <IconButton
        onClick={action}
        onMouseEnter={() => setHovered(id)}
        onMouseLeave={() => setHovered(null)}
        aria-label={label}
        sx={{
          width: size,
          height: size,
          borderRadius: 2,
          transition:
            "transform 140ms ease, background-color 140ms ease, width 200ms ease, height 200ms ease",
          backgroundColor: "transparent",
          // Hover “lift”
          "&:hover": {
            backgroundColor: "rgba(0,0,0,0.04)",
            transform: "translateY(-1px)",
          },
          // Focus ring for a11y
          "&:focus-visible": {
            outline: "3px solid rgba(59,130,246,0.45)", // blue-ish
            outlineOffset: 2,
          },
          // Active press
          "&:active": {
            transform: "translateY(0px) scale(0.98)",
          },
          "@media (prefers-reduced-motion: reduce)": {
            transition: "none",
            "&:hover, &:active": { transform: "none" },
          },
        }}
      >
        {/* Keep icon glyph size consistent */}
        <Box sx={{ fontSize: DEFAULT_ICON_SIZE, lineHeight: 0 }}>{icon}</Box>
      </IconButton>
    </Tooltip>
  );
};

export default SurveyBuilderDock;
