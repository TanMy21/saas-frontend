import { useEffect, useRef, useState } from "react";

import UploadIcon from "@mui/icons-material/Upload";
import { Box, IconButton, Tooltip } from "@mui/material";
import { BsFillShareFill } from "react-icons/bs";
import { IoMdSettings } from "react-icons/io";
import { RiAiGenerate } from "react-icons/ri";
import { useParams } from "react-router-dom";

import {
  closePublishAlert,
  closeShareModal,
  openPublishAlert,
  openShareModal,
} from "../../app/slices/overlaySlice";
import { RootState } from "../../app/store";
import { useAppDispatch, useAppSelector } from "../../app/typedReduxHooks";
import { DockItemProps, SurveyIslandProps } from "../../utils/types";
import GenerateSurveyModal from "../Modals/GenerateSurveyModal";
import ImportQuestionsModal from "../Modals/ImportQuestionsModal";
import ShareSurveyModal from "../Modals/ShareSurveyModal";
import SurveySettingsModal from "../Modals/SurveySettingsModal";
import SnackbarAlert from "../SnackbarAlert";

const DOCK_HEIGHT = 36;
const DEFAULT_ICON_SIZE = 24;
const DEFAULT_BUTTON_SIZE = 24;
const HOVER_BUTTON_SIZE = 48;

const SEG_SIZE = 36;
const SEG_GAP = 4;
const SEG_PAD = 4;

type ViewValue = "mobile" | "desktop";

const ViewIconSegment = ({
  value = "desktop",
  onChange,
}: {
  value?: ViewValue;
  onChange: (v: ViewValue) => void;
}) => {
  const [v, setV] = useState<ViewValue>(value);
  const setVal = (nv: ViewValue) => {
    setV(nv);
    onChange(nv);
  };

  // shared button styles
  const baseBtnSx = (active: boolean) => ({
    position: "relative",
    zIndex: 1,
    width: SEG_SIZE,
    height: SEG_SIZE,
    p: 0,
    borderRadius: "50%",
    color: active ? "#111827" : "#6B7280",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1,
    transition: "color 180ms ease-in-out",
  });

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        gap: `${SEG_GAP}px`,
        p: `${SEG_PAD}px`,
        height: SEG_SIZE + SEG_PAD * 2,
        borderRadius: 9999,
        backgroundColor: "#F3F4F6",
      }}
    >
      {/* sliding thumb */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          left: v === "mobile" ? SEG_PAD : SEG_PAD + SEG_SIZE + SEG_GAP,
          width: SEG_SIZE,
          height: SEG_SIZE,
          borderRadius: "50%",
          backgroundColor: "#fff",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          transition: "left 180ms ease",
          boxSizing: "border-box",
          pointerEvents: "none",
        }}
      />

      {/* Mobile */}
      <IconButton
        aria-label="Mobile view"
        onClick={() => setVal("mobile")}
        sx={baseBtnSx(v === "mobile")}
      >
        <Tooltip
          title={"Mobile view"}
          arrow={false}
          enterDelay={200}
          leaveDelay={100}
          PopperProps={{
            modifiers: [{ name: "offset", options: { offset: [0, -12] } }],
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              ></path>
            </svg>
          </Box>
        </Tooltip>
      </IconButton>

      {/* Desktop */}
      <IconButton
        aria-label="Desktop view"
        onClick={() => setVal("desktop")}
        sx={baseBtnSx(v === "desktop")}
      >
        <Tooltip
          title={"Desktop view"}
          arrow={false}
          enterDelay={200}
          leaveDelay={100}
          PopperProps={{
            modifiers: [{ name: "offset", options: { offset: [0, -12] } }],
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              ></path>
            </svg>
          </Box>
        </Tooltip>
      </IconButton>
    </Box>
  );
};

const SurveyBuilderDock = ({
  setDisplay,
  shareID,
  published,
}: SurveyIslandProps) => {
  const dispatch = useAppDispatch();
  const { surveyID } = useParams();
  const prevPublishedRef = useRef<boolean | null>(null);

  const openGenerateState = useAppSelector(
    (state: RootState) => state.surveyBuilder.isGenerateModalOpen
  );

  const shareOpen = useAppSelector(
    (state: RootState) => state.overlayUI.shareModalOpen
  );

  const setShareOpen: React.Dispatch<React.SetStateAction<boolean>> = (val) => {
    const next = typeof val === "function" ? val(shareOpen!) : val;
    if (next) dispatch(openShareModal());
    else dispatch(closeShareModal());
  };

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [openGenerate, setOpenGenerate] = useState(openGenerateState);
  const [openSettings, setOpenSettings] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [_shareBtnSelected, setShareBtnSelected] = useState(false);

  const items = [
    {
      id: "share",
      icon: <BsFillShareFill />,
      label: "Share survey",
      action: () => {
        if (!published) {
          setOpenSnackbar(false);
          dispatch(closeShareModal());
          dispatch(openPublishAlert());
        } else {
          dispatch(closePublishAlert());
          dispatch(openShareModal());
        }
      },
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

  useEffect(() => {
    const prev = prevPublishedRef.current;
    if (prev === false && published === true) {
      setOpenSnackbar(false);
      dispatch(closePublishAlert());
      dispatch(openShareModal());
    }
    prevPublishedRef.current = published ?? null;
  }, [published, dispatch]);

  return (
    <>
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
          "@media (prefers-reduced-motion: reduce)": {
            "& *": { transition: "none !important" },
          },
        }}
      >
        <ViewIconSegment onChange={(val) => setDisplay(val)} />

        <Box
          sx={{
            width: 1,
            height: 28,
            mx: 0.5,
            borderRight: "1px solid #E5E7EB",
          }}
        />

        {items.map(({ id, icon, label, action }) => (
          <DockItem
            key={id}
            action={action}
            icon={icon}
            label={label}
            isHovered={hovered === id}
            setHovered={setHovered}
            id={id}
            withDividerLeft={id === "import"}
          />
        ))}

        <ShareSurveyModal
          open={shareOpen!}
          setOpen={setShareOpen}
          setShareBtnSelected={setShareBtnSelected}
          openSnackbar={openSnackbar}
          setOpenSnackbar={setOpenSnackbar}
          shareID={shareID}
        />
        {/* <SurveyTitleEditModal openEdit={openEdit} setOpenEdit={setOpenEdit} /> */}
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
      </Box>
      <SnackbarAlert
        openSnackbar={openSnackbar}
        handleCloseSnackbar={() => setOpenSnackbar(false)}
      />
    </>
  );
};

const DockItem = ({
  action,
  icon,
  label,
  isHovered,
  setHovered,
  id,
  withDividerLeft = false,
}: DockItemProps) => {
  const size = isHovered ? HOVER_BUTTON_SIZE : DEFAULT_BUTTON_SIZE;

  return (
    <Tooltip
      title={label}
      arrow={false}
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
          position: "relative",
          width: size,
          height: size,
          borderRadius: 2,
          transition:
            "transform 140ms ease, background-color 140ms ease, width 200ms ease, height 200ms ease",
          backgroundColor: "transparent",
          mx: 1.5,
          pl: withDividerLeft ? 1.5 : 0,
          ...(withDividerLeft && {
            "&::before": {
              content: '""',
              position: "absolute",
              left: -8,
              top: "50%",
              transform: "translateY(-50%)",
              width: "1px",
              height: 28,
              backgroundColor: "#E5E7EB",
            },
          }),
          "&:hover": {
            backgroundColor: "rgba(0,0,0,0.04)",
            transform: "translateY(-1px)",
          },
          "&:focus-visible": {
            outline: "3px solid rgba(59,130,246,0.45)",
            outlineOffset: 2,
          },
          "&:active": { transform: "translateY(0px) scale(0.98)" },
          "@media (prefers-reduced-motion: reduce)": {
            transition: "none",
            "&:hover, &:active": { transform: "none" },
          },
        }}
      >
        <Box sx={{ fontSize: DEFAULT_ICON_SIZE, lineHeight: 0 }}>{icon}</Box>
      </IconButton>
    </Tooltip>
  );
};

export default SurveyBuilderDock;
