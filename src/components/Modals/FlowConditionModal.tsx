import { useEffect, useMemo, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Modal,
  Tooltip,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

import {
  useCreateConditionMutation,
  useGetConditionsForQuestionQuery,
} from "../../app/slices/flowApiSlice";
import useAuth from "../../hooks/useAuth";
import { validateConditions } from "../../utils/conditionValidation";
import { elementIcons } from "../../utils/elementsConfig";
import { convertHtmlToPlainText } from "../../utils/richTextUtils";
import {
  Condition,
  FlowConditionModalProps,
  IconMapping,
} from "../../utils/types";
import FlowFormConditionBlock from "../ModalComponents/FlowFormConditionBlock";

export interface QuestionFlowCondition {
  conditions: Condition[];
}

const FlowConditionModal = ({
  openConditions,
  setOpenConditions,
  selectedNode,
  setSelectedNode,
  edgeFormData,
  conditions,
  setConditions,
  errors,
  setErrors,
  setEdges,
  setIsValidArray,
  Elements,
  refetch,
}: FlowConditionModalProps) => {
  const { can } = useAuth();
  const canCreateFlow = can("CREATE_FLOW");
  const canEditFlow = can("UPDATE_FLOW");
  const questionID = selectedNode?.data?.questionID as string;
  const { surveyID } = useParams();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors: formErrors },
    watch,
    setValue,
  } = useForm();

  const filteredElements = useMemo(
    () =>
      (Elements ?? []).filter(
        (element) =>
          element.type !== "WELCOME_SCREEN" &&
          element.type !== "EMAIL_CONTACT" &&
          element.type !== "INSTRUCTIONS",
      ),
    [Elements],
  );

  const {
    data: fetchConditions,
    isLoading,
    isFetching,
  } = useGetConditionsForQuestionQuery(questionID);

  const [createCondition, { isLoading: isCreatingCondition }] =
    useCreateConditionMutation();

  const handleClose = () => {
    setEdges((prevEdges) =>
      prevEdges.filter(
        (edge) =>
          edge.type !== "bypass-edge" || edge.data?.flowConditionID !== "",
      ),
    );

    setOpenConditions(false);
    setSelectedNode(null);
  };

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [touchedAccordions, setTouchedAccordions] = useState<
    Record<number, boolean>
  >({});

  const displayOrder = (order?: number) =>
    typeof order === "number" ? order + 1 : order;

  const addConditionBlock = () => {
    setConditions((prev) => [
      ...prev,
      {
        flowConditionID: "",
        relatedQuestionID: questionID,
        goto_questionID: "",
        conditionType: "",
        conditionValue: null,
      },
    ]);
  };

  const handleAccordionClick = (index: number) => {
    setTouchedAccordions((prev) => ({
      ...prev,
      [index]: true,
    }));
  };

  const submitConditionData = (data: any) => {
    if (!can("UPDATE_FLOW")) return;
    try {
      setHasSubmitted(true);

      let formattedData = (data.conditions ?? []).filter(
        (condition: any) => condition.goto_questionID,
      );

      formattedData = formattedData.map((condition: any) => {
        return {
          ...condition,
          flowConditionID: condition.flowConditionID ?? "",
          relatedQuestionID: questionID,
          surveyID,
        };
      });

      let newConditions = formattedData.filter(
        (condition: any) => condition.flowConditionID === "",
      );

      console.log("🔍 Final form data before submit:", data);
      console.log("🔍 Final formatted data before submit:", formattedData);

      const { isValidArray, globalIsValid, errorMap } =
        validateConditions(formattedData);

      if (!globalIsValid) {
        const resetTouched = { ...touchedAccordions };
        isValidArray.forEach((isValid, index) => {
          if (!isValid) resetTouched[index] = false;
        });
        setTouchedAccordions(resetTouched);

        setErrors(() => ({ ...errorMap, ...formErrors }));
        setIsValidArray(() => [...isValidArray]);

        return;
      }

      newConditions = newConditions.map(
        ({ flowConditionID, ...rest }: { flowConditionID: string }) => rest,
      );

      createCondition(formattedData);

      setErrors(() => ({}));
      setIsValidArray(() => []);
      refetch();
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  useEffect(() => {
    if (questionID && fetchConditions) {
      setConditions((prev) => {
        const hasUnsaved = prev.some((cond) => cond.flowConditionID === "");
        if (hasUnsaved) return prev;
        return fetchConditions;
      });

      reset({
        [questionID]: {},
      });
    }
  }, [questionID, reset, fetchConditions]);

  return (
    <Modal
      open={openConditions}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800,
          maxWidth: "95vw",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "24px",
          overflow: "hidden",
          bgcolor: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        {/* ---------------- HEADER ---------------- */}
        <Box
          sx={{
            px: 3,
            py: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.6)",
            bgcolor: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(10px)",
            position: "relative",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Chip
              sx={{
                bgcolor: "#eef2ff",
                color: "#4338ca",
                fontWeight: 700,
                fontSize: "32px",
                height: "36px",
                px: 1,
                borderRadius: "10px",
                "& .MuiChip-label": {
                  mt: 0.5,
                  ml: 0.5,
                  fontSize: "24px",
                },
              }}
              icon={
                elementIcons[
                  edgeFormData.sourceQuestionIcon ||
                    (selectedNode?.data?.element as keyof IconMapping)
                ]
              }
              label={
                edgeFormData.sourceQuestionOrder !== -1
                  ? displayOrder(edgeFormData.sourceQuestionOrder)
                  : displayOrder(Number(selectedNode?.data?.order))
              }
            />

            <Tooltip
              title={convertHtmlToPlainText(
                String(selectedNode?.data.question),
              )}
              placement="bottom-start"
              arrow
            >
              <Typography
                noWrap
                sx={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#0f172a",
                  lineHeight: 1.3,
                  maxWidth: "420px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  cursor: "default",
                }}
              >
                {convertHtmlToPlainText(String(selectedNode?.data.question))}
              </Typography>
            </Tooltip>
          </Box>

          <IconButton
            onClick={handleClose}
            sx={{
              color: "#94a3b8",
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.05)",
                color: "#475569",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* ---------------- SCROLL AREA ---------------- */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            px: 1.5,
            py: 2.5,
          }}
        >
          <form
            id="conditions-form"
            onSubmit={handleSubmit(submitConditionData)}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              {isLoading || isFetching ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                  <CircularProgress />
                </Box>
              ) : (
                (conditions ?? []).map((condition, index: number) => (
                  <FlowFormConditionBlock
                    key={index}
                    condition={condition}
                    blockIndex={index + 1}
                    selectedNode={selectedNode}
                    questionID={questionID}
                    edgeFormData={edgeFormData}
                    Elements={filteredElements}
                    register={register}
                    control={control}
                    watch={watch}
                    setValue={setValue}
                    setEdges={setEdges}
                    setConditions={setConditions}
                    errors={errors[index] || []}
                    formErrors={formErrors}
                    isValid={
                      !(
                        !touchedAccordions[index] &&
                        hasSubmitted &&
                        errors[index]?.length > 0
                      )
                    }
                    onAccordionClick={() => handleAccordionClick(index)}
                  />
                ))
              )}

              {/* ADD CONDITION */}
              {canCreateFlow && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={canEditFlow ? addConditionBlock : undefined}
                    disabled={!canEditFlow}
                    sx={{
                      width: "100%",
                      maxWidth: "600px",
                      borderRadius: "16px",
                      textTransform: "none",
                      fontWeight: 600,
                      py: 1.5,
                      border: "2px dashed #e2e8f0",
                      color: "#64748b",
                      bgcolor: "rgba(255,255,255,0.6)",
                      backdropFilter: "blur(6px)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor: "#6366f1",
                        color: "#6366f1",
                        bgcolor: "rgba(99,102,241,0.05)",
                      },
                    }}
                  >
                    <AddIcon sx={{ mr: 1 }} />
                    Add condition
                  </Button>
                </Box>
              )}
            </Box>
          </form>
        </Box>

        {/* ---------------- FOOTER ---------------- */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            px: 3,
            py: 1,
            minHeight: "60px",
            borderTop: "1px solid #e2e8f0",
            background:
              "linear-gradient(to top, rgba(255,255,255,0.98), rgba(255,255,255,0.75))",
            backdropFilter: "blur(12px)",
            boxShadow: "0 -6px 24px rgba(0,0,0,0.06)",
            position: "relative",
            zIndex: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              mr: 2,
            }}
          >
            {canCreateFlow && (
              <Button
                type="submit"
                variant="modalSubmitBtn"
                form="conditions-form"
                disabled={!canEditFlow || isCreatingCondition}
              >
                {isCreatingCondition ? "Saving..." : "Save"}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default FlowConditionModal;
