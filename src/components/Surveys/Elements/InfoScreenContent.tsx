import { useEffect, useMemo, useRef, useState } from "react";

import { Box } from "@mui/material";
import { DragHandle } from "@tiptap/extension-drag-handle";
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
import { Placeholder } from "@tiptap/extensions";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";

import {
  useSyncEditorImagesMutation,
  useUpdateScreenElementsMutation,
  useUploadQuestionImageMutation,
} from "../../../app/slices/elementApiSlice";
import { updateQuestionField } from "../../../app/slices/elementSlice";
import { RootState } from "../../../app/store";
import { useAppDispatch, useAppSelector } from "../../../app/typedReduxHooks";
import useAuth from "../../../hooks/useAuth";
import { useToast } from "../../../hooks/useToast";
import {
  extractUsedEditorImageIDs,
  sanitizeInfoScreenContentHtml,
} from "../../../utils/richTextUtils";
import { showToast } from "../../../utils/showToast";
import { ElementProps } from "../../../utils/types";
import SettingSaveStatus from "../ElementSettings/ElementSettingsComponents/SettingSaveStatus";

import { InfoScreenEditorToolbar } from "./InfoScreenEditorToolbar";

export const InfoScreenContent = ({ qID, display }: ElementProps) => {
  const isMobile = display === "mobile";
  const { can } = useAuth();
  const canEditQuestion = can("UPDATE_QUESTION");
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const lastSavedHtmlRef = useRef<string>("");
  const baselineQuestionIDRef = useRef<string | undefined>(undefined);
  const isContentUpdateRef = useRef(false);
  const dispatch = useAppDispatch();

  const question = useAppSelector(
    (state: RootState) => state.question.selectedQuestion,
  );

  const questionID = qID || question?.questionID;
  const initialHtml =
    question?.questionID === questionID ? question?.description || "" : "";

  const [formTouched, setFormTouched] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "saved" | "dirty" | "saving" | "error"
  >("saved");

  const [updateScreenElements, { isLoading: isSaving }] =
    useUpdateScreenElementsMutation();

  const [
    uploadQuestionImage,
    { isLoading: isUploadingEditorImage, isError, error },
  ] = useUploadQuestionImageMutation();

  const [syncEditorImages] = useSyncEditorImagesMutation();

  const EditorImage = useMemo(
    () =>
      TiptapImage.extend({
        addAttributes() {
          return {
            ...this.parent?.(),

            editorImageID: {
              default: null,
              parseHTML: (element) =>
                element.getAttribute("data-editor-image-id"),
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
      }),
    [],
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      FontFamily,
      FontSize,

      Placeholder.configure({
        placeholder:
          "Add instructions, context, images, or details for participants...",
        emptyEditorClass: "is-editor-empty",
      }),
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

      ...(isMobile
        ? []
        : [
            DragHandle.configure({
              render: () => {
                const element = document.createElement("div");
                element.innerHTML = "⋮⋮";
                element.style.cursor = "grab";
                element.style.fontSize = "14px";
                element.style.color = "#94A3B8";
                element.style.padding = "2px 4px";
                element.style.borderRadius = "6px";
                element.style.background = "#F8FAFC";
                element.style.border = "1px solid #E2E8F0";
                return element;
              },
            }),
          ]),
    ],
    content: initialHtml,
    editable: canEditQuestion && !isMobile,
    onUpdate: ({ editor }) => {
      if (!canEditQuestion || isMobile) return;

      if (isContentUpdateRef.current) return;

      const sanitizedHtml = sanitizeInfoScreenContentHtml(editor.getHTML());

      if (baselineQuestionIDRef.current !== questionID) return;

      const hasUnsavedChanges = sanitizedHtml !== lastSavedHtmlRef.current;

      dispatch(
        updateQuestionField({
            questionID,
          key: "description",
          value: sanitizedHtml,
        }),
      );

      setFormTouched(hasUnsavedChanges);
      setSaveStatus(hasUnsavedChanges ? "dirty" : "saved");
    },
  });

  /**
   * Saves current editor HTML and removes uploaded editor images that are no longer used.
   */
  const handleSaveRichText = async () => {
    if (!editor || !canEditQuestion || !questionID) return;

    try {
      setSaveStatus("saving");
      const sanitizedHtml = sanitizeInfoScreenContentHtml(editor.getHTML());

      await updateScreenElements({
        questionID,
        description: sanitizedHtml,
      }).unwrap();

      const usedEditorImageIDs = extractUsedEditorImageIDs(sanitizedHtml);

      await syncEditorImages({
        questionID,
        usedQuestionImageIDs: usedEditorImageIDs,
      }).unwrap();

      lastSavedHtmlRef.current = sanitizedHtml;

      dispatch(
        updateQuestionField({
            questionID,
          key: "description",
          value: sanitizedHtml,
        }),
      );

      setFormTouched(false);
      showToast.success("Info content saved.");
      setSaveStatus("saved");
    } catch (error) {
      console.error("Info screen rich text save error:", error);
      showToast.error("Failed to save info content.");
    }
  };

  /**
   * Uploads one inline editor image and inserts it into the editor at the cursor.
   */
  const handleUploadAndInsertImage = async (file: File) => {
    if (!editor || !questionID) return;

    try {
      const formData = new FormData();
      formData.append("imgFile", file);

      const result = await uploadQuestionImage({
        questionID,
        role: "INFO_SCREEN_INLINE",
        formData,
      }).unwrap();

      const uploadedUrl = result?.imageUrl;
      const questionImageID = result?.questionImageID;
      const publicId = result?.publicId;

      if (!uploadedUrl || !questionImageID || !publicId) {
        showToast.error("Image uploaded, but required metadata was missing.");
        return;
      }

      editor
        .chain()
        .focus()
        .insertContent({
          type: "image",
          attrs: {
            src: uploadedUrl,
            editorImageID: questionImageID,
            publicId,
          },
        })
        .run();

      const sanitizedHtml = sanitizeInfoScreenContentHtml(editor.getHTML());

      dispatch(
        updateQuestionField({
            questionID,
          key: "description",
          value: sanitizedHtml,
        }),
      );

      setFormTouched(true);
      setSaveStatus("dirty");
    } catch (error) {
      console.error("Info screen image upload error:", error);
      showToast.error("Failed to upload image.");
    }
  };

  useEffect(() => {
    if (!questionID || question?.questionID !== questionID) return;

    if (baselineQuestionIDRef.current === questionID) return;

    lastSavedHtmlRef.current = sanitizeInfoScreenContentHtml(initialHtml);

    baselineQuestionIDRef.current = questionID;
    setFormTouched(false);
    setSaveStatus("saved");
  }, [questionID, question?.questionID, initialHtml]);

  /**
   * Keeps editor content synced when switching selected question.
   */

  useEffect(() => {
    if (!editor) return;

    const currentHtml = editor.getHTML();

    if (formTouched) {
      editor.setEditable(canEditQuestion && !isMobile);
      return;
    }

    if (lastSavedHtmlRef.current && initialHtml !== lastSavedHtmlRef.current) {
      editor.setEditable(canEditQuestion && !isMobile);
      return;
    }

    if (initialHtml !== currentHtml) {
      isContentUpdateRef.current = true;

      editor.commands.setContent(initialHtml || "", {
        emitUpdate: false,
      });

      queueMicrotask(() => {
        isContentUpdateRef.current = false;
      });
    }
    editor.setEditable(canEditQuestion && !isMobile);
  }, [editor, initialHtml, questionID, formTouched, canEditQuestion, isMobile]);

  useToast({
    isError,
    error,
    errorFallbackMessage: "Failed to upload image.",
  });

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        mt: 3,
      }}
    >
      <Box
        sx={{
          width: "92%",
          maxWidth: 980,
          borderRadius: 4,
          px: isMobile ? 2.25 : 4,
          py: isMobile ? 2.5 : 4,
        }}
      >
        {!isMobile && (
          <InfoScreenEditorToolbar
            editor={editor}
            canEditQuestion={canEditQuestion}
            formTouched={formTouched}
            isSaving={isSaving}
            isUploadingEditorImage={isUploadingEditorImage}
            onUploadImageClick={() => imageInputRef.current?.click()}
            onSave={handleSaveRichText}
          />
        )}

        {!isMobile && (
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
        )}

        {!isMobile && (
          <Box
            sx={{
              position: "sticky",
              top: 68,
              zIndex: 7,
              display: "flex",
              justifyContent: "flex-end",
              mb: 1,
              py: 0.5,
            }}
          >
            <SettingSaveStatus state={isSaving ? "saving" : saveStatus} />
          </Box>
        )}

        <Box
          sx={{
            p: isMobile ? 2 : 3,
            minHeight: isMobile ? 260 : 360,
            opacity: canEditQuestion ? 1 : 0.72,
            "& .ProseMirror": {
              minHeight: isMobile ? 220 : 320,
              outline: "none",
              color: "#0F172A",
              fontSize: 16,
              lineHeight: 1.7,
            },

            "& .ProseMirror p": {
              margin: "0 0 12px",
            },

            "& .ProseMirror h1": {
              fontSize: isMobile ? 26 : 32,
              lineHeight: 1.2,
              margin: "0 0 16px",
              fontWeight: 900,
            },

            "& .ProseMirror h2": {
              fontSize: isMobile ? 22 : 26,
              lineHeight: 1.25,
              margin: "0 0 14px",
              fontWeight: 900,
            },

            "& .ProseMirror h3": {
              fontSize: isMobile ? 18 : 22,
              lineHeight: 1.3,
              margin: "0 0 12px",
              fontWeight: 800,
            },

            "& .ProseMirror ul, & .ProseMirror ol": {
              paddingLeft: "1.4rem",
              margin: "0 0 14px",
            },

            "& .ProseMirror li": {
              marginBottom: "6px",
            },

            "& .ProseMirror li p": {
              margin: 0,
            },

            "& .ProseMirror blockquote": {
              borderLeft: "4px solid #CBD5E1",
              margin: "12px 0",
              padding: "8px 12px",
              color: "#475569",
              backgroundColor: "#F8FAFC",
              borderRadius: "8px",
            },

            "& .ProseMirror p.is-editor-empty:first-of-type::before": {
              content: `"Add instructions, context, images, or details for participants..."`,
              color: "#94A3B8",
              float: "left",
              height: 0,
              pointerEvents: "none",
            },

            "& .ProseMirror img": {
              display: "block",
              maxWidth: "100%",
              maxHeight: "300px",
              height: "auto",
              borderRadius: "16px",
              margin: "16px auto",
              boxShadow: "0 12px 30px rgba(15,23,42,0.12)",
            },

            "& .ProseMirror strong": {
              fontWeight: 800,
            },

            "& .ProseMirror a": {
              color: "#2563EB",
              textDecoration: "underline",
              fontWeight: 600,
            },
          }}
        >
          <EditorContent editor={editor} />
        </Box>
      </Box>
    </Box>
  );
};
