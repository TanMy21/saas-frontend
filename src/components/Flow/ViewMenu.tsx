import { useEffect, useRef, useState } from "react";

import { IconButton, Tooltip } from "@mui/material";
import { Panel } from "@xyflow/react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid } from "lucide-react";

import { FlowLayoutViewMenuProps } from "../../utils/types";
import {
  EDGE_OPTIONS,
  EDGE_STYLE_LABELS,
  LAYOUT_LABELS,
  LAYOUT_OPTIONS,
  popTransition,
  popVariants,
} from "../../utils/utils";

export default function ViewMenu({
  layout,
  setLayout,
  edgeStyle,
  setEdgeStyle,
}: FlowLayoutViewMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // Close on outside click
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <Panel position="top-right" style={{ right: 8, top: 8, zIndex: 10 }}>
      <div ref={ref} style={{ position: "relative" }}>
        <Tooltip title="View settings" arrow={false}>
          <IconButton
            component={motion.button}
            onClick={() => setOpen((v) => !v)}
            aria-label="View settings"
            whileHover={{ scale: 1.06, y: -1 }}
            whileTap={{ scale: 0.95, y: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
            sx={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: "linear-gradient(180deg, #ffffff 0%, #f7f8fb 100%)",
              border: "1px solid rgba(17, 24, 39, 0.08)",
              boxShadow:
                "0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)",
              color: "#111827",
              backdropFilter: "blur(2px)",
              transition:
                "box-shadow .18s ease, background-color .18s ease, border-color .18s ease, transform .18s ease",
              "&:hover": {
                boxShadow:
                  "0 4px 10px rgba(0,0,0,0.10), 0 14px 30px rgba(0,0,0,0.10)",
                background: "linear-gradient(180deg, #ffffff 0%, #f2f4f8 100%)",
              },
              "&:active": {
                boxShadow:
                  "0 1px 4px rgba(0,0,0,0.10), 0 6px 18px rgba(0,0,0,0.08)",
              },
              "&:focus-visible": {
                outline: "none",
                boxShadow:
                  "0 0 0 3px rgba(59,130,246,0.35), 0 8px 24px rgba(0,0,0,0.08)",
                borderColor: "rgba(59,130,246,0.50)",
              },
            }}
          >
            <LayoutGrid size={20} strokeWidth={2} />
          </IconButton>
        </Tooltip>

        {/* Popover */}
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                key="view-scrim"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.04 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                style={{
                  position: "fixed",
                  inset: 0,
                  zIndex: 9,
                }}
              />{" "}
              <motion.div
                key="view-popover"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={popVariants}
                transition={popTransition}
                style={{
                  position: "absolute",
                  right: 0,
                  marginTop: 8,
                  width: 300,
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(247,248,251,0.98))",
                  backdropFilter: "blur(6px)",
                  border: "1px solid rgba(17, 24, 39, 0.08)",
                  borderRadius: 14,
                  boxShadow:
                    "0 10px 24px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
                  padding: 10,
                  zIndex: 20,
                }}
              >
                {/* content */}
                <div style={{ display: "grid", gap: 10 }}>
                  {/* Layout group */}
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#6b7280",
                        margin: "4px 6px",
                      }}
                    >
                      Layout
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 6,
                      }}
                    >
                      {LAYOUT_OPTIONS.map((m) => (
                        <button
                          key={m}
                          onClick={() => setLayout(m)}
                          title={LAYOUT_LABELS[m]}
                          style={{
                            padding: "8px 10px",
                            borderRadius: 10,
                            border: "1px solid #e5e7eb",
                            background: layout === m ? "#111827" : "#fff",
                            color: layout === m ? "#fff" : "#111827",
                            fontSize: 12,
                            cursor: "pointer",
                            textAlign: "left",
                            boxShadow:
                              layout === m
                                ? "0 2px 8px rgba(0,0,0,0.10)"
                                : "none",
                          }}
                        >
                          {LAYOUT_LABELS[m]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div
                    style={{
                      height: 1,
                      background: "#eef2f7",
                      margin: "2px 0",
                    }}
                  />

                  {/* Edges group */}
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#6b7280",
                        margin: "4px 6px",
                      }}
                    >
                      Edges
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 6,
                      }}
                    >
                      {EDGE_OPTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={() => setEdgeStyle(s)}
                          title={EDGE_STYLE_LABELS[s]}
                          style={{
                            padding: "8px 10px",
                            borderRadius: 10,
                            border: "1px solid #e5e7eb",
                            background: edgeStyle === s ? "#111827" : "#fff",
                            color: edgeStyle === s ? "#fff" : "#111827",
                            fontSize: 12,
                            cursor: "pointer",
                            textAlign: "left",
                            boxShadow:
                              edgeStyle === s
                                ? "0 2px 8px rgba(0,0,0,0.10)"
                                : "none",
                          }}
                        >
                          {EDGE_STYLE_LABELS[s]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </Panel>
  );
}
