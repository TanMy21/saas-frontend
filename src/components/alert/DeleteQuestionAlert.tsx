import { Box, Divider, Modal, Typography } from "@mui/material";
import { FileText } from "lucide-react";
import { motion } from "motion/react";

import { DeleteQuestionAlertProps } from "../../utils/types";

const DeleteQuestionAlert = ({ open }: DeleteQuestionAlertProps) => {
  return (
    <Modal
      open={open}
      aria-labelledby="deleting-title"
      slotProps={{
        backdrop: { style: { backgroundColor: "rgba(0,0,0,0.35)" } },
      }}
    >
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Box
          sx={{
            width: { xs: 320, sm: 360 },
            bgcolor: "#fff",
            borderRadius: 2.5,
            boxShadow: "0px 10px 30px rgba(0,0,0,0.15)",
            p: 3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 2.5,
          }}
        >
          {/* Animation */}
          <Box
            sx={{
              width: 96,
              height: 96,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <motion.div
              animate={{ y: [0, 40] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            >
              <FileText size={48} color={"#e53935"} />
            </motion.div>

            <Divider
              sx={{
                width: 48,
                borderBottomWidth: 2,
                borderColor: "#e53935",
                my: 1,
              }}
            />

            <Box sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  style={{
                    width: 4,
                    height: 32,
                    backgroundColor: "#e53935",
                    borderRadius: 2,
                  }}
                  animate={{ y: [0, 20], opacity: [1, 0.2] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </Box>
          </Box>

          <Typography
            id="deleting-title"
            sx={{
              color: "#616161",
              fontSize: 18,
              fontWeight: 600,
              lineHeight: 1.2,
            }}
          >
            Deleting question...
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteQuestionAlert;