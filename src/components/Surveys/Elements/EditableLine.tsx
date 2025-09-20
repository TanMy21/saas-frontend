import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Box, IconButton, Typography } from "@mui/material";

import {
  getSelectionIn,
  insertPlainTextAtSelection,
  isEmptyHTML,
  selectionFullyInsideTag,
  selectionHasTag,
  unwrapSelectionTag,
  wrapSelectionWithTag,
} from "../../../utils/richTextUtils";
import { EditableLineProps } from "../../../utils/types";

export function EditableLine({
  active,
  value,
  placeholder,
  onStartEdit,
  onChange,
  onKeyDown,
  textFieldId,
  typographySx,
  textFieldSx,
  cursorWhenActive = "text",
  contentKey,
}: EditableLineProps) {
  const containerRef = useRef<HTMLDivElement>(null); // common root (view + edit)
  const editableRef = useRef<HTMLDivElement>(null); // edit node
  const displayRef = useRef<HTMLDivElement>(null); // view node
  const lastContentKeyRef = useRef<EditableLineProps["contentKey"]>(undefined);

  const [html, setHtml] = useState<string>(value || "");
  const [showBar, setShowBar] = useState(false);
  const [barPos, setBarPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  // Keep state in sync with external value, but avoid clobbering while active
  useEffect(() => {
    if (!active) setHtml(value || "");
  }, [value, active]);

  /** INIT CONTENT (IMPORTANT): when entering edit mode, seed DOM once.
   * Do NOT keep re-setting innerHTML while typing, or caret will jump. */
  useEffect(() => {
    if (active && editableRef.current) {
      editableRef.current.innerHTML = html || "";
      // focus & put caret at end
      const rAF = requestAnimationFrame(() => {
        const el = editableRef.current!;
        el.focus({ preventScroll: true });
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
        setShowBar(false);
      });
      return () => cancelAnimationFrame(rAF);
    }
  }, [active]); // deliberately not depending on `html` here

  useEffect(() => {
    if (!editableRef.current) {
      lastContentKeyRef.current = contentKey;
      return;
    }
    if (contentKey !== lastContentKeyRef.current) {
      // Use the latest prop `value` to re-seed the DOM
      editableRef.current.innerHTML = value ?? "";
      // Place caret at end and hide pill
      const el = editableRef.current;
      const sel = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
      setShowBar(false);
      lastContentKeyRef.current = contentKey;
    }
  }, [contentKey, value]);

  /** Compute pill position relative to container (works in both modes) */
  const updateBarPosition = useCallback(() => {
    const root = containerRef.current;
    if (!root) return;
    const ctx = getSelectionIn(root);
    if (!ctx) return;

    const { range } = ctx;
    const rect = range.getClientRects()[0] ?? range.getBoundingClientRect();
    const rootRect = root.getBoundingClientRect();
    const GAP = 8;

    setBarPos({
      top: rect.top - rootRect.top - GAP,
      left: rect.left - rootRect.left + rect.width / 2,
    });
  }, []);

  /** Show/hide pill based on selection inside container (both modes) */
  const handleSelectionChange = useCallback(() => {
    const root = containerRef.current;
    if (!root) return;

    const ctx = getSelectionIn(root);
    if (!ctx || ctx.sel.isCollapsed) {
      setShowBar(false);
      return;
    }
    updateBarPosition();
    setShowBar(true);
  }, [updateBarPosition]);

  useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange);
    window.addEventListener("resize", updateBarPosition);
    window.addEventListener("scroll", updateBarPosition, true);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      window.removeEventListener("resize", updateBarPosition);
      window.removeEventListener("scroll", updateBarPosition, true);
    };
  }, [handleSelectionChange, updateBarPosition]);

  /** Apply formatting (works in both modes) */
  const applyTag = (tagName: "strong" | "em" | "u") => {
    const root = containerRef.current;
    if (!root) return;

    if (selectionHasTag(root, tagName)) {
      // Toggle OFF only this tag in the selection (keeps other formats)
      unwrapSelectionTag(root, tagName);
    } else {
      // Toggle ON for the whole selection
      wrapSelectionWithTag(root, tagName);
    }

    // Sync model from the active DOM
    const next =
      (active
        ? editableRef.current?.innerHTML
        : displayRef.current?.innerHTML) ?? html;
    setHtml(next);
    onChange?.(next);
    updateBarPosition();
  };

  /** Keyboard shortcuts — only in edit mode */
  const onEditorKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (!(e.ctrlKey || e.metaKey)) return;
    const key = e.key.toLowerCase();
    if (key === "b") {
      e.preventDefault();
      applyTag("strong");
    } else if (key === "i") {
      e.preventDefault();
      applyTag("em");
    } else if (key === "u") {
      e.preventDefault();
      applyTag("u");
    }
  };

  /** On input (edit mode): update state & emit, but DO NOT re-render innerHTML */
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const next = (e.currentTarget as HTMLDivElement).innerHTML;
    setHtml(next); // keep state for view mode
    onChange?.(next); // bubble up to Redux
    // React will NOT overwrite DOM because we are not using dangerouslySetInnerHTML here
  };

  /** View mode: selection vs click */
  const handleViewMouseUp = useCallback(
    (_e: React.MouseEvent) => {
      if (active) return;
      const root = containerRef.current;
      if (!root) return;

      const ctx = getSelectionIn(root);
      const hasSelection = !!ctx && !ctx.sel.isCollapsed;

      if (hasSelection) {
        updateBarPosition();
        setShowBar(true);
      } else {
        onStartEdit();
      }
    },
    [active, onStartEdit, updateBarPosition]
  );

  const displayHTML = useMemo(() => html || "", [html]);
  const empty = isEmptyHTML(displayHTML);

  return (
    <Box
      ref={containerRef}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: active ? cursorWhenActive : "text",
        position: "relative",
        width: "100%",
      }}
    >
      {active ? (
        <Box
          id={textFieldId}
          ref={editableRef}
          component="div"
          role="textbox"
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onKeyDown={onEditorKeyDown}
          onClick={(e) => e.stopPropagation()}
          onPaste={(e) => {
            e.preventDefault();
            const text = e.clipboardData.getData("text/plain");
            if (editableRef.current)
              insertPlainTextAtSelection(editableRef.current, text);
            const next = editableRef.current?.innerHTML ?? "";
            setHtml(next);
            onChange?.(next);
          }}
          sx={{
            outline: "none",
            minWidth: 0,
            width: "100%",
            ...textFieldSx,
            "& *": {
              fontFamily: textFieldSx?.fontFamily,
              fontStyle: textFieldSx?.fontStyle,
              lineHeight: textFieldSx?.lineHeight,
              letterSpacing: textFieldSx?.letterSpacing,
              fontSize: textFieldSx?.fontSize,
            },
          }}
          // NOTE: no dangerouslySetInnerHTML while active (prevents caret jumps)
        />
      ) : (
        <Typography
          component="div"
          ref={displayRef}
          onMouseUp={handleViewMouseUp}
          sx={{ width: "100%", ...typographySx, userSelect: "text" }}
          dangerouslySetInnerHTML={{
            __html:
              empty && placeholder
                ? `<span style="opacity:.6">${placeholder}</span>`
                : displayHTML,
          }}
        />
      )}

      {/* Formatting pill */}
      {showBar && (
        <Box
          sx={{
            position: "absolute",
            top: barPos.top,
            left: barPos.left,
            transform: "translate(-50%,-100%)",
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            boxShadow: 3,
            borderRadius: 9999,
            px: 1,
            py: 0.5,
            display: "flex",
            gap: 0.5,
            alignItems: "center",
            zIndex: 10,
          }}
          onMouseDown={(e) => e.preventDefault()}
        >
          <IconButton
            size="small"
            onClick={() => applyTag("strong")}
            aria-label="Bold"
            sx={{ width: 36, height: 36 }}
          >
            <Box component="span" sx={{ fontWeight: 700 }}>
              B
            </Box>
          </IconButton>
          <IconButton
            size="small"
            onClick={() => applyTag("em")}
            aria-label="Italic"
            sx={{ width: 36, height: 36 }}
          >
            <Box component="span" sx={{ fontStyle: "italic" }}>
              I
            </Box>
          </IconButton>
          <IconButton
            size="small"
            onClick={() => applyTag("u")}
            aria-label="Underline"
            sx={{ width: 36, height: 36 }}
          >
            <Box component="span" sx={{ textDecoration: "underline" }}>
              U
            </Box>
          </IconButton>
        </Box>
      )}
    </Box>
  );
}
