import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";

import { TABS } from "../../utils/constants";
import { TabId } from "../../utils/types";

export default function SidebarNav({
  activeTab,
  onChange,
}: {
  activeTab: TabId;
  onChange: (tab: TabId) => void;
}) {
  return (
    <Box sx={{ p: 3 }}>
      <List sx={{ gap: 1, display: "grid" }}>
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <ListItemButton
              key={t.id}
              onClick={() => onChange(t.id)}
              sx={{
                borderRadius: 3,
                px: 2,
                py: 1.25,
                transition: "all 200ms ease",
                ...(active
                  ? {
                      color: "#fff",
                      transform: "scale(1.02)",
                      boxShadow: "0 10px 20px rgba(37,99,235,0.25)",
                      backgroundImage:
                        "linear-gradient(90deg,#0074EB 0%,#005BC4 100%)",
                    }
                  : {
                      color: "white",
                      "&:hover": {
                        backgroundColor: "rgba(15,23,42,0.06)",
                        transform: "scale(1.01)",
                        boxShadow: "0 6px 16px rgba(2, 6, 23, 0.06)",
                      },
                    }),
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Icon size={18} color={active ? "#fff" : "#64748b"} />
              </ListItemIcon>
              <ListItemText
                primary={t.label}
                primaryTypographyProps={{
                  fontWeight: 600,
                  color: active ? "white" : "black",
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}
