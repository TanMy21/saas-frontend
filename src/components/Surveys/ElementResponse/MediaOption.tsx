import { useState } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box } from "@mui/material";

import useMediaOptionEditor from "../../../hooks/useMediaOptionEditor";
import { MediaOptionProps } from "../../../utils/types";
import MediaElementImageUploadModal from "../../Modals/MediaElementImageUploadModal";

import EditableMediaOptionLabel from "./EditableMediaOptionLabel";
import MediaOptionActions from "./MediaOptionActions";
import MediaOptionThumbnail from "./MediaOptionThumbnail";

const MediaOption = ({ option, isSelected, onSelect }: MediaOptionProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: option.optionID });

  const editor = useMediaOptionEditor(option);

  const [isHovered, setIsHovered] = useState(false);
  const [uploadImageModalOpen, setUploadImageModalOpen] = useState(false);

  const imageSrc = option.image || null;

  const selectOrAddImage = () => {
    onSelect();

    if (!imageSrc && editor.canEdit) {
      setUploadImageModalOpen(true);
    }
  };

  return (
    <Box
      component="div"
      ref={setNodeRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: "relative",
        zIndex: transform ? 10 : "auto",
        transform: CSS.Transform.toString(transform),
        transition: transition ?? "transform 180ms ease",
        touchAction: "none",
        minWidth: 0,
        boxShadow: transform ? "0 8px 20px rgba(0, 0, 0, 0.12)" : "none",
      }}
    >
      <Box
        component="div"
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "1 / 1",
        }}
      >
        <MediaOptionThumbnail
          imageSrc={imageSrc}
          label={option.value}
          canEdit={editor.canEdit}
          isSelected={isSelected}
          onClick={selectOrAddImage}
        />

        <MediaOptionActions
          visible={isHovered}
          canReorder={editor.canReorder}
          canEdit={editor.canEdit}
          canDelete={editor.canDelete}
          hasImage={Boolean(imageSrc)}
          optionID={option.optionID}
          dragAttributes={attributes}
          dragListeners={listeners}
          onDelete={() => void editor.deleteChoice()}
        />
      </Box>

      {editor.canEdit && (
        <MediaElementImageUploadModal
          uploadImageModalOpen={uploadImageModalOpen}
          setUploadImageModalOpen={setUploadImageModalOpen}
          optionID={option.optionID}
        />
      )}

      <EditableMediaOptionLabel
        label={option.value}
        draftLabel={editor.draftLabel}
        isEditing={editor.isEditingLabel}
        error={editor.labelError}
        canEdit={editor.canEdit}
        inputRef={editor.inputRef}
        onStartEditing={editor.startEditingLabel}
        onChange={editor.changeDraftLabel}
        onSave={() => void editor.saveLabel()}
        onCancel={editor.cancelLabelEdit}
      />
    </Box>
  );
};
export default MediaOption;
