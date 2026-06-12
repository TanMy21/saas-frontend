import {
  Box,
  IconButton,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import { ChevronDown, CircleX, MoveRight } from "lucide-react";
import { Controller } from "react-hook-form";
import { MdError } from "react-icons/md";

import { useDeleteConditionMutation } from "../../app/slices/flowApiSlice";
import useAuth from "../../hooks/useAuth";
import { elementIcons } from "../../utils/elementsConfig";
import { convertHtmlToPlainText } from "../../utils/richTextUtils";
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
  edgeFormData,
  control,
  register,
  Elements,
  watch,
  setValue,
  setEdges,
  setConditions,
  errors,
  formErrors,
  isValid,
}: FlowFormConditionBlockProps) => {
  const { can } = useAuth();
  const canEditFlow = can("UPDATE_FLOW");
  const canDeleteFlow = can("DELETE_FLOW");

  const FormConditionComponent: Record<string, React.FC<FlowFormProps>> = {
    BINARY: FlowFormBinary,
    DROPDOWN: FlowFormOptions,
    MEDIA: FlowFormOptions,
    MULTIPLE_CHOICE: FlowFormOptions,
    RADIO: FlowFormOptions,
    TEXT: FlowFormInput,
    NUMBER: FlowFormInput,
    RANGE: FlowFormInput,
    RANK: FlowFormNoCondition,
    THREE_D: FlowForm3D,
    TIMED_CHOICE: FlowFormBinary,
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
        prev.filter((_cond, idx) => idx !== blockIndex - 1),
      );
      setEdges((prevEdges) =>
        prevEdges.filter(
          (edge) =>
            !(
              edge.type === "bypass-edge" &&
              edge.source === condition.relatedQuestionID &&
              edge.target === condition.goto_questionID
            ),
        ),
      );
      if (condition.flowConditionID) {
        await deleteCondition(condition.flowConditionID).unwrap();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          width: "96%",
          px: 1,
          py: 1,
          pr: 2,
          borderRadius: "16px",
          border: "1px solid rgba(226,232,240,0.8)",
          bgcolor: isValid ? "rgba(255,255,255,0.8)" : "#FFF4F3",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: "rgba(99,102,241,0.4)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          },
        }}
      >
        {/* CONDITION NUMBER */}
        <Box
          sx={{
            display: "flex",
            width: "4%",
            height: "98%",
            // border: "2px solid red",
          }}
        >
          <Box
            sx={{
              minWidth: "28px",
              height: "28px",
              borderRadius: "8px",
              bgcolor: "#eef2ff",
              color: "#4338ca",
              fontWeight: 700,
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {blockIndex}
          </Box>
        </Box>
        {/* IF BLOCK */}
        <Box
          sx={{
            display: "flex",
            width: "40%",
            height: "98%",
            // border: "2px solid red",
          }}
        >
          {ConditionComponent ? (
            <ConditionComponent
              condition={condition}
              setConditions={setConditions}
              readOnly={!canEditFlow}
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
        {/* ARROW */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "4%",
            height: "98%",
            // border: "2px solid red",
          }}
        >
          <MoveRight size={24} color={"#94a3b8"} />
        </Box>
        {/* THEN BLOCK */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 1.5,
            width: "44%",
            py: 0.8,
            borderRadius: "12px",
            bgcolor: "rgba(99,102,241,0.06)",
            border: "1px solid rgba(99,102,241,0.15)",
            height: "98%",
            // border: "2px solid red",
          }}
        >
          <Typography
            sx={{
              fontSize: "15px",
              fontWeight: 700,
              textTransform: "uppercase",
              color: "#6366f1",
              whiteSpace: "nowrap",
            }}
          >
            Then
          </Typography>

          {/* TARGET SELECT */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Controller
              control={control}
              name={`conditions.${blockIndex}.goto_questionID`}
              defaultValue={condition.goto_questionID || ""}
              render={({ field }) => {
                const selectedElement = Elements.find(
                  (el) => el.questionID === field.value,
                );
                const label = selectedElement
                  ? convertHtmlToPlainText(selectedElement.text)
                  : "";
                return (
                  <Select
                    {...field}
                    disabled={!canEditFlow}
                    value={field.value || ""}
                    IconComponent={ChevronDown}
                    renderValue={() => (
                      <Tooltip title={label} placement="top" arrow>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            width: "100%",
                            minWidth: 0,
                          }}
                        >
                          {/* icon */}
                          <Box sx={{ fontSize: "18px", flexShrink: 0 }}>
                            {selectedElement &&
                              elementIcons[
                                selectedElement.type as keyof IconMapping
                              ]}
                          </Box>
                          {/* text */}
                          <Box
                            sx={{
                              flex: 1,
                              minWidth: 0,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {label}
                          </Box>
                        </Box>
                      </Tooltip>
                    )}
                    sx={{
                      width: "100%",
                      height: "32px",
                      borderRadius: "8px",
                      minWidth: 0,
                      maxWidth: "240px",
                      bgcolor: "rgba(99,102,241,0.06)",
                      "& .MuiSelect-select": {
                        px: 1,
                        pr: "28px",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "16px",
                        overflow: "hidden",
                      },
                      "& fieldset": {
                        border: "none",
                      },
                      "& .MuiSelect-icon": {
                        color: "#6366f1",
                        right: "6px",
                      },
                      "&:hover": {
                        bgcolor: "rgba(99,102,241,0.06)",
                      },
                      "&.Mui-focused": {
                        bgcolor: "rgba(99,102,241,0.08)",
                      },
                    }}
                  >
                    {Elements.map((element) => (
                      <MenuItem
                        key={element.questionID}
                        value={element.questionID}
                        sx={{ mx: 0.5, borderRadius: "10px" }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            width: "100%",
                            minWidth: 0,
                          }}
                        >
                          <Box sx={{ fontSize: "18px", flexShrink: 0 }}>
                            {elementIcons[element.type as keyof IconMapping]}
                          </Box>

                          <Box
                            sx={{
                              flex: 1,
                              minWidth: 0,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {convertHtmlToPlainText(element.text)}
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                );
              }}
            />
          </Box>
        </Box>
        {/* DELETE */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            width: "4%",
            height: "98%",
            // border: "2px solid red",
          }}
        >
          {canDeleteFlow && (
            <IconButton
              onClick={canEditFlow ? handleDeleteCondition : undefined}
              disabled={!canEditFlow}
              sx={{
                opacity: 0,
                transition: "all 0.2s",
                color: "#ef4444",
                "&:hover": {
                  bgcolor: "transparent",
                },
                ".MuiBox-root:hover &": {
                  opacity: 1,
                },
              }}
            >
              <CircleX size={28} />
            </IconButton>
          )}
        </Box>
      </Box>
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
    </>
  );
};

export default FlowFormConditionBlock;
