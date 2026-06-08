import {
  Box,
  Divider, 
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Image,
  List,
  ListOrdered,
  Quote,
  Save,
  Underline,
  X,
} from "lucide-react";

import {
  RICH_TEXT_FONT_FAMILY_OPTIONS,
  RICH_TEXT_FONT_SIZE_OPTIONS,
} from "../../../utils/constants";
import { ToolbarButton } from "./ToolbarButton";


export const InfoScreenEditorToolbar = ({
  editor,
  canEditQuestion,
  formTouched,
  isSaving,
  isUploadingEditorImage,
  onUploadImageClick,
  onSave,
}: {
  editor: Editor | null;
  canEditQuestion: boolean;
  formTouched: boolean;
  isSaving: boolean;
  isUploadingEditorImage: boolean;
  onUploadImageClick: () => void;
  onSave: () => void;
}) => {
  return (
    <Box
      sx={{
        position: "sticky",
        top: 12,
        zIndex: 8,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 0.75,
        border: "1px solid #E2E8F0",
        borderRadius: 2,
        p: 1,
        mb: 1.25,
        bgcolor: "#F8FAFC",
        boxShadow: "0 8px 20px rgba(15,23,42,0.08)",
      }}
    >
      <ToolbarButton
        title="Bold"
        disabled={!editor || !canEditQuestion}
        active={editor?.isActive("bold")}
        onClick={() => editor?.chain().focus().toggleBold().run()}
      >
        <Bold size={16} />
      </ToolbarButton>

      <ToolbarButton
        title="Italic"
        disabled={!editor || !canEditQuestion}
        active={editor?.isActive("italic")}
        onClick={() => editor?.chain().focus().toggleItalic().run()}
      >
        <Italic size={16} />
      </ToolbarButton>

      <ToolbarButton
        title="Underline"
        disabled={!editor || !canEditQuestion}
        active={editor?.isActive("underline")}
        onClick={() => editor?.chain().focus().toggleUnderline().run()}
      >
        <Underline size={16} />
      </ToolbarButton>

      <Divider orientation="vertical" flexItem />

      <Select
        size="small"
        value={editor?.getAttributes("textStyle").fontFamily || "Inter"}
        disabled={!editor || !canEditQuestion}
        onChange={(event) => {
          editor?.chain().focus().setFontFamily(event.target.value).run();
        }}
        sx={{
          height: 32,
          minWidth: 112,
          fontSize: 12,
          bgcolor: "#FFFFFF",
          "& .MuiSelect-select": { py: 0.5 },
        }}
      >
        {RICH_TEXT_FONT_FAMILY_OPTIONS.map((font) => (
          <MenuItem key={font.value} value={font.value}>
            {font.label}
          </MenuItem>
        ))}
      </Select>

      <Select
        size="small"
        value={editor?.getAttributes("textStyle").fontSize || "16px"}
        disabled={!editor || !canEditQuestion}
        onChange={(event) => {
          editor?.chain().focus().setFontSize(event.target.value).run();
        }}
        sx={{
          height: 32,
          minWidth: 74,
          fontSize: 12,
          bgcolor: "#FFFFFF",
          "& .MuiSelect-select": { py: 0.5 },
        }}
      >
        {RICH_TEXT_FONT_SIZE_OPTIONS.map((size) => (
          <MenuItem key={size.value} value={size.value}>
            {size.label}
          </MenuItem>
        ))}
      </Select>

      <Tooltip title="Text color">
        <span>
          <Box
            component="input"
            type="color"
            disabled={!editor || !canEditQuestion}
            value={editor?.getAttributes("textStyle").color || "#0F172A"}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              editor?.chain().focus().setColor(event.currentTarget.value).run();
            }}
            sx={{
              width: 32,
              height: 32,
              p: 0.25,
              border: "1px solid #CBD5E1",
              borderRadius: 1.5,
              bgcolor: "#FFFFFF",
              cursor: canEditQuestion ? "pointer" : "not-allowed",
            }}
          />
        </span>
      </Tooltip>

      <Divider orientation="vertical" flexItem />

      <ToolbarButton
        title="Align left"
        disabled={!editor || !canEditQuestion}
        active={editor?.isActive({ textAlign: "left" })}
        onClick={() => editor?.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft size={16} />
      </ToolbarButton>

      <ToolbarButton
        title="Align center"
        disabled={!editor || !canEditQuestion}
        active={editor?.isActive({ textAlign: "center" })}
        onClick={() => editor?.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter size={16} />
      </ToolbarButton>

      <ToolbarButton
        title="Align right"
        disabled={!editor || !canEditQuestion}
        active={editor?.isActive({ textAlign: "right" })}
        onClick={() => editor?.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight size={16} />
      </ToolbarButton>

      <Divider orientation="vertical" flexItem />

      <ToolbarButton
        title="Bullet list"
        disabled={!editor || !canEditQuestion}
        active={editor?.isActive("bulletList")}
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
      >
        <List size={16} />
      </ToolbarButton>

      <ToolbarButton
        title="Numbered list"
        disabled={!editor || !canEditQuestion}
        active={editor?.isActive("orderedList")}
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={16} />
      </ToolbarButton>

      <ToolbarButton
        title="Quote"
        disabled={!editor || !canEditQuestion}
        active={editor?.isActive("blockquote")}
        onClick={() => editor?.chain().focus().toggleBlockquote().run()}
      >
        <Quote size={16} />
      </ToolbarButton>

      <Divider orientation="vertical" flexItem />

      <ToolbarButton
        title={isUploadingEditorImage ? "Uploading image..." : "Upload image"}
        disabled={!editor || !canEditQuestion || isUploadingEditorImage}
        onClick={onUploadImageClick}
      >
        <Image size={16} />
      </ToolbarButton>

      <ToolbarButton
        title="Clear formatting"
        disabled={!editor || !canEditQuestion}
        onClick={() =>
          editor?.chain().focus().clearNodes().unsetAllMarks().run()
        }
      >
        <X size={16} />
      </ToolbarButton>

      <Divider orientation="vertical" flexItem />

      <ToolbarButton
        title={formTouched ? "Save content" : "Content saved"}
        disabled={!editor || !canEditQuestion || !formTouched || isSaving}
        onClick={onSave}
      >
        <Save size={16} />
      </ToolbarButton>
    </Box>
  );
};
