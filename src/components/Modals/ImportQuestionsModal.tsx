import { useState } from "react";

import CircleIcon from "@mui/icons-material/Circle";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";

import { useImportQuestionsMutation } from "../../app/slices/elementApiSlice";
import { ImportQuestionProps } from "../../utils/types";

const ImportQuestionsModal = ({
  isOpen,
  // surveyID,
  openImport,
  setOpenImport,
}: ImportQuestionProps) => {
  const { surveyID } = useParams();
  const [open, setOpen] = useState(isOpen);
  const [value, setValue] = useState("");

  const [importQuestions, { isLoading }] = useImportQuestionsMutation();

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValue(event.target.value);
  };
  const handleClose = () => {
    setOpen(false);
    setOpenImport!(false);
  };

  const handleImport = async () => {
    try {
      // const questionsGenerated =
      await importQuestions({
        surveyID,
        value,
      }).unwrap();
      setValue("");
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      open={open! || openImport!}
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
          height: 500,
          bgcolor: "#FAFAFA",
          borderRadius: 1,
          p: 4,
        }}
      >
        <Box
          display={"flex"}
          flexDirection={"column"}
          sx={{ width: "100%", height: "100%" }}
        >
          <Box
            display={"flex"}
            justifyContent={"end"}
            sx={{ width: "100%", height: 30 }}
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
          <Box
            display={"flex"}
            flexDirection={"row"}
            sx={{
              width: "100%",
              height: 420,
              padding: "8px",
            }}
          >
            {isLoading ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  width: "96%",
                  height: "96%",
                }}
              >
                <CircularProgress size={100} />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    marginLeft: "4%",
                  }}
                >
                  <Typography sx={{ fontSize: "36px", color: "black" }}>
                    Composing your questions
                  </Typography>
                  <Typography sx={{ fontSize: "24px", color: "#71717A" }}>
                    This may take up to a minute.
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  width: "98%",
                  height: "98%",
                }}
              >
                <Box
                  sx={{
                    width: "60%",
                    height: "96%",
                    padding: "8px",
                  }}
                >
                  <TextField
                    value={value}
                    onChange={handleChange}
                    multiline
                    rows={16}
                    variant="outlined"
                    fullWidth
                    placeholder="Enter your text here..."
                    sx={{ height: "100%" }}
                    inputProps={{ style: { overflow: "auto" } }}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    width: "36%",
                    height: "96%",
                    marginLeft: "8px",
                  }}
                >
                  <Box
                    sx={{
                      margin: "auto",
                      width: "92%",
                      height: "64%",
                      borderRadius: "8%",
                      backgroundColor: "#F7FBFE",
                      border: "2px solid #8EC4F6",
                    }}
                  >
                    <List sx={{ padding: 0 }}>
                      <ListItem
                        sx={{
                          marginBottom: "2px",
                        }}
                      >
                        <ListItemIcon sx={{ color: "#2269BF" }}>
                          <InfoIcon />
                        </ListItemIcon>
                      </ListItem>
                      <ListItem
                        sx={{
                          marginBottom: "2px",
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color: "#3D3D3C",
                            minWidth: "20px",
                            marginRight: "1px",
                            marginBottom: "1px",
                          }}
                        >
                          <CircleIcon style={{ fontSize: "0.5rem" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Import questions"
                          primaryTypographyProps={{
                            variant: "body2",
                            style: { margin: 0 },
                          }}
                        />
                      </ListItem>
                      <ListItem
                        sx={{
                          marginBottom: "2px",
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color: "#3D3D3C",
                            minWidth: "20px",
                            marginRight: "1px",
                          }}
                        >
                          <CircleIcon style={{ fontSize: "0.5rem" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary=" Add questions followed by its options"
                          primaryTypographyProps={{
                            variant: "body2",
                            style: { margin: 0 },
                          }}
                        />
                      </ListItem>
                      <ListItem
                        sx={{
                          marginBottom: "-200px",
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color: "#3D3D3C",
                            minWidth: "20px",
                            marginRight: "1px",
                          }}
                        >
                          <CircleIcon style={{ fontSize: "0.5rem" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary=" Edit and adjust formatting later"
                          primaryTypographyProps={{
                            variant: "body2",
                            style: { margin: 0 },
                          }}
                        />
                      </ListItem>
                    </List>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
          <Box
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"flex-end"}
            sx={{
              width: "100%",
              height: "12%",
              padding: "8px",
            }}
          >
            <Box sx={{ width: "20%", height: "100%" }}>
              <Button
                onClick={handleImport}
                type="submit"
                fullWidth
                disabled={isLoading}
                variant="outlined"
                sx={{
                  textTransform: "capitalize",
                  backgroundColor: "#7F56D9",
                  fontWeight: 600,
                  borderRadius: "4px",
                  border: "none",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#7F56D9",
                    border: "none",
                  },
                }}
              >
                Import
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ImportQuestionsModal;
