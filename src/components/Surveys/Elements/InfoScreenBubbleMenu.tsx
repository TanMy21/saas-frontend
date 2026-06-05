import { Box, IconButton } from "@mui/material";
import { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { Bold, Italic, Quote, Underline } from "lucide-react";

export const InfoScreenBubbleMenu = ({
  editor,
  canEditQuestion,
}: {
  editor: Editor | null;
  canEditQuestion: boolean;
}) => {
  if (!editor || !canEditQuestion) return null;

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 120 }}
      shouldShow={({ editor }) => {
        return !editor.state.selection.empty;
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 0.5,
          alignItems: "center",
          bgcolor: "#0F172A",
          color: "#FFFFFF",
          borderRadius: 2,
          p: 0.5,
          boxShadow: "0 12px 30px rgba(15,23,42,0.22)",
        }}
      >
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleBold().run()}
          sx={{ color: editor.isActive("bold") ? "#FACC15" : "#FFFFFF" }}
        >
          <Bold size={15} />
        </IconButton>

        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          sx={{ color: editor.isActive("italic") ? "#FACC15" : "#FFFFFF" }}
        >
          <Italic size={15} />
        </IconButton>

        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          sx={{ color: editor.isActive("underline") ? "#FACC15" : "#FFFFFF" }}
        >
          <Underline size={15} />
        </IconButton>

        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          sx={{ color: editor.isActive("blockquote") ? "#FACC15" : "#FFFFFF" }}
        >
          <Quote size={15} />
        </IconButton>
      </Box>
    </BubbleMenu>
  );
};
