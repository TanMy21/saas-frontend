import { Panel } from "@xyflow/react";

import { EdgeStyleProps } from "../../../utils/types";
import { EDGE_STYLE_LABELS, ORDER } from "../../../utils/utils";

export const EdgeStylePanel = ({ value, onChange }: EdgeStyleProps) => {
  return (
    <Panel position="top-right" style={{ right: 8, top: 64 }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          padding: 6,
          background: "rgba(255,255,255,0.85)",
          borderRadius: 10,
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          backdropFilter: "blur(4px)",
        }}
      >
        {ORDER.map((k) => (
          <button
            key={k}
            onClick={() => onChange(k)}
            title={EDGE_STYLE_LABELS[k]}
            style={{
              padding: "6px 10px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              background: value === k ? "#111827" : "#fff",
              color: value === k ? "#fff" : "#111827",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            {EDGE_STYLE_LABELS[k]}
          </button>
        ))}
      </div>
    </Panel>
  );
};
