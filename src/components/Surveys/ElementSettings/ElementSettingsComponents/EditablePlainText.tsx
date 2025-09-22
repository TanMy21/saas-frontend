import React, { useCallback, useEffect, useRef, useState } from "react";

import { EditablePlainTextProps } from "../../../../utils/types";

export default function EditablePlainText({
  value,
  placeholder,
  onChange,
  onEnter,
  id = "plain-text-editable",
  blockEnter = true,
}: EditablePlainTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [text, setText] = useState<string>(value ?? "");
  const [isFocused, setIsFocused] = useState(false);
  const [isComposing, setIsComposing] = useState(false);

  useEffect(() => {
    if (isFocused || isComposing) return;
    const next = value ?? "";
    setText(next);
    if (ref.current && (ref.current.textContent ?? "") !== next) {
      ref.current.textContent = next;
    }
  }, [value, isFocused, isComposing]);

  const handleInput = useCallback(
    (e: React.FormEvent<HTMLDivElement>) => {
      const next = e.currentTarget.textContent ?? "";
      setText(next);
      onChange?.(next);
    },
    [onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (blockEnter && e.key === "Enter") {
        e.preventDefault();
        onEnter?.();
        return;
      }
      if (
        (e.ctrlKey || e.metaKey) &&
        ["b", "i", "u"].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
      }
    },
    [blockEnter, onEnter]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      e.preventDefault();
      const plain = e.clipboardData.getData("text/plain");

      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(plain));
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
      } else if (document.execCommand) {
        document.execCommand("insertText", false, plain);
      }
      const next = ref.current?.textContent ?? "";
      setText(next);
      onChange?.(next);
    },
    [onChange]
  );

  return (
    <div
      id={id}
      ref={ref}
      role="textbox"
      contentEditable
      suppressContentEditableWarning
      dir="ltr" // Left to Right
      onFocus={() => setIsFocused(true)} //  track focus
      onBlur={() => {
        setIsFocused(false);
        setIsComposing(false);
      }}
      onCompositionStart={() => setIsComposing(true)}
      onCompositionEnd={() => {
        setIsComposing(false);
      }}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      style={{
        outline: "none",
        minWidth: 0,
        width: "100%",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        direction: "ltr",
        unicodeBidi: "plaintext",
      }}
      aria-label={placeholder}
    />
  );
}
