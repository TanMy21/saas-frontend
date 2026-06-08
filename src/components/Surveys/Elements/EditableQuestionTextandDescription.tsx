import { useEffect } from "react";

import { Box } from "@mui/material";
import { Link } from "@tiptap/extension-link";
import { TextAlign } from "@tiptap/extension-text-align";
import { Color, TextStyle } from "@tiptap/extension-text-style";
import { Underline as ul } from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { StarterKit } from "@tiptap/starter-kit";
import { Bold, Italic, Underline, X } from "lucide-react";

import useAuth from "../../../hooks/useAuth";
import { EditableQuestionTextProps } from "../../../types/surveyBuilderTypes";

import { ToolbarButton } from "./ToolbarButton";

export const EditableQuestionText = ({
  active,
  value,
  placeholder = "Type here...",
  onStartEdit,
  onChange,
  onFormatted,
  onKeyDown,
  editorSx,
}: EditableQuestionTextProps) => {
  const { can } = useAuth();
  const canEditQuestion = can("UPDATE_QUESTION");

  const editor = useEditor({
    editable: active,
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
      }),

      ul,
      TextStyle,
      Color.configure({
        types: ["textStyle"],
      }),

      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),

      TextAlign.configure({
        types: ["paragraph"],
        alignments: ["left", "center", "right"],
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: "question-tiptap-editor",
      },

      handleKeyDown: (_view, event) => {
        if (event.key === "Escape" || event.key === "Enter") {
          onKeyDown?.(event as unknown as React.KeyboardEvent);
          return true;
        }

        return false;
      },
    },

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },

    onSelectionUpdate: () => {
      if (active) onFormatted();
    },
  });

  useEffect(() => {
    if (!editor) return;

    const currentHTML = editor.getHTML();
    const nextHTML = value || "";

    if (currentHTML !== nextHTML) {
      editor.commands.setContent(nextHTML, {
        emitUpdate: false, // Prevents onUpdate from firing again while syncing external value.
      });
    }
  }, [editor, value]);

  useEffect(() => {
    if (!editor) return;

    editor.setEditable(active);
  }, [editor, active]);

  if (!editor) return null;

  return (
    <Box
      onClick={(e) => {
        e.stopPropagation();
        onStartEdit();
      }}
      sx={{
        cursor: active ? "text" : "pointer",
        "& .question-tiptap-editor": {
          outline: "none",
          minHeight: "1.2em",

          width: "100%",
          minWidth: 0,

          overflowWrap: "break-word",
          wordBreak: "break-word",
          whiteSpace: "pre-wrap",

          ...editorSx,
        },
        "& .question-tiptap-editor p": {
          margin: 0,
          overflowWrap: "break-word",
          wordBreak: "break-word",
          textAlign: "inherit",
        },
        "& .question-tiptap-editor a": {
          color: "inherit",
          textDecoration: "underline",
        },
        "& .question-tiptap-editor.is-editor-empty:first-of-type::before": {
          content: `"${placeholder}"`,
          color: "rgba(0,0,0,0.35)",
          float: "left",
          height: 0,
          pointerEvents: "none",
        },
        "& .question-tiptap-editor .tiptap": {
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          overflowWrap: "break-word",
          wordBreak: "break-word",
          whiteSpace: "pre-wrap",
        },

        "& .question-tiptap-editor .tiptap p": {
          margin: 0,
          overflowWrap: "break-word",
          wordBreak: "break-word",
          textAlign: "inherit",
        },
      }}
    >
      {active && canEditQuestion && (
        <BubbleMenu editor={editor}>
          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              p: 0.5,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1.5,
              boxShadow: 3,
            }}
          >
            <ToolbarButton
              title="Bold"
              disabled={!editor || !canEditQuestion}
              active={editor?.isActive("bold")}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold size={24} />
            </ToolbarButton>

            <ToolbarButton
              title="Italic"
              disabled={!editor || !canEditQuestion}
              active={editor?.isActive("italic")}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic size={24} />
            </ToolbarButton>

            <ToolbarButton
              title="Underline"
              disabled={!editor || !canEditQuestion}
              active={editor?.isActive("underline")}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              <Underline size={24} />
            </ToolbarButton>

            <input
              type="color"
              onInput={(event) => {
                const color = (event.target as HTMLInputElement).value;

                editor.chain().focus().setColor(color).run();
              }}
              style={{
                width: 32,
                height: 32,
                padding: "1px",
                border: "1px solid #CBD5E1",
                borderRadius: "4px",
                backgroundColor: "#FFFFFF",
                cursor: "pointer",
              }}
            />

            <ToolbarButton
              title="Clear color"
              disabled={!editor || !canEditQuestion}
              onClick={() => editor.chain().focus().unsetColor().run()}
            >
              <X size={24} />
            </ToolbarButton>
          </Box>
        </BubbleMenu>
      )}

      <EditorContent editor={editor} />
    </Box>
  );
};
