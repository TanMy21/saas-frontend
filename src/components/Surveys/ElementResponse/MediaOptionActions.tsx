import type { useSortable } from "@dnd-kit/sortable";
import ClearIcon from "@mui/icons-material/Clear";
import { Box, IconButton, Tooltip } from "@mui/material";
import { IoMoveSharp } from "react-icons/io5";

import MediaElementCardIconBtns from "../../MediaElementCard/MediaElementCardIconBtns";

 

type SortableResult = ReturnType<typeof useSortable>;

type MediaOptionActionsProps = {
  visible: boolean;
  canReorder: boolean;
  canEdit: boolean;
  canDelete: boolean;
  hasImage: boolean;
  optionID: string;
  dragAttributes: SortableResult["attributes"];
  dragListeners: SortableResult["listeners"];
  onDelete: () => void;
};

const MediaOptionActions = ({
  visible,
  canReorder,
  canEdit,
  canDelete,
  hasImage,
  optionID,
  dragAttributes,
  dragListeners,
  onDelete,
}: MediaOptionActionsProps) => {
  if (!visible) return null;

  return (
    <Box
      component="div"
      sx={{
        position: "absolute",
        inset: 8,
        zIndex: 1,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        pointerEvents: "none",
      }}
    >
      {canReorder ? (
        <Tooltip title="Drag to reorder">
          <IconButton
            {...dragAttributes}
            {...dragListeners}
            tabIndex={-1}
            size="small"
            sx={{
              pointerEvents: "auto",
              width: 30,
              height: 30,
              color: "#39414A",
              backgroundColor: "rgba(255,255,255,0.94)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
              cursor: "grab",
              "&:active": { cursor: "grabbing" },
              "&:hover": { backgroundColor: "#FFFFFF" },
            }}
          >
            <IoMoveSharp style={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      ) : (
        <span />
      )}

      <Box
        component="div"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          pointerEvents: "auto",
        }}
      >
        {canEdit && hasImage && (
          <MediaElementCardIconBtns optionID={optionID} />
        )}

        {canDelete && (
          <Tooltip title="Delete option">
            <IconButton
              tabIndex={-1}
              size="small"
              onClick={onDelete}
              sx={{
                width: 30,
                height: 30,
                color: "#B42318",
                backgroundColor: "rgba(255,255,255,0.94)",
                boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
                "&:hover": {
                  backgroundColor: "#FFFFFF",
                  color: "#912018",
                },
              }}
            >
              <ClearIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

export default MediaOptionActions;