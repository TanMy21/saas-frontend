import { useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ListIcon from "@mui/icons-material/List";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";

import { useUpdateQuestionPreferenceUIConfigMutation } from "../../../../app/slices/elementApiSlice";
import {
  updateBinaryButtonTextNo,
  updateBinaryButtonTextYes,
} from "../../../../app/slices/elementSlice";
import { RootState } from "../../../../app/store";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../app/typedReduxHooks";
import { uiConfigPreferenceSchema } from "../../../../utils/schema";
import { BinaryResponseProps } from "../../../../utils/types";

const BinaryOptionsSettings = () => {
  const dispatch = useAppDispatch();
  const question = useAppSelector(
    (state: RootState) => state.question.selectedQuestion
  );

  const [updateQuestionPreferenceUIConfig] =
    useUpdateQuestionPreferenceUIConfigMutation();

  const { questionID, questionPreferences } = question || {};

  const { buttonTextYes, buttonTextNo } = questionPreferences?.uiConfig || {
    buttonTextYes: "Yes",
    buttonTextNo: "No",
  };

  const { handleSubmit, control, reset } = useForm<BinaryResponseProps>({
    resolver: zodResolver(uiConfigPreferenceSchema),
    defaultValues: {
      buttonTextYes,
      buttonTextNo,
    },
  });

  const watchedValues = useWatch({ control });
  const [formTouched, setFormTouched] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onSubmit = async (data: BinaryResponseProps) => {
    try {
      const { buttonTextYes, buttonTextNo } = data;

      const uiConfig = { buttonTextYes, buttonTextNo };
      await updateQuestionPreferenceUIConfig({
        questionID,
        uiConfig,
      });
      setFormTouched(false);
    } catch (error) {
      console.error(error);
    }
  };

  const markFormTouched = () => {
    if (!formTouched) setFormTouched(true);
  };

  useEffect(() => {
    if (!formTouched) return;

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      handleSubmit(onSubmit)();
      setFormTouched(false);
    }, 2500);
  }, [watchedValues, formTouched, handleSubmit]);

  useEffect(() => {
    if (buttonTextYes !== undefined && buttonTextNo !== undefined) {
      reset({
        buttonTextYes: buttonTextYes,
        buttonTextNo: buttonTextNo,
      });
    }
  }, [buttonTextYes, buttonTextNo, reset]);

  return (
    <Accordion
      sx={{
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderTop: "1px solid #E0E0E0",
        borderRadius: 0,
        boxShadow: "none",
        "&:before": { display: "none" },
        "& .MuiAccordionSummary-root": {
          borderTopLeftRadius: "0px",
          borderTopRightRadius: "0px",
        },
      }}
      defaultExpanded={false}
      disableGutters
      elevation={0}
      square
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 2,
            fontWeight: 500,
            // pl: "4%",
            color: "#453F46",
          }}
        >
          <ListIcon sx={{ color: "#752FEC", fontSize: "20px" }} />
          <Tooltip title="Set the text for the options">
            <Typography>Options</Typography>
          </Tooltip>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            marginLeft: "2%",
            // border: "2px solid orange",
          }}
        >
          <Box sx={{ fontWeight: 600, color: "#444D5C" }}>Button 1</Box>
          <Box mt={1}>
            <Controller
              name="buttonTextYes"
              control={control}
              render={({ field }) => (
                <TextField
                  type="text"
                  variant="standard"
                  sx={{
                    "& .MuiInputBase-input": {
                      lineHeight: "1.5",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontFamily: `"Inter", "Segoe UI", "Roboto", sans-serif`,
                      fontWeight: 500,
                    },
                    "& .MuiInputBase-root": {
                      borderRadius: "8px",
                      height: "42px",
                      fontSize: "15px",
                      backgroundColor: "#F3F4F6",
                      fontFamily: `"Inter", "Segoe UI", "Roboto", sans-serif`,
                      fontWeight: 500,
                      color: "#1F2937",
                      px: 1.5,
                      transition: "background-color 0.2s ease",
                      "&:hover": {
                        backgroundColor: "#E5E7EB",
                      },
                      "&.Mui-focused": {
                        backgroundColor: "#E0E7FF",
                      },
                    },
                    "& input::placeholder": {
                      color: "#9CA3AF",
                      opacity: 1,
                      fontWeight: 400,
                    },
                    mb: 2,
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        sx={{ color: "#6846E5", marginBottom: 0.5 }}
                      >
                        {`${0}/24`}
                      </InputAdornment>
                    ),
                    disableUnderline: true,
                  }}
                  {...field}
                  onChange={(event) => {
                    const value = event.target.value;
                    field.onChange(value);
                    markFormTouched();
                    dispatch(updateBinaryButtonTextYes(value));
                  }}
                />
              )}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            marginLeft: "2%",
            // border: "2px solid orange",
          }}
        >
          <Box sx={{ fontWeight: 500, color: "#3F3F46" }}>Button 2</Box>
          <Box mt={1}>
            <Controller
              name="buttonTextNo"
              control={control}
              render={({ field }) => (
                <TextField
                  type="text"
                  variant="standard"
                  sx={{
                    "& .MuiInputBase-input": {
                      lineHeight: "1.5",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontFamily: `"Inter", "Segoe UI", "Roboto", sans-serif`,
                      fontWeight: 500,
                    },
                    "& .MuiInputBase-root": {
                      borderRadius: "8px",
                      height: "42px",
                      fontSize: "15px",
                      backgroundColor: "#F3F4F6",
                      fontFamily: `"Inter", "Segoe UI", "Roboto", sans-serif`,
                      fontWeight: 500,
                      color: "#1F2937",
                      px: 1.5,
                      transition: "background-color 0.2s ease",
                      "&:hover": {
                        backgroundColor: "#E5E7EB",
                      },
                      "&.Mui-focused": {
                        backgroundColor: "#E0E7FF",
                      },
                    },
                    "& input::placeholder": {
                      color: "#9CA3AF",
                      opacity: 1,
                      fontWeight: 400,
                    },
                    mb: 2,
                  }}
                  {...field}
                  onChange={(event) => {
                    const value = event.target.value;
                    field.onChange(value);
                    markFormTouched();
                    dispatch(updateBinaryButtonTextNo(value));
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        sx={{ color: "#6846E5", marginBottom: 0.5 }}
                      >
                        {`${0}/24`}
                      </InputAdornment>
                    ),
                    disableUnderline: true,
                  }}
                />
              )}
            />{" "}
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default BinaryOptionsSettings;
