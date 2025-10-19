import { ReactNode } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { MdError } from "react-icons/md";

import { useDeleteConditionMutation } from "../../app/slices/flowApiSlice";
import { useAppTheme } from "../../theme/useAppTheme";
import { elementIcons } from "../../utils/elementsConfig";
import {
  FlowFormConditionBlockProps,
  FlowFormProps,
  IconMapping,
} from "../../utils/types";

import { FlowForm3D } from "./FlowForm3D";
import FlowFormBinary from "./FlowFormBinary";
import FlowFormInput from "./FlowFormInput";
import FlowFormNoCondition from "./FlowFormNoCondition";
import FlowFormOptions from "./FlowFormOptions";

const FlowFormConditionBlock = ({
  condition,
  selectedNode,
  blockIndex,
  questionID,
  Elements,
  edgeFormData,
  control,
  register,
  watch,
  setValue,
  setEdges,
  setConditions,
  errors,
  formErrors,
  isValid,
  onAccordionClick,
}: FlowFormConditionBlockProps) => {
  const { text } = useAppTheme();
  const FormConditionComponent: Record<string, React.FC<FlowFormProps>> = {
    BINARY: FlowFormBinary,
    MEDIA: FlowFormOptions,
    MULTIPLE_CHOICE: FlowFormOptions,
    RADIO: FlowFormOptions,
    TEXT: FlowFormInput,
    NUMBER: FlowFormInput,
    RANGE: FlowFormInput,
    RANK: FlowFormNoCondition,
    THREE_D: FlowForm3D,
  };

  const [deleteCondition] = useDeleteConditionMutation();

  const ConditionComponent =
    FormConditionComponent[
      edgeFormData.sourceQuestionIcon || (selectedNode?.data.element as string)
    ];

  let noCondition = false;

  if (
    edgeFormData.sourceQuestionIcon === "RANK" ||
    edgeFormData.sourceQuestionIcon === "THREE_D" ||
    selectedNode?.data.element === "RANK" ||
    selectedNode?.data.element === "THREE_D"
  ) {
    noCondition = true;
  }

  const handleDeleteCondition = async () => {
    try {
      setConditions((prev) =>
        prev.filter((cond, idx) => idx !== blockIndex - 1)
      );

      setEdges((prevEdges) =>
        prevEdges.filter(
          (edge) =>
            !(
              edge.type === "bypass-edge" &&
              edge.source === condition.relatedQuestionID &&
              edge.target === condition.goto_questionID
            )
        )
      );

      if (condition.flowConditionID) {
        await deleteCondition(condition.flowConditionID).unwrap();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        margin: "auto",
        marginBottom: "2%",
        width: "96%",
        height: "fit-content",
        // border: isValid ? "3px solid red" : "none",
      }}
    >
      <Accordion
        onClick={onAccordionClick}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          margin: "auto",
          marginTop: "1%",
          gap: "1%",
          width: "98%",
          minHeight: "36px",
          maxHeight: "360px",
          backgroundColor: isValid ? "white" : "#FFF4F3",
          borderRadius: "8px",
          boxSizing: "border-box",
          overflow: "hidden",
          border: isValid ? "none" : "3px solid #E46962",
        }}
        defaultExpanded
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              height: "32px",
              // border: "2px solid blue",
            }}
          >
            <Chip
              sx={{ marginLeft: "2%", padding: "1%", fontWeight: "bold" }}
              label={`Condition ${blockIndex}`}
              variant="outlined"
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "end",
                width: "80%",
                height: "98%",
                // border: "2px solid black",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "10%",
                  height: "100%",
                }}
              >
                <IconButton onClick={handleDeleteCondition}>
                  <DeleteIcon sx={{ color: text.danger }} />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            marginTop: "-2%",
            // border: "2px solid red",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              marginTop: "-1%",
              padding: "1%",
              width: "98%",
              // height: "100px",
              // border: "2px solid red",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                width: "96%",
                height: "20%",
                margin: "auto",
                fontSize: "16px",
                fontWeight: "bold",
                // border: "2px solid orange",
              }}
            >
              If
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                width: "96%",
                margin: "auto",
                // border: "2px solid orange",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "8%",
                  height: "96%",
                  fontSize: "28px",
                  // border: "2px solid red",
                }}
              >
                {
                  elementIcons[
                    edgeFormData.sourceQuestionIcon ||
                      (selectedNode?.data?.element as keyof IconMapping)
                  ]
                }
              </Box>
              <Box
                sx={{
                  display: "flex",
                  marginLeft: "1%",
                  justifyContent: "start",
                  alignItems: "center",
                  padding: "1%",
                  width: "90%",
                  fontSize: "18px",
                  fontWeight: 600,
                  // border: "2px solid red",
                  overflowWrap: "break-word",
                  wordWrap: "break-word",
                  whiteSpace: "normal",
                }}
              >
                {edgeFormData.sourceQuestionText ||
                  (selectedNode?.data.question as ReactNode)}
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "start",
                width: "96%",
                height: "33%",
                margin: "auto",
                // border: "2px solid orange",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  padding: "1%",
                  width: "100%",
                  // height: "98%",
                  // border: "2px solid red",
                }}
              >
                {ConditionComponent ? (
                  <ConditionComponent
                    condition={condition}
                    setConditions={setConditions}
                    questionID={edgeFormData.sourceQuestionID || questionID}
                    questionType={
                      edgeFormData.sourceQuestionIcon ||
                      (selectedNode?.data.element as string)
                    }
                    control={control}
                    register={register}
                    watch={watch}
                    setValue={setValue}
                    formErrors={formErrors}
                    blockIndex={blockIndex}
                  />
                ) : null}
              </Box>
            </Box>
          </Box>

          {noCondition ? null : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "2%",
                padding: "1%",
                width: "98%",
                height: "80px",
                // border: "2px solid green",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "center",
                  width: "96%",
                  height: "28%",
                  margin: "auto",
                  fontSize: "16px",
                  fontWeight: "bold",
                  // border: "2px solid orange",
                }}
              >
                Then
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "start",
                  gap: "2%",
                  top: "-16%",
                  width: "96%",
                  height: "48%",
                  margin: "auto",
                  // border: "2px solid orange",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "10%",
                    height: "96%",
                    color: "#71717A",
                    fontWeight: 700,
                  }}
                >
                  Go to
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "84%",
                    height: "96%",
                  }}
                >
                  <Select
                    {...register(`conditions.${blockIndex}.goto_questionID`)}
                    defaultValue={
                      condition.goto_questionID || Elements[0]?.questionID || ""
                    }
                    onChange={(e) => {
                      setConditions((prev) =>
                        prev.map((cond, idx) =>
                          idx === blockIndex
                            ? { ...cond, goto_questionID: e.target.value }
                            : cond
                        )
                      );
                    }}
                    sx={{ width: "100%", height: "80%" }}
                  >
                    {Elements.map((element) => (
                      <MenuItem
                        key={element.questionID}
                        value={element.questionID}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "2%",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              fontSize: "20px",
                            }}
                          >
                            {elementIcons[element.type as keyof IconMapping]}
                          </Box>
                          <Box
                            sx={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {element.text}
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </Box>
            </Box>
          )}
        </AccordionDetails>
      </Accordion>
      {errors.length > 0 &&
        errors.map((error: string, idx: number) => (
          <Box
            key={idx}
            sx={{
              width: "88%",
              minHeight: "20px",
              margin: "auto",
              mt: "2px",
              padding: "6px 8px",
              backgroundColor: "#FFF4F3",
              borderRadius: "8px",
              border: "2px solid #DEC0C5",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <MdError style={{ color: "red" }} />
            <Typography variant="caption" color="error" fontSize={16}>
              {error}
            </Typography>
          </Box>
        ))}
    </Box>
  );
};

export default FlowFormConditionBlock;
