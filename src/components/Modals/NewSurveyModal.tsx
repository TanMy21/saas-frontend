import { useEffect, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import { ArrowRight, Edit3, Sparkles, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useCreateSurveyMutation } from "../../app/slices/surveysApiSlice";
// import { useAppTheme } from "../../theme/useAppTheme";
import { ErrorData, NewSurveyModalProps } from "../../utils/types";

const NewSurveyModal = ({
  open,
  onClose,
  workspaceId,
  workspaceName,
}: NewSurveyModalProps) => {
  // const { background } = useAppTheme();
  const navigate = useNavigate();
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const openModal = true;
  const openModalImport = true;
  const openModalGenerate = true;

  const [createSurvey, { isError, error }] = useCreateSurveyMutation();

  const handleCreateFromScratch = async () => {
    try {
      const surveyCreated = await createSurvey({
        workspaceId,
      }).unwrap();

      if (surveyCreated) {
        navigate(`/survey/${surveyCreated.surveyID}`, {
          state: { workspaceId, workspaceName, openModal },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleImportQuestions = async () => {
    try {
      const surveyCreated = await createSurvey({
        workspaceId,
      }).unwrap();

      if (surveyCreated) {
        navigate(`/survey/${surveyCreated.surveyID}`, {
          state: { workspaceId, workspaceName, openModalImport },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleGenerateQuestions = async () => {
    try {
      const surveyCreated = await createSurvey({
        workspaceId,
      }).unwrap();

      if (surveyCreated) {
        navigate(`/survey/${surveyCreated.surveyID}`, {
          state: { workspaceId, workspaceName, openModalGenerate },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createSurveyOptions = [
    {
      id: "scratch",
      icon: Edit3,
      title: "Create from scratch",
      description:
        "Start with a blank canvas and build your survey from the ground up",
      gradient: "linear-gradient(90deg,#3b82f6,#2563eb)",
      bgColor: "#eff6ff",
      iconColor: "#2563eb",
      onClick: handleCreateFromScratch,
    },
    {
      id: "upload",
      icon: Upload,
      title: "Upload questions",
      description: "Import your existing questions from a file or document",
      gradient: "linear-gradient(90deg,#10b981,#059669)",
      bgColor: "#ecfdf5",
      iconColor: "#059669",
      onClick: handleImportQuestions,
    },
    {
      id: "generate",
      icon: Sparkles,
      title: "AI-powered generation",
      description:
        "Let AI create intelligent questions based on your survey topic",
      gradient: "linear-gradient(90deg,#a21caf,#7c3aed)",
      bgColor: "#f5f3ff",
      iconColor: "#7c3aed",
      onClick: handleGenerateQuestions,
    },
  ];

  useEffect(() => {
    if (isError) {
      const errorData = error as ErrorData;
      if (Array.isArray(errorData.data.error)) {
        errorData.data.error.forEach((el) =>
          toast.error(el.message, {
            position: "top-right",
          })
        );
      } else {
        toast.error(errorData.data.message, {
          position: "top-right",
        });
      }
    }
  }, [isError, error]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ zIndex: 1400 }}
      slotProps={{
        backdrop: {
          style: {
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(6px)",
          },
        },
      }}
    >
      <Box
        sx={{
          outline: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            bgcolor: "#fff",
            borderRadius: 4,
            boxShadow: 12,
            width: "100%",
            maxWidth: 640,
            p: 0,
            overflow: "hidden",
            m: 2,
            outline: "none",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 3,
              pt: 3,
              pb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  p: 1,
                  backgroundColor: "#EFF6FF",
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width:40,
                  height:40,
                }}
              >
                <FiberNewIcon
                  style={{ width: 28, height: 28, color: "#2563EB" }}
                />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "grey.900" }}
                >
                  Create a new survey
                </Typography>
                <Typography variant="body2" sx={{ color: "grey.500", mt: 0.5 }}>
                  Choose how you'd like to start building your survey
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={onClose}
              sx={{
                p: 1,
                color: "grey.400",
                transition: "all 0.2s",
                "&:hover": {
                  color: "grey.600",
                  bgcolor: "grey.100",
                },
                borderRadius: 2,
              }}
            >
              <CloseIcon style={{ width: 28, height: 28 }} />
            </IconButton>
          </Box>
          {/* <Box sx={{ position: "relative", p: 4, pb: 2 }}>
            <IconButton
              onClick={onClose}
              sx={{
                position: "absolute",
                right: 16,
                top: 16,
                p: 1.2,
                borderRadius: "50%",
                "&:hover": { bgcolor: "#f3f4f6" },
              }}
            >
              <CloseIcon style={{ width: 24, height: 24, color: "#6b7280" }} />
            </IconButton>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h5"
                fontWeight={700}
                color="#111827"
                mb={0.5}
              >
                Create a new survey
              </Typography>
              <Typography sx={{ color: "#6b7280", fontSize: 15 }}>
                Choose how you'd like to start building your survey
              </Typography>
            </Box>
          </Box> */}

          {/* Options */}
          <Box sx={{ px: 4, pb: 4, pt: 0 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {createSurveyOptions.map((option) => {
                const Icon = option.icon;
                const isHovered = hoveredOption === option.id;
                return (
                  <Box
                    key={option.id}
                    onMouseEnter={() => setHoveredOption(option.id)}
                    onMouseLeave={() => setHoveredOption(null)}
                    onClick={option.onClick}
                    sx={{
                      cursor: "pointer",
                      width: "100%",
                      p: 0,
                      border: "2px solid",
                      borderColor: isHovered ? "#d1d5db" : "#e5e7eb",
                      boxShadow: isHovered ? 8 : 1,
                      transform: isHovered ? "scale(1.02)" : "scale(1)",
                      background: isHovered ? option.gradient : "#fff",
                      color: isHovered ? "#fff" : "#111827",
                      borderRadius: 3,
                      transition:
                        "all 0.28s cubic-bezier(.4,0,.2,1), box-shadow 0.22s",
                      mb: 1,
                      "&:hover": {
                        background: option.gradient,
                        color: "#fff",
                        borderColor: "#d1d5db",
                        boxShadow: 8,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "start",
                        gap: 2,
                        px: 3,
                        py: 2.5,
                        width: "100%",
                        borderRadius: 3,
                      }}
                    >
                      <Box
                        sx={{
                          p: 1.2,
                          borderRadius: 2.5,
                          background: isHovered
                            ? "rgba(255,255,255,0.18)"
                            : option.bgColor,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minWidth: 40,
                          minHeight: 40,
                          transition: "background 0.3s",
                        }}
                      >
                        <Icon
                          style={{
                            width: 24,
                            height: 24,
                            color: isHovered ? "#fff" : option.iconColor,
                            transition: "color 0.2s",
                          }}
                        />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            fontWeight={600}
                            fontSize={18}
                            sx={{
                              color: isHovered ? "#fff" : "#111827",
                              transition: "color 0.2s",
                            }}
                          >
                            {option.title}
                          </Typography>
                          <ArrowRight
                            style={{
                              width: 20,
                              height: 20,
                              color: isHovered ? "#fff" : "#9ca3af",
                              marginLeft: 6,
                              opacity: isHovered ? 1 : 0,
                              transform: isHovered ? "translateX(4px)" : "none",
                              transition: "all 0.22s",
                            }}
                          />
                        </Box>
                        <Typography
                          fontSize={15}
                          mt={0.6}
                          sx={{
                            color: isHovered
                              ? "rgba(255,255,255,0.90)"
                              : "#6b7280",
                            transition: "color 0.2s",
                          }}
                        >
                          {option.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* Footer */}
          <Box sx={{ px: 4, pb: 4, pt: 0 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                pt: 2,
                borderTop: "1px solid #f3f4f6",
              }}
            >
              <Button
                onClick={onClose}
                sx={{
                  px: 2.2,
                  py: 1.1,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#4b5563",
                  borderRadius: 2,
                  bgcolor: "#fff",
                  "&:hover": { bgcolor: "#f3f4f6", color: "#1f2937" },
                  transition: "all 0.16s",
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default NewSurveyModal;
