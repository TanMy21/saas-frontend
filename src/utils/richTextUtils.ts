import { FormatTagType } from "./types";

/**
 * Checks whether the given HTML string is effectively empty.
 *
 * @param html - Optional HTML string.
 * @returns True if the string has no meaningful text content after stripping tags, false otherwise.
 */
export const isEmptyHTML = (html?: string | null) => {
  if (!html) return true;
  const stripped = html
    .replace(/<br\s*\/?>/gi, "")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]+>/g, "")
    .trim();
  return stripped.length === 0;
};

/**
 * Retrieves the current text selection and range if it lies within the given root element.
 *
 * @param root - The root HTML element to check against.
 * @returns An object with the selection and range, or null if not inside root.
 */
export function getSelectionIn(root: HTMLElement) {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;
  const range = sel.getRangeAt(0);
  if (!root.contains(range.commonAncestorContainer)) return null;
  return { sel, range };
}

/**
 * Traverses up the DOM tree from a node to find the nearest ancestor with the specified tag name.
 *
 * @param node - Starting node.
 * @param tagName - Tag name to match.
 * @param root - Root element to stop traversal.
 * @returns The closest matching element or null.
 */
export function closestTag(node: Node, tagName: string, root: HTMLElement) {
  let n: Node | null = node;
  const target = tagName.toUpperCase();
  while (n && n !== root) {
    if (
      (n as HTMLElement).nodeType === Node.ELEMENT_NODE &&
      (n as HTMLElement).tagName === target
    ) {
      return n as HTMLElement;
    }
    n = (n as HTMLElement).parentNode;
  }
  return null;
}

/**
 * Removes all elements with a given tag from a container, preserving their children.
 *
 * @param el - Container element.
 * @param tagName - Tag name to unwrap.
 */
export function unwrapTag(el: HTMLElement, tagName: string) {
  const t = tagName.toUpperCase();
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_ELEMENT, null);
  const toUnwrap: HTMLElement[] = [];
  let cur = walker.currentNode as HTMLElement | null;
  while (cur) {
    if (cur.tagName === t) toUnwrap.push(cur);
    cur = walker.nextNode() as HTMLElement | null;
  }
  toUnwrap.forEach((node) => {
    while (node.firstChild)
      node.parentNode?.insertBefore(node.firstChild, node);
    node.parentNode?.removeChild(node);
  });
}

/**
 * Removes all elements with any of the specified tag names, preserving their children.
 *
 * @param el - Container element.
 * @param tagNames - List of tag names to unwrap.
 */
export function unwrapTags(el: HTMLElement, tagNames: string[]) {
  const UPPER = new Set(tagNames.map((t) => t.toUpperCase()));
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_ELEMENT, null);
  const toUnwrap: HTMLElement[] = [];
  let cur = walker.currentNode as HTMLElement | null;
  while (cur) {
    if (UPPER.has(cur.tagName)) toUnwrap.push(cur);
    cur = walker.nextNode() as HTMLElement | null;
  }
  toUnwrap.forEach((node) => {
    while (node.firstChild)
      node.parentNode?.insertBefore(node.firstChild, node);
    node.parentNode?.removeChild(node);
  });
}

/**
 * Wraps the current text selection inside the root element with the specified tag.
 *
 * @param root - Root element.
 * @param tagName - Tag to apply (e.g., strong, em, u).
 */
export function wrapSelectionWithTag(
  root: HTMLElement,
  tagName: FormatTagType
) {
  const ctx = getSelectionIn(root);
  if (!ctx) return;
  const { sel, range } = ctx;
  if (sel.isCollapsed) return;

  const wrapper = document.createElement(tagName);

  try {
    range.surroundContents(wrapper);

    sel.removeAllRanges();
    const r = document.createRange();
    r.selectNodeContents(wrapper);
    sel.addRange(r);

    wrapper.parentElement?.normalize();
    return;
  } catch (error) {
    console.error(error);
  }

  const frag = range.cloneContents();
  wrapper.appendChild(frag);
  range.deleteContents();
  range.insertNode(wrapper);

  const parent = wrapper.parentElement;
  parent?.normalize();

  sel.removeAllRanges();
  const newRange = document.createRange();
  newRange.selectNodeContents(wrapper);
  sel.addRange(newRange);
}

/**
 * Checks whether the current selection lies entirely within elements of the given tag.
 *
 * @param root - Root element.
 * @param tagName - Tag name to check.
 * @returns True if selection is fully inside the tag, false otherwise.
 */
export function selectionFullyInsideTag(
  root: HTMLElement,
  tagName: FormatTagType
) {
  const ctx = getSelectionIn(root);
  if (!ctx) return false;
  const { sel, range } = ctx;
  if (sel.isCollapsed) return false;
  const startInside = !!closestTag(range.startContainer, tagName, root);
  const endInside = !!closestTag(range.endContainer, tagName, root);
  return startInside && endInside;
}

/**
 * Inserts plain text at the current selection, replacing any selected content.
 *
 * @param root - Root element.
 * @param text - Plain text to insert.
 */
export function insertPlainTextAtSelection(root: HTMLElement, text: string) {
  const ctx = getSelectionIn(root);
  if (!ctx) return;
  const { sel, range } = ctx;

  range.deleteContents();
  const textNode = document.createTextNode(text);
  range.insertNode(textNode);

  const newRange = document.createRange();
  newRange.setStartAfter(textNode);
  newRange.collapse(true);
  sel.removeAllRanges();
  sel.addRange(newRange);
}

/**
 * Converts HTML to plain text, stripping tags and preserving text content.
 *
 * @param html - HTML string.
 * @returns Plain text string.
 */
export function htmlToPlainText(html?: string | null): string {
  if (!html) return "";
  const div = document.createElement("div");
  div.innerHTML = html;

  const text = div.textContent || "";
  return text.replace(/\u00A0/g, " ");
}

/**
 * Converts HTML to plain text, preserving structural breaks like paragraphs and lists as newlines.
 *
 * @param html - HTML string.
 * @returns Plain text string with line breaks.
 */
export function convertHtmlToPlainText(html?: string | null): string {
  if (!html) return "";

  const withBreaks = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6])>/gi, "\n");
  const div = document.createElement("div");
  div.innerHTML = withBreaks;
  const text = div.textContent || "";
  return text
    .replace(/\u00A0/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Escapes plain text into HTML-safe content, preventing HTML injection.
 *
 * @param text - Plain text string.
 * @returns HTML-safe string.
 */
export function plainTextToSafeHtml(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped;
}

/**
 * Finds the closest ancestor of a node matching any tag in a provided list.
 *
 * @param node - Starting node.
 * @param tags - List of tag names.
 * @param root - Root element to stop traversal.
 * @returns Closest matching element or null.
 */
export function closestTagAny(
  node: Node | null,
  tags: string[],
  root: HTMLElement
) {
  if (!node) return null;
  const UPPER = new Set(tags.map((t) => t.toUpperCase()));
  let n: Node | null = node;
  while (n && n !== root) {
    if (
      n.nodeType === Node.ELEMENT_NODE &&
      UPPER.has((n as HTMLElement).tagName)
    ) {
      return n as HTMLElement;
    }
    n = (n as HTMLElement).parentNode;
  }
  return null;
}

/**
 * Adjusts a collapsed range so it is no longer inside any of the given tags.
 *
 * @param range - The range to adjust.
 * @param tags - List of tag names to lift out from.
 * @param root - Root element.
 */
export function liftCollapsedRangeOutOfTags(
  range: Range,
  tags: string[],
  root: HTMLElement
) {
  let container: Node = range.startContainer;
  let ancestor = closestTagAny(container, tags, root);
  while (ancestor && ancestor.parentNode) {
    range.setStartAfter(ancestor);
    range.collapse(true);
    container = range.startContainer;
    ancestor = closestTagAny(container, tags, root);
  }
}

/**
 * Removes a specific formatting tag from the current selection.
 *
 * @param root - Root element.
 * @param tagName - Formatting tag to remove (strong, em, u).
 */
export function unwrapSelectionTag(
  root: HTMLElement,
  tagName: "strong" | "em" | "u"
) {
  const ctx = getSelectionIn(root);
  if (!ctx) return;
  const { sel, range } = ctx;
  if (sel.isCollapsed) return;

  const tagsToUnwrap =
    tagName === "strong"
      ? ["strong", "b"]
      : tagName === "em"
        ? ["em", "i"]
        : ["u"];

  const extracted = range.extractContents();

  const temp = document.createElement("div");
  temp.appendChild(extracted);
  unwrapTags(temp, tagsToUnwrap);

  liftCollapsedRangeOutOfTags(range, tagsToUnwrap, root);

  const cleanedFrag = document.createDocumentFragment();
  while (temp.firstChild) cleanedFrag.appendChild(temp.firstChild);
  range.insertNode(cleanedFrag);

  sel.removeAllRanges();
}

/**
 * Determines whether the current selection has the specified formatting tag applied.
 *
 * @param root - Root element.
 * @param tagName - Tag to check (strong, em, u).
 * @returns True if selection contains the tag, false otherwise.
 */
export function selectionHasTag(
  root: HTMLElement,
  tagName: "strong" | "em" | "u"
) {
  const ctx = getSelectionIn(root);
  if (!ctx) return false;
  const { range } = ctx;

  const tags =
    tagName === "strong"
      ? ["strong", "b"]
      : tagName === "em"
        ? ["em", "i"]
        : ["u"];

  const startInside = closestTagAny(range.startContainer, tags, root);
  const endInside = closestTagAny(range.endContainer, tags, root);
  if (startInside || endInside) return true;

  const frag = range.cloneContents();
  const tmp = document.createElement("div");
  tmp.appendChild(frag);
  return !!tmp.querySelector(tags.join(","));
}

/**
 * Rewrites the text content of HTML while preserving inline tags and formatting.
 *
 * @param oldHtml - Original HTML string.
 * @param newPlain - New plain text string.
 * @returns Updated HTML string with formatting intact.
 */
export function rewriteHtmlTextPreserveInlineTags(
  oldHtml: string,
  newPlain: string
): string {
  const normalized = (newPlain ?? "").replace(/\u00A0/g, " ");
  const host = document.createElement("div");
  host.innerHTML = oldHtml || "";

  const walker = document.createTreeWalker(host, NodeFilter.SHOW_TEXT, null);
  const nodes: Text[] = [];
  let node = walker.nextNode();
  while (node) {
    nodes.push(node as Text);
    node = walker.nextNode();
  }

  if (nodes.length === 0) {
    host.textContent = normalized;
    return host.innerHTML;
  }

  let cursor = 0;
  const total = normalized.length;

  nodes.forEach((t, i) => {
    if (cursor >= total) {
      t.textContent = "";
      return;
    }
    const isLast = i === nodes.length - 1;
    if (isLast) {
      t.textContent = normalized.slice(cursor);
      cursor = total;
    } else {
      const keep = Math.min(t.textContent?.length ?? 0, total - cursor);
      t.textContent = normalized.slice(cursor, cursor + keep);
      cursor += keep;
    }
  });

  if (cursor < total) {
    const last = nodes[nodes.length - 1];
    last.textContent = (last.textContent || "") + normalized.slice(cursor);
  }

  return host.innerHTML;
}

/**
 * Normalizes an HTML string by replacing non-breaking spaces and collapsing whitespace.
 *
 * @param s - HTML string or null/undefined.
 * @returns Normalized plain string.
 */
export const normalizeHtml = (s?: string | null) =>
  (s ?? "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
