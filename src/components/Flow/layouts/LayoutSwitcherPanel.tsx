import { Panel } from "@xyflow/react";

import { LayoutSwitcherPanelProps } from "../../../utils/types";
import { LAYOUT_LABELS } from "../../../utils/utils";

export const LayoutSwitcherPanel = ({
  value,
  onChange,
  modes = ["sugiyama", "vertical", "swimlanes", "clustered"],
}: LayoutSwitcherPanelProps) => {
  return (
    <Panel position="top-right">
      <div
        style={{
          display: "flex",
          gap: 6,
          padding: 6,
          background: "rgba(255,255,255,0.85)",
          borderRadius: 10,
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          backdropFilter: "blur(4px)",
        }}
      >
        {modes.map((m) => (
          <button
            key={m}
            onClick={() => onChange(m)}
            title={LAYOUT_LABELS[m]}
            style={{
              padding: "6px 10px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              background: value === m ? "#111827" : "#fff",
              color: value === m ? "#fff" : "#111827",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            {LAYOUT_LABELS[m]}
          </button>
        ))}
      </div>
    </Panel>
  );
};
