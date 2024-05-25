import { Box, Divider, IconButton } from "@mui/material";
import { BsFillShareFill } from "react-icons/bs";
import { CiMobile3 } from "react-icons/ci";
import { IoDesktop } from "react-icons/io5";
import ShareSurveyModal from "../Modals/ShareSurveyModal";
import { IoMdSettings } from "react-icons/io";
import SurveySettingsModal from "../Modals/SurveySettingsModal";
import { useState } from "react";
import { SurveyIslandProps } from "../../utils/types";
import SnackbarAlert from "../SnackbarAlert";

const SurveyBuilderIsland = ({ setDisplay }: SurveyIslandProps) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openShare, setOpenShare] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [mobileBtnSelected, setMobileBtnSelected] = useState(false);
  const [desktopBtnSelected, setDesktopBtnSelected] = useState(false);
  const [shareBtnSelected, setShareBtnSelected] = useState(false);
  const [settingsBtnSelected, setSettingsBtnSelected] = useState(false);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleLayoutChange = (layout: string) => {
    setMobileBtnSelected(!mobileBtnSelected);
    setDesktopBtnSelected(false);
    setShareBtnSelected(false);
    setSettingsBtnSelected(false);
    setDisplay(layout);
  };

  const handleLayoutChangeDesktop = (layout: string) => {
    setDesktopBtnSelected(!desktopBtnSelected);
    setMobileBtnSelected(false);
    setShareBtnSelected(false);
    setSettingsBtnSelected(false);
    setDisplay(layout);
  };

  const handleShareModal = () => {
    setShareBtnSelected(!shareBtnSelected);
    setDesktopBtnSelected(false);
    setMobileBtnSelected(false);
    setSettingsBtnSelected(false);
    setOpenShare(true);
  };
  const handleOpenSettings = () => {
    setSettingsBtnSelected(!settingsBtnSelected);
    setDesktopBtnSelected(false);
    setMobileBtnSelected(false);
    setShareBtnSelected(false);
    setOpenSettings(true);
  };

  return (
    <>
      <Box
        sx={{
          margin: "auto",
          marginTop: "2%",
          width: { md: "68%", lg: "68%", xl: "48%" },
          height: "40px",
          // border: "2px solid black",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            margin: "auto",
            width: "36%",
            height: "100%",
            backgroundColor: "#FFFFFF",
            borderRadius: "8px",
            boxShadow: "32px, 32px, 52px, #818080, -32px, -32px, 52px, #ffffff",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: "12px",
              margin: "auto",
              width: "80%",
              height: "100%",
              // border: "2px solid red",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "12px",
                width: "48%",
                height: "92%",
                // border: "2px solid black",
              }}
            >
              <Box
                sx={{
                  width: "40%",
                  height: "100%",
                  // border: "2px solid black",
                }}
              >
                <IconButton
                  onClick={() => handleLayoutChange("mobile")}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: mobileBtnSelected ? "12%" : "2%",
                    backgroundColor: mobileBtnSelected ? "#E2E2E2" : "none",
                    height: mobileBtnSelected ? "32px" : "none",
                    margin: mobileBtnSelected ? "4px 4px 0px 0px" : "none",
                    "&:hover": {
                      backgroundColor: "#F0F0F0",
                      borderRadius: "12%",
                      height: "32px",
                      margin: "4px 4px 0px 0px",
                    },
                    transition: "all 0.3s",
                  }}
                >
                  <CiMobile3 />
                </IconButton>
              </Box>
              <Box
                sx={{
                  width: "40%",
                  height: "100%",
                  // border: "2px solid black",
                }}
              >
                <IconButton
                  onClick={() => handleLayoutChangeDesktop("desktop")}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: desktopBtnSelected ? "12%" : "2%",
                    backgroundColor: desktopBtnSelected ? "#E2E2E2" : "none",
                    height: desktopBtnSelected ? "32px" : "none",
                    margin: desktopBtnSelected ? "4px 4px 0px 0px" : "none",
                    "&:hover": {
                      backgroundColor: "#F0F0F0",
                      borderRadius: "12%",
                      height: "32px",
                      margin: "4px 4px 0px 0px",
                    },
                    transition: "all 0.3s",
                  }}
                >
                  <IoDesktop />
                </IconButton>
              </Box>
            </Box>

            {/* <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: "16%",
                height: "100%",
                // border: "2px solid black",
              }}
            > */}
            <Divider
              orientation="vertical"
              sx={{
                marginTop: "4%",
                marginBottom: "4%",
                height: "64%",
                backgroundColor: "#ADADAD",
              }}
            />
            {/* </Box> */}

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "12px",
                width: "48%",
                height: "92%",
                // border: "2px solid black",
              }}
            >
              <Box
                sx={{
                  width: "40%",
                  height: "100%",
                  // border: "2px solid black",
                }}
              >
                <IconButton
                  onClick={handleShareModal}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: shareBtnSelected ? "12%" : "2%",
                    backgroundColor: shareBtnSelected ? "#E2E2E2" : "none",
                    height: shareBtnSelected ? "32px" : "none",
                    margin: shareBtnSelected ? "4px 4px 0px 0px" : "none",
                    "&:hover": {
                      backgroundColor: "#F0F0F0",
                      borderRadius: "12%",
                      height: "32px",
                      margin: "4px 4px 0px 0px",
                    },
                    transition: "all 0.3s",
                  }}
                >
                  <BsFillShareFill />
                </IconButton>
                <ShareSurveyModal
                  open={openShare}
                  setOpen={setOpenShare}
                  setShareBtnSelected={setShareBtnSelected}
                  openSnackbar={openSnackbar}
                  setOpenSnackbar={setOpenSnackbar}
                />
                <SnackbarAlert
                  openSnackbar={openSnackbar}
                  handleCloseSnackbar={handleCloseSnackbar}
                />
              </Box>
              <Box
                sx={{
                  width: "40%",
                  height: "100%",
                  // border: "2px solid black",
                }}
              >
                <IconButton
                  onClick={handleOpenSettings}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: settingsBtnSelected ? "12%" : "2%",
                    backgroundColor: settingsBtnSelected ? "#E2E2E2" : "none",
                    height: settingsBtnSelected ? "32px" : "none",
                    margin: settingsBtnSelected ? "4px 4px 0px 0px" : "none",
                    "&:hover": {
                      backgroundColor: "#F0F0F0",
                      borderRadius: "12%",
                      height: "32px",
                      margin: "4px 4px 0px 0px",
                    },
                    transition: "all 0.3s",
                  }}
                >
                  <IoMdSettings />
                </IconButton>
                <SurveySettingsModal
                  openSettings={openSettings}
                  setOpenSettings={setOpenSettings}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default SurveyBuilderIsland;
