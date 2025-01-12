import { useEffect, useState } from "react";

import ClearIcon from "@mui/icons-material/Clear";
import Checkbox from "@mui/joy/Checkbox";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { MdAdd } from "react-icons/md";
import { toast } from "react-toastify";

import {
  useCreateNewOptionMutation,
  useDeleteOptionMutation,
  useGetOptionsOfQuestionQuery,
  useUpdateOptionTextandValueMutation,
} from "../../../app/slices/optionApiSlice";
import { ElementProps, ErrorData, OptionType } from "../../../utils/types";

import ElementQuestionText from "./ElementQuestionText";

const CheckBoxElement = ({
  qID,
  qNO,
  qText,
  qType,
  qDescription,
  display,
}: ElementProps) => {
  const [editingID, setEditingID] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");

  const { data: options = [] as OptionType[] } =
    useGetOptionsOfQuestionQuery(qID);

  const [createNewOption, { isError, error }] = useCreateNewOptionMutation();

  const [updateOptionTextandValue] = useUpdateOptionTextandValueMutation();

  const [deleteOption] = useDeleteOptionMutation();

  const handleDoubleClick = (option: OptionType) => {
    setEditingID(option.optionID);
    setEditText(option.text);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(event.target.value);
  };

  const handleBlur = async () => {
    await updateOptionTextandValue({
      optionID: editingID,
      text: editText,
      value: editText,
    });
    setEditingID(null);
  };

  const addChoice = async () => {
    const order = options ? options.length + 1 : 1;

    try {
      if (options.length < 26) {
        const nextCharCode = "A".charCodeAt(0) + options.length;
        const nextChoiceLetter = String.fromCharCode(nextCharCode);
        await createNewOption({
          questionID: qID,
          text: `Choice ${nextChoiceLetter}`,
          value: `Choice ${nextChoiceLetter}`,
          order,
        });
        // refetch();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteChoice = async (optionID: string) => {
    try {
      await deleteOption(optionID).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

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
  }, [isError, error, options]);

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"start"}
      alignItems={"center"}
      margin={"auto"}
      width={"98%"}
      height={"100%"}
      zIndex={20}
    >
      <Box
        display={"flex"}
        flexDirection={"row"}
        sx={{ width: "80%", maxWidth: "96%", marginTop: "12%" }}
      >
        <ElementQuestionText
          qID={qID}
          qNO={qNO}
          qText={qText}
          qType={qType}
          qDescription={qDescription}
          display={display}
        />
      </Box>
      <Box
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        mt={2}
        sx={{
          width: "100%",
          maxWidth: "240px",
          padding: "2%",
          border: "2px solid red",
          "@media (max-width: 600px)": {
            width: "95%",
            padding: "0",
          },
        }}
      >
        {options.map((option, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
              padding: "1px 2px",
              width: "100%",
              minHeight: "36px",
              backgroundColor: "#E5ECF7",
              borderRadius: "4px",
              border: "1px solid #003DAC",
              fontSize: "16px",
              fontWeight: "bold",
              position: "relative",
              "&:hover .close-button": {
                visibility: "visible",
              },
              "@media (max-width: 600px)": {
                flexDirection: "column",
                alignItems: "flex-start",
                minHeight: "32px",
                padding: "2px 4px",
                marginBottom: "4px",
              },
            }}
          >
            <Box
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              ml={2}
              mr={2}
              sx={{
                width: "auto",
                marginRight: "12px",
                "@media (max-width: 600px)": {
                  marginBottom: "8px",
                },
              }}
            >
              <Checkbox
                key={option.optionID}
                onClick={handleClick}
                sx={{
                  "@media (max-width: 600px)": {
                    "& .MuiSvgIcon-root": { fontSize: 18 },
                  },
                }}
              />
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                width: "calc(100% - 48px)",
                "@media (max-width: 600px)": {
                  width: "calc(100% - 30px)",
                },
              }}
            >
              <Box
                display={"flex"}
                flexDirection={"row"}
                justifyContent={"start"}
                alignItems={"center"}
                width={"100%"}
                height={"100%"}
                onDoubleClick={() => handleDoubleClick(option)}
                sx={{ flex: "1 1 auto", flexGrow: 1, cursor: "pointer" }}
              >
                {editingID === option.optionID ? (
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    type="text"
                    value={editText}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoFocus
                    InputProps={{
                      sx: {
                        height: "100%",
                        padding: "0px",
                        "& input": {
                          padding: "4px 8px",
                        },
                      },
                    }}
                    sx={{
                      backgroundColor: "transparent",
                      width: "100%",
                      height: "100%",
                      marginRight: "4%",
                      "& .MuiOutlinedInput-root": {
                        height: "100%",
                        "& fieldset": {
                          border: "none",
                        },
                      },
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      height: "auto",
                      padding: "4%",
                      overflow: "hidden",
                      // border: "2px solid black",
                    }}
                  >
                    <Typography
                      // ml={1}
                      sx={{
                        fontSize: "16px",
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        width: "100%",
                        padding: "4px 0",
                      }}
                      onClick={handleClick}
                    >
                      {option.text}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
            <IconButton
              className="close-button"
              onClick={() => deleteChoice(option.optionID)}
              z-index={10}
              sx={{
                position: "absolute",
                top: "50%",
                right: "-12px",
                transform: "translateY(-50%)",
                visibility: "hidden",
                width: "24px",
                height: "24px",
                backgroundColor: "darkred",
                color: "white",
                "&:hover": {
                  backgroundColor: "red",
                },
              }}
            >
              <ClearIcon />
            </IconButton>
          </Box>
        ))}
      </Box>
      <Box mt={2} mb={2}>
        {options.length < 10 && (
          <Button
            onClick={addChoice}
            sx={{
              backgroundColor: "#0445AF",
              mr: 2,
              textTransform: "capitalize",
              "&:hover": {
                backgroundColor: "#0445AF",
              },
            }}
            variant="contained"
            size="small"
            endIcon={<MdAdd fontSize={"24px"} />}
          >
            Add Choice &nbsp;
          </Button>
        )}
      </Box>
    </Box>
  );
};
export default CheckBoxElement;
