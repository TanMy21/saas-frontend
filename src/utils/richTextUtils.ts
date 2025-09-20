export const isEmptyHTML = (html?: string | null) => {
  if (!html) return true;
  const stripped = html
    .replace(/<br\s*\/?>/gi, "")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]+>/g, "")
    .trim();
  return stripped.length === 0;
};

/** --- NEW: Selection helpers (no execCommand). --- */
export function getSelectionIn(root: HTMLElement) {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;
  const range = sel.getRangeAt(0);
  if (!root.contains(range.commonAncestorContainer)) return null;
  return { sel, range };
}

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

/** --- NEW: Strip a specific tag by replacing it with its children. --- */
export function unwrapTag(el: HTMLElement, tagName: string) {
  const t = tagName.toUpperCase();
  // Walk all descendants and unwrap matching tags
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

/** --- NEW: Wrap the current selection contents with a given tag. --- */
export function wrapSelectionWithTag(
  root: HTMLElement,
  tagName: "strong" | "em" | "u"
) {
  const ctx = getSelectionIn(root);
  if (!ctx) return;
  const { sel, range } = ctx;
  if (sel.isCollapsed) return;

  // Extract current selection contents
  const frag = range.cloneContents();

  // Create wrapper and append extracted content
  const wrapper = document.createElement(tagName);
  wrapper.appendChild(frag);

  // Replace selection with the wrapped fragment
  range.deleteContents();
  range.insertNode(wrapper);

  // Reselect wrapped content for good UX
  sel.removeAllRanges();
  const newRange = document.createRange();
  newRange.selectNodeContents(wrapper);
  sel.addRange(newRange);
}

/** --- NEW: Check whether both ends of selection are already inside the tag. --- */
export function selectionFullyInsideTag(
  root: HTMLElement,
  tagName: "strong" | "em" | "u"
) {
  const ctx = getSelectionIn(root);
  if (!ctx) return false;
  const { sel, range } = ctx;
  if (sel.isCollapsed) return false;
  const startInside = !!closestTag(range.startContainer, tagName, root);
  const endInside = !!closestTag(range.endContainer, tagName, root);
  return startInside && endInside;
}

/** --- NEW: Insert plain text at caret/selection (used for paste). --- */
export function insertPlainTextAtSelection(root: HTMLElement, text: string) {
  const ctx = getSelectionIn(root);
  if (!ctx) return;
  const { sel, range } = ctx;

  // Remove selection if any, then insert text node
  range.deleteContents();
  const textNode = document.createTextNode(text);
  range.insertNode(textNode);

  // Move caret to end of inserted text
  const newRange = document.createRange();
  newRange.setStartAfter(textNode);
  newRange.collapse(true);
  sel.removeAllRanges();
  sel.addRange(newRange);
}

export function htmlToPlainText(html?: string | null): string {
  if (!html) return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  // normalize whitespace a bit (optional)
  const text = div.textContent || "";
  return text.replace(/\u00A0/g, " "); // &nbsp; → space
}

export function convertHtmlToPlainText(html?: string | null): string {
  if (!html) return "";
  // normalize line breaks before parsing
  const withBreaks = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6])>/gi, "\n");
  const div = document.createElement("div");
  div.innerHTML = withBreaks;
  const text = div.textContent || "";
  return text.replace(/\u00A0/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

/** If you need to go the other way for plain-only inputs -> safe HTML (no formatting) */
export function plainTextToSafeHtml(text: string): string {
  // escape <,>,& then keep newlines if you allow multiline
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  // if single-line inputs, just return escaped; if multiline, convert \n to <br>
  return escaped; // or: escaped.replace(/\n/g, "<br>")
}

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

/** After deleting the selection, ensure the insertion point is NOT inside a removable tag. */
export function liftCollapsedRangeOutOfTags(
  range: Range,
  tags: string[],
  root: HTMLElement
) {
  let container: Node = range.startContainer;
  let ancestor = closestTagAny(container, tags, root);
  while (ancestor && ancestor.parentNode) {
    // Move the caret to AFTER that ancestor so insertion won't be re-wrapped by it
    range.setStartAfter(ancestor);
    range.collapse(true);
    container = range.startContainer;
    ancestor = closestTagAny(container, tags, root);
  }
}

export function unwrapSelectionTag(
  root: HTMLElement,
  tagName: "strong" | "em" | "u"
) {
  const ctx = getSelectionIn(root);
  if (!ctx) return;
  const { sel, range } = ctx;
  if (sel.isCollapsed) return;

  // Canonical + aliases
  const tagsToUnwrap =
    tagName === "strong"
      ? ["strong", "b"]
      : tagName === "em"
        ? ["em", "i"]
        : ["u"];

  // 1) Extract the selection (removes it from DOM and collapses range)
  const extracted = range.extractContents();

  // 2) Clean the extracted fragment by unwrapping target tags
  const temp = document.createElement("div");
  temp.appendChild(extracted);
  unwrapTags(temp, tagsToUnwrap);

  // 3) IMPORTANT: lift the collapsed caret OUT of any remaining target ancestors
  liftCollapsedRangeOutOfTags(range, tagsToUnwrap, root);

  // 4) Reinsert cleaned content at the (now safe) insertion point
  const cleanedFrag = document.createDocumentFragment();
  while (temp.firstChild) cleanedFrag.appendChild(temp.firstChild);
  range.insertNode(cleanedFrag);

  // Leave selection collapsed at end of inserted content (optional to restore selection)
  sel.removeAllRanges();
}

export function selectionHasTag(
  root: HTMLElement,
  tagName: "strong" | "em" | "u"
) {
  const ctx = getSelectionIn(root);
  if (!ctx) return false;
  const { sel, range } = ctx;

  // Check ancestors at boundaries
  const tags =
    tagName === "strong"
      ? ["strong", "b"]
      : tagName === "em"
        ? ["em", "i"]
        : ["u"];

  const startInside = closestTagAny(range.startContainer, tags, root);
  const endInside = closestTagAny(range.endContainer, tags, root);
  if (startInside || endInside) return true;

  // Also check the selected subtree (e.g. selection spans multiple nodes)
  const frag = range.cloneContents();
  const tmp = document.createElement("div");
  tmp.appendChild(frag);
  return !!tmp.querySelector(tags.join(","));
}
