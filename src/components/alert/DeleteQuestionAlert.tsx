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
            alignItems: "center",
            gap: 2.5,
          }}
        >
          {/* Shredder animation */}
          <Box
            sx={{
              width: 96,
              height: 118,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* The icon is confined to this area and cannot pass below the divider. */}
            <Box
              sx={{
                width: 64,
                height: 52,
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              <motion.div
                animate={{ y: [0, 58] }}
                transition={{
                  duration: 1.45,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <FileText size={48} color="#e53935" />
              </motion.div>
            </Box>

            {/* Divider stays above the document animation visually. */}
            <Divider
              sx={{
                width: 56,
                borderBottomWidth: 2.5,
                borderColor: "#e53935",
                my: 0.5,
              }}
            />

            {/* Only shredded strips appear below the divider. */}
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                gap: 0.65,
                height: 42,
                overflow: "hidden",
                mt: 0.5,
              }}
            >
              {Array.from({ length: 5 }).map((_, index) => (
                <motion.div
                  key={index}
                  style={{
                    width: 5,
                    height: 34,
                    backgroundColor: "#e53935",
                    borderRadius: 3,
                  }}
                  animate={{
                    y: [-10, 26],
                    opacity: [0, 1, 0.15],
                  }}
                  transition={{
                    duration: 0.95,
                    repeat: Infinity,
                    ease: "linear",
                    delay: index * 0.1,
                  }}
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
