import { ReactNode, useEffect, useMemo, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

import {
  useCreateConditionMutation,
  useGetConditionsForQuestionQuery,
} from "../../app/slices/flowApiSlice";
import { useAppTheme } from "../../theme/useAppTheme";
import { validateConditions } from "../../utils/conditionValidation";
import { elementIcons } from "../../utils/elementsConfig";
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
  const { primary, scrollStyles, grey } = useAppTheme();
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
          element.type !== "INSTRUCTIONS"
      ),
    [Elements]
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
          edge.type !== "bypass-edge" || edge.data?.flowConditionID !== ""
      )
    );

    setOpenConditions(false);
    setSelectedNode(null);
  };

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [touchedAccordions, setTouchedAccordions] = useState<
    Record<number, boolean>
  >({});

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
    try {
      setHasSubmitted(true);

      let formattedData = (data.conditions ?? []).filter(
        (condition: any) => condition.goto_questionID
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
        (condition: any) => condition.flowConditionID === ""
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
        ({ flowConditionID, ...rest }: { flowConditionID: string }) => rest
      );

      createCondition(newConditions);

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
          width: 700,
          bgcolor: "#E7E5E5",
          borderRadius: "8px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            margin: "auto",
            width: "100%",
            gap: "1%",
            height: 600,
            overflow: "hidden",
            // border: "2px solid black",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              flex: 1,
              // border: "2px solid green",
              borderBottom: "1px solid #FFFFFF",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                height: "98%",
                width: "20%",
                // border: "2px solid red",
              }}
            >
              <Chip
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "20px",
                  marginLeft: "12%",
                  backgroundColor: "white",
                  width: "48%",
                  height: "60%",
                  gap: "4px",
                  "& .MuiChip-label": {
                    fontSize: "16px",
                    fontWeight: "bold",
                    marginTop: "2px",
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
                    ? edgeFormData.sourceQuestionOrder
                    : (selectedNode?.data?.order as ReactNode)
                }
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "98%",
                width: "60%",
                // border: "2px solid green",
              }}
            >
              <Typography
                sx={{ fontSize: "20px", fontStyle: "bold", color: "#171717" }}
              >
                Edit conditions
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                height: "98%",
                width: "20%",
                // border: "2px solid blue",
              }}
            >
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleClose}
                sx={{ marginRight: "12%", color: grey[800] }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ width: "100%", flex: 8 /*border: "2px solid green"*/ }}>
            <form onSubmit={handleSubmit(submitConditionData)}>
              <Box
                sx={{
                  display: "block",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "16px",
                  width: "100%",
                  height: { md: "76vh", lg: "64vh", xl: "50vh" },
                  overflowY: "scroll",
                  overflowX: "hidden",
                  ...scrollStyles.conditionsScroll,
                  // border: "2px solid black",
                  boxSizing: "border-box",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "1%",
                    gap: "2%",
                    margin: "auto",
                    width: "96%",
                    height: "auto",
                    // border: "2px solid orange",
                  }}
                >
                  {isLoading || isFetching ? (
                    <CircularProgress />
                  ) : (
                    (conditions ?? []).map((condition, index: number) => (
                      <FlowFormConditionBlock
                        key={index} // NOSONAR
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
                        // setTouchedConditions={setTouchedConditions}
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
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  flex: 1,
                  gap: "1%",
                  // border: "2px solid blue",
                  borderTop: "1px solid #FFFFFF",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    marginTop: "2%",
                    paddingLeft: "2%",
                    height: "98%",
                    width: "50%",
                    // border: "2px solid red",
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={addConditionBlock}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "60%",
                      textTransform: "unset",
                      color: "#060608",
                      fontSize: "14px",
                      fontWeight: "bold",
                      gap: 1,
                    }}
                  >
                    <AddIcon />
                    Add condition
                  </Button>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginTop: "2%",
                    paddingRight: "2%",
                    gap: "12px",
                    height: "98%",
                    width: "60%",
                    // border: "2px solid red",
                  }}
                >
                  <Button
                    onClick={handleClose}
                    fullWidth
                    variant="outlined"
                    sx={{
                      textTransform: "capitalize",
                      color: "#181E2B",
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isCreatingCondition}
                    sx={{
                      textTransform: "unset",
                      backgroundColor: primary.dark,
                      color: "#FFFFFF",
                    }}
                  >
                    {isCreatingCondition ? "Saving..." : "Save condition"}
                  </Button>
                </Box>
              </Box>
            </form>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default FlowConditionModal;
