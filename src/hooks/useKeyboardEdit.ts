import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type SaveFn = (nextText: string) => Promise<void> | void;

type UseKeyboardEditableRowOptions = {
  // initial text to show when not editing
  initialText: string;
  // called on save (Enter/Tab/outside click)
  onSave: SaveFn;
  // optional: CSS selector to find siblings for focus traversal
  siblingsSelector?: string; // default: '[data-role="editable-row"]'
  // optional: custom data-role value for the row; used with siblingsSelector default
  rowDataRole?: string; // default: 'editable-row'
  // optional: when external value changes, update our local text
  externalValue?: string;
};

export function useKeyboardEditableRow({
  initialText,
  onSave,
  siblingsSelector,
  rowDataRole,
  externalValue,
}: UseKeyboardEditableRowOptions) {
  // ---------- state & refs ----------
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);

  const rowRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // NEW: remember how we entered edit (typed seed vs plain enter/click)
  const lastSeedRef = useRef<string | null>(null);

  // compute defaults
  const roleValue = rowDataRole ?? "editable-row";
  const selector = siblingsSelector ?? '[data-role="editable-row"]';

  // keep local text synced if external changes (e.g., redux/rtk updates)
  useEffect(() => {
    if (typeof externalValue === "string") setText(externalValue);
  }, [externalValue]);

  // ---------- focus helpers ----------
  const focusInputNextTick = () =>
    setTimeout(() => inputRef.current?.focus(), 0);
  const focusRowNextTick = () => setTimeout(() => rowRef.current?.focus(), 0);

  const focusSiblingByDelta = useCallback(
    (delta: number) => {
      const el = rowRef.current;
      if (!el || !el.parentElement) return;
      const siblings = Array.from(
        el.parentElement.querySelectorAll<HTMLElement>(selector)
      );
      const idx = siblings.indexOf(el);
      const next = siblings[idx + delta];
      next?.focus();
    },
    [selector]
  );

  // ---------- edit lifecycle ----------
  const enterEdit = useCallback(
    (seed?: string) => {
      setIsEditing(true);
      lastSeedRef.current = typeof seed === "string" ? seed : null;
      setText(typeof seed === "string" ? seed : (externalValue ?? initialText));
      focusInputNextTick();
    },
    [externalValue, initialText]
  );

  const exitEdit = useCallback(() => {
    setIsEditing(false);
    focusRowNextTick();
  }, []);

  const save = useCallback(async () => {
    await onSave(text);
    exitEdit();
  }, [onSave, text, exitEdit]);

  const cancel = useCallback(
    (fallback?: string) => {
      setText(
        typeof fallback === "string" ? fallback : (externalValue ?? initialText)
      );
      exitEdit();
    },
    [externalValue, initialText, exitEdit]
  );

  // NEW: once we’re in edit mode, select all (or place caret) after the input mounts
  useEffect(() => {
    if (!isEditing) return;
    const id = requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      el.focus({ preventScroll: true });

      if (lastSeedRef.current == null) {
        // Enter/click/F2 path => select entire text
        el.setSelectionRange(0, el.value.length);
      } else {
        // Typed a printable char to enter => caret at end (overwrite flow)
        // If you want select-all here too, replace with the line above.
        const end = el.value.length;
        el.setSelectionRange(end, end);
      }
    });
    return () => cancelAnimationFrame(id);
  }, [isEditing]);

  // ---------- handlers ----------
  const handleRowKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (isEditing) return;

      // Enter / Space / F2 => start editing
      if (e.key === "Enter" || e.key === " " || e.key === "F2") {
        e.preventDefault();
        e.stopPropagation();
        enterEdit();
        return;
      }
      // Any printable char => start editing, seed with typed char
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        e.stopPropagation();
        enterEdit(e.key);
        return;
      }
      // Up/Down navigate rows
      if (e.key === "ArrowDown") {
        e.preventDefault();
        focusSiblingByDelta(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        focusSiblingByDelta(-1);
      }
    },
    [isEditing, enterEdit, focusSiblingByDelta]
  );

  // capture backstop: allow Enter to start edit even if a child got focus
  const handleRowKeyDownCapture = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!isEditing && e.key === "Enter") {
        const t = e.target as HTMLElement;
        const tag = t.tagName;
        const role = t.getAttribute("role") || "";
        if (
          tag !== "BUTTON" &&
          tag !== "A" &&
          tag !== "TEXTAREA" &&
          role !== "button"
        ) {
          e.preventDefault();
          e.stopPropagation();
          enterEdit();
        }
      }
    },
    [isEditing, enterEdit]
  );

  const handleEditorKeyDown = useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Enter => save & next
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        await save();
        setTimeout(() => focusSiblingByDelta(1), 0);
        return;
      }
      // Shift+Enter or Shift+Tab => save & previous
      if (
        (e.key === "Enter" && e.shiftKey) ||
        (e.key === "Tab" && e.shiftKey)
      ) {
        e.preventDefault();
        e.stopPropagation();
        await save();
        setTimeout(() => focusSiblingByDelta(-1), 0);
        return;
      }
      // Tab => save & next
      if (e.key === "Tab" && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        await save();
        setTimeout(() => focusSiblingByDelta(1), 0);
        return;
      }
      // Esc => cancel (revert)
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        cancel();
      }
    },
    [save, cancel, focusSiblingByDelta]
  );

  const handleClickAway = useCallback(() => {
    if (isEditing) void save();
  }, [isEditing, save]);

  // ---------- props to spread ----------
  const editProps = useMemo(
    () => ({
      ref: rowRef,
      tabIndex: 0,
      role: "group" as const,
      "data-role": roleValue,
      onKeyDown: !isEditing ? handleRowKeyDown : undefined,
      onKeyDownCapture: handleRowKeyDownCapture,
    }),
    [isEditing, handleRowKeyDown, handleRowKeyDownCapture, roleValue]
  );

  const editorProps = useMemo(
    () => ({
      value: text,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setText(e.target.value),
      onKeyDown: handleEditorKeyDown,
      inputRef, // NEW: fallback—if focus arrives late, still select as intended
      onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
        const el = e.currentTarget;
        if (lastSeedRef.current == null) {
          el.setSelectionRange(0, el.value.length);
        } else {
          const end = el.value.length;
          el.setSelectionRange(end, end);
        }
      },
    }),
    [text, handleEditorKeyDown]
  );

  return {
    // state
    isEditing,
    text,
    setText,

    // props to spread
    editProps,
    editorProps,

    // refs (if needed)
    rowRef,
    inputRef,

    // actions
    enterEdit,
    exitEdit,
    save,
    cancel,
    focusSiblingByDelta,
    handleClickAway,
  };
}
