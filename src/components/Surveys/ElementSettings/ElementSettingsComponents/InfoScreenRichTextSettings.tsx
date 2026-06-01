import { useEffect, useRef, useState } from "react";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  IconButton,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import TiptapImage from "@tiptap/extension-image";
import TiptapLink from "@tiptap/extension-link";
import { TextAlign } from "@tiptap/extension-text-align";
import {
  Color,
  FontFamily,
  FontSize,
  TextStyle,
} from "@tiptap/extension-text-style";
import TiptapUnderline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Image,
  Italic,
  List,
  ListOrdered,
  Quote,
  Save,
  Underline,
  X,
} from "lucide-react";

import {
  useSyncEditorImagesMutation,
  useUpdateScreenElementsMutation,
  useUploadEditorImageMutation,
} from "../../../../app/slices/elementApiSlice";
import { updateQuestionField } from "../../../../app/slices/elementSlice";
import { RootState, useAppDispatch } from "../../../../app/store";
import { useAppSelector } from "../../../../app/typedReduxHooks";
import { usePermission } from "../../../../context/PermissionContext";
import { useToast } from "../../../../hooks/useToast";
import { InfoScreenRichTextSettingsProps } from "../../../../types/surveyBuilderTypes";
import {
  RICH_TEXT_FONT_FAMILY_OPTIONS,
  RICH_TEXT_FONT_SIZE_OPTIONS,
} from "../../../../utils/constants";
import {
  extractUsedEditorImageIDs,
  sanitizeRichTextHtml,
} from "../../../../utils/richTextUtils";
import { showToast } from "../../../../utils/showToast";

const ToolbarButton = ({
  title,
  active,
  disabled,
  onClick,
  children,
}: {
  title: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => {
  return (
    <Tooltip title={title}>
      <span>
        <IconButton
          size="small"
          disabled={disabled}
          onClick={onClick}
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1.5,
            color: active ? "#FFFFFF" : "#475569",
            bgcolor: active ? "#475569" : "transparent",
            "&:hover": {
              bgcolor: active ? "#334155" : "#F1F5F9",
            },
          }}
        >
          {children}
        </IconButton>
      </span>
    </Tooltip>
  );
};

export const InfoScreenRichTextSettings = ({
  qID,
}: InfoScreenRichTextSettingsProps) => {
  const { canEditQuestion } = usePermission();
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();

  const question = useAppSelector(
    (state: RootState) => state.question.selectedQuestion,
  );

  const questionID = qID || question?.questionID;
  const initialHtml = question?.description || "";

  const [formTouched, setFormTouched] = useState(false);

  const [updateScreenElements, { isLoading: isSaving }] =
    useUpdateScreenElementsMutation();

  const [
    uploadEditorImage,
    { isLoading: isUploadingEditorImage, isError, error },
  ] = useUploadEditorImageMutation();

  const [syncEditorImages] = useSyncEditorImagesMutation();

  const EditorImage = TiptapImage.extend({
    addAttributes() {
      return {
        ...this.parent?.(),

        editorImageID: {
          default: null,
          parseHTML: (element) => element.getAttribute("data-editor-image-id"),
          renderHTML: (attributes) => {
            if (!attributes.editorImageID) return {};

            return {
              "data-editor-image-id": attributes.editorImageID,
            };
          },
        },

        publicId: {
          default: null,
          parseHTML: (element) => element.getAttribute("data-public-id"),
          renderHTML: (attributes) => {
            if (!attributes.publicId) return {};

            return {
              "data-public-id": attributes.publicId,
            };
          },
        },
      };
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      FontFamily,
      FontSize,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right"],
        defaultAlignment: "left",
      }),
      TiptapUnderline,
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      EditorImage.configure({
        inline: false,
        allowBase64: false,
      }),
    ],
    content: initialHtml,
    onUpdate: () => {
      if (!canEditQuestion) return;

      const sanitizedHtml = sanitizeRichTextHtml(editor.getHTML());

      dispatch(
        updateQuestionField({
          key: "description",
          value: sanitizedHtml,
        }),
      );

      setFormTouched(true);
    },
  });

  // keep editor content in sync with question description when question changes or when question is loaded
  useEffect(() => {
    if (!editor) return;

    const currentHtml = editor.getHTML();

    if (initialHtml !== currentHtml) {
      editor.commands.setContent(initialHtml || "", {
        emitUpdate: false,
      });
    }
  }, [editor, initialHtml, questionID]);

  const handleSaveRichText = async () => {
    if (!editor || !canEditQuestion || !questionID) return;

    try {
      const sanitizedHtml = sanitizeRichTextHtml(editor.getHTML());

      await updateScreenElements({
        questionID,
        description: sanitizedHtml,
      }).unwrap();

      const usedEditorImageIDs = extractUsedEditorImageIDs(sanitizedHtml);

      await syncEditorImages({
        questionID,
        usedEditorImageIDs,
      }).unwrap();

      setFormTouched(false);
      showToast.success("Info content saved.");
    } catch (error) {
      console.error("Info screen rich text save error:", error);
      showToast.error("Failed to save info content.");
    }
  };

  const handleUploadAndInsertImage = async (file: File) => {
    if (!editor || !questionID) return;

    try {
      const formData = new FormData();
      formData.append("imgFile", file);

      const result = await uploadEditorImage({
        formData,
        questionID,
      }).unwrap();

      const uploadedUrl = result?.imageUrl;
      const editorImageID = result?.editorImageID;
      const publicId = result?.publicId;

      if (!uploadedUrl || !editorImageID || !publicId) {
        showToast.error("Image uploaded, but required metadata was missing.");
        return;
      }

      editor
        .chain()
        .focus()
        .setImage({ src: uploadedUrl })
        .updateAttributes("image", {
          editorImageID,
          publicId,
        })
        .run();

      setFormTouched(true);
    } catch (error) {
      console.error("Info screen image upload error:", error);
      showToast.error("Failed to upload image.");
    }
  };

  useToast({
    isError,
    error,
    errorFallbackMessage: "Failed to upload image.",
  });

  return (
    <Accordion
      defaultExpanded
      disableGutters
      elevation={0}
      square
      sx={{
        width: "100%",
        m: "0 !important",
        backgroundColor: "#FFFFFF",
        borderTop: 0,
        borderBottom: "1px solid #E0E0E0",
        borderRadius: 0,
        boxShadow: "none",
        "&:before": {
          display: "none",
        },
        "&.Mui-expanded": {
          m: "0 !important",
        },
        "& .MuiAccordionSummary-root": {
          minHeight: 48,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        },
        "& .MuiAccordionSummary-root.Mui-expanded": {
          minHeight: 48,
        },
        "& .MuiAccordionSummary-content": {
          my: 1.5,
        },
        "& .MuiAccordionSummary-content.Mui-expanded": {
          my: 1.5,
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ChevronDown />}
        aria-controls="info-screen-rich-text-content"
        id="info-screen-rich-text-header"
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            fontWeight: 500,
            color: "#453F46",
          }}
        >
          <Image style={{ color: "#475569", fontSize: 20 }} />
          <Typography>Info content</Typography>
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ px: { md: 1, xl: 1 }, pb: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Box
            sx={{
              position: "sticky",
              top: 12,
              zIndex: 5,
              display: "flex",
              flexWrap: "wrap",
              gap: 0.75,
              border: "1px solid #E2E8F0",
              borderRadius: 2,
              p: 1,
              bgcolor: "#F8FAFC",
              boxShadow: "0 6px 14px rgba(15,23,42,0.06)",
            }}
          >
            <ToolbarButton
              title="Bold"
              disabled={!editor}
              active={editor?.isActive("bold")}
              onClick={() => editor?.chain().focus().toggleBold().run()}
            >
              <Bold size={16} />
            </ToolbarButton>

            <ToolbarButton
              title="Italic"
              disabled={!editor}
              active={editor?.isActive("italic")}
              onClick={() => editor?.chain().focus().toggleItalic().run()}
            >
              <Italic size={16} />
            </ToolbarButton>

            <ToolbarButton
              title="Underline"
              disabled={!editor}
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
                setFormTouched(true);
              }}
              sx={{
                height: 32,
                minWidth: 112,
                fontSize: 12,
                bgcolor: "#FFFFFF",
                "& .MuiSelect-select": {
                  py: 0.5,
                },
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
                setFormTouched(true);
              }}
              sx={{
                height: 32,
                minWidth: 74,
                fontSize: 12,
                bgcolor: "#FFFFFF",
                "& .MuiSelect-select": {
                  py: 0.5,
                },
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
                    editor
                      ?.chain()
                      .focus()
                      .setColor(event.currentTarget.value)
                      .run();
                    setFormTouched(true);
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
              disabled={!editor}
              active={editor?.isActive({ textAlign: "left" })}
              onClick={() => {
                editor?.chain().focus().setTextAlign("left").run();
                setFormTouched(true);
              }}
            >
              <AlignLeft size={16} />
            </ToolbarButton>

            <ToolbarButton
              title="Align center"
              disabled={!editor}
              active={editor?.isActive({ textAlign: "center" })}
              onClick={() => {
                editor?.chain().focus().setTextAlign("center").run();
                setFormTouched(true);
              }}
            >
              <AlignCenter size={16} />
            </ToolbarButton>

            <ToolbarButton
              title="Align right"
              disabled={!editor}
              active={editor?.isActive({ textAlign: "right" })}
              onClick={() => {
                editor?.chain().focus().setTextAlign("right").run();
                setFormTouched(true);
              }}
            >
              <AlignRight size={16} />
            </ToolbarButton>

            <Divider orientation="vertical" flexItem />

            <ToolbarButton
              title="Bullet list"
              disabled={!editor}
              active={editor?.isActive("bulletList")}
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
            >
              <List size={16} />
            </ToolbarButton>

            <ToolbarButton
              title="Numbered list"
              disabled={!editor}
              active={editor?.isActive("orderedList")}
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            >
              <ListOrdered size={16} />
            </ToolbarButton>

            <ToolbarButton
              title="Quote"
              disabled={!editor}
              active={editor?.isActive("blockquote")}
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            >
              <Quote size={16} />
            </ToolbarButton>

            <Divider orientation="vertical" flexItem />

            <ToolbarButton
              title={
                isUploadingEditorImage ? "Uploading image..." : "Upload image"
              }
              disabled={!editor || !canEditQuestion || isUploadingEditorImage}
              onClick={() => imageInputRef.current?.click()}
            >
              <Image size={16} />
            </ToolbarButton>

            <input
              ref={imageInputRef}
              hidden
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (!file) return;
                await handleUploadAndInsertImage(file);
              }}
            />

            <Divider orientation="vertical" flexItem />

            <ToolbarButton
              title="Clear formatting"
              disabled={!editor}
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
              onClick={handleSaveRichText}
            >
              <Save size={16} />
            </ToolbarButton>
          </Box>

          {/* Save status here */}
          <Typography
            sx={{
              fontSize: 12,
              color: formTouched ? "#B45309" : "#64748B",
              textAlign: "right",
            }}
          >
            {formTouched ? "Unsaved changes" : "Content saved"}
          </Typography>

          <Box
            sx={{
              border: "1px solid #E2E8F0",
              borderRadius: 2,
              minHeight: 220,
              p: 1.5,
              bgcolor: canEditQuestion ? "#FFFFFF" : "#F8FAFC",
              opacity: canEditQuestion ? 1 : 0.7,
              "& .ProseMirror": {
                minHeight: 190,
                outline: "none",
                fontSize: 14,
                lineHeight: 1.7,
                color: "#0F172A",
                paddingBottom: "64px",
              },
              "& .ProseMirror p": {
                margin: "0 0 10px",
              },
              "& .ProseMirror img": {
                maxWidth: "100%",
                maxHeight: "300px",
                height: "auto",
                borderRadius: "12px",
                margin: "12px 0",
              },
              "& .ProseMirror blockquote": {
                borderLeft: "4px solid #CBD5E1",
                margin: "12px 0",
                padding: "8px 12px",
                color: "#475569",
                backgroundColor: "#F8FAFC",
                borderRadius: "8px",
              },
            }}
          >
            <EditorContent editor={editor} />
          </Box>
          {/* Save status here */}
          <Typography
            sx={{
              fontSize: 12,
              color: formTouched ? "#B45309" : "#64748B",
              textAlign: "right",
            }}
          >
            {formTouched ? "Unsaved changes" : "Content saved"}
          </Typography>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
