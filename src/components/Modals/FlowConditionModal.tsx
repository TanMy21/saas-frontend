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

import { useGetConditionsForQuestionQuery } from "../../app/slices/flowApiSlice";
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
  // nodes,
  // edges,
  openConditions,
  setOpenConditions,
  selectedNode,
  setSelectedNode,
  edgeFormData,
  conditions,
  setConditions,
  errors,
  setErrors,
  // isValidArray,
  setIsValidArray,
  // conditionBlocks,
  // addConditionBlock,
  Elements,
}: FlowConditionModalProps) => {
  const questionID = selectedNode?.data?.questionID as string;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: formErrors },
  } = useForm();

  const filteredElements = useMemo(
    () =>
      (Elements ?? []).filter(
        (element) =>
          element.type !== "WELCOME_SCREEN" &&
          element.type !== "END_SCREEN" &&
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

  const handleClose = () => {
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
      let formattedData = (data.conditions || []).filter(
        (condition: any) => condition.goto_questionID
      );

      formattedData = formattedData.map((condition: any) => ({
        ...condition,
        flowConditionID: condition.flowConditionID || "",
        relatedQuestionID: questionID,
      }));

      console.log("Formatted Data:", formattedData);

      const { isValidArray, globalIsValid, errorMap } =
        validateConditions(formattedData);

      // console.log("Validation Results:", {
      //   isValidArray,
      //   globalIsValid,
      //   errorMap,
      // });

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

      console.log("✅ Sending Valid Data:", formattedData);

      setErrors(() => ({}));
      setIsValidArray(() => []);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  useEffect(() => {
    if (questionID) {
      setConditions(fetchConditions ?? []);

      reset({
        [questionID]: {},
      });
    }
    // console.log("Updated Errors State:", errors);
    // console.log("Fetched Conditions: ", fetchConditions);
    // console.log("Conditions: ", conditions);
  }, [questionID, reset, fetchConditions]);

  return (
    <>
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
              // border: "2px solid black",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                flex: 1,
                // border: "2px solid red",
                borderBottom: "1px solid #FFFFFF",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "98%",
                  flex: 1,
                  // border: "2px solid red",
                }}
              >
                <Chip
                  sx={{
                    fontSize: "24px",
                    backgroundColor: "white",
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
                  flex: 6,
                  // border: "2px solid green",
                }}
              >
                <Typography
                  sx={{ fontSize: "24px", fontStyle: "bold", color: "#171717" }}
                >
                  Edit Conditions
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "98%",
                  flex: 1,
                  // border: "2px solid blue",
                }}
              >
                <IconButton
                  aria-label="more"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  onClick={handleClose}
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
                    "&::-webkit-scrollbar": {
                      width: "8px",
                    },
                    "&::-webkit-scrollbar-track": {
                      background: "#f1f1f1",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: "#61A5D2",
                      borderRadius: "10px",
                      "&:hover": {
                        background: "#555",
                      },
                    },
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
                        <>
                          <FlowFormConditionBlock
                            key={index}
                            condition={condition}
                            blockIndex={index + 1}
                            selectedNode={selectedNode}
                            questionID={questionID}
                            edgeFormData={edgeFormData}
                            Elements={filteredElements}
                            register={register}
                            setConditions={setConditions}
                            // setTouchedConditions={setTouchedConditions}
                            errors={errors[index] || []}
                            formErrors={formErrors}
                            isValid={
                              !touchedAccordions[index] &&
                              hasSubmitted &&
                              errors[index]?.length > 0
                                ? false
                                : true
                            }
                            onAccordionClick={() => handleAccordionClick(index)}
                          />
                        </>
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
                        width: "60%",
                        textTransform: "capitalize",
                        color: "#060608",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "row",
                          gap: "8px",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <AddIcon />
                        </Box>
                        <Box>Add Condition</Box>
                      </Box>
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
                      sx={{
                        textTransform: "capitalize",
                        backgroundColor: "#6366F1",
                        color: "#FFFFFF",
                      }}
                    >
                      Save condition
                    </Button>
                  </Box>
                </Box>
              </form>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default FlowConditionModal;
