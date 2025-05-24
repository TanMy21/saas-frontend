import { createTheme } from "@mui/material/styles";

const shadows: [
  "none",
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
] = [
  "none",
  "0 1px 2px rgba(0, 0, 0, 0.05)",
  "0 4px 6px rgba(0, 0, 0, 0.1)",
  "0 10px 15px rgba(0, 0, 0, 0.15)",
  "0 1px 3px rgba(0, 0, 0, 0.08)",
  "0 2px 4px rgba(0, 0, 0, 0.06)",
  "0 5px 10px rgba(0, 0, 0, 0.08)",
  "0 8px 16px rgba(0, 0, 0, 0.1)",
  "0 12px 24px rgba(0, 0, 0, 0.12)",
  "0 16px 32px rgba(0, 0, 0, 0.14)",
  "0 20px 40px rgba(0, 0, 0, 0.16)",
  "0 24px 48px rgba(0, 0, 0, 0.18)",
  "0 28px 56px rgba(0, 0, 0, 0.2)",
  "0 32px 64px rgba(0, 0, 0, 0.22)",
  "0 36px 72px rgba(0, 0, 0, 0.24)",
  "0 40px 80px rgba(0, 0, 0, 0.26)",
  "0 44px 88px rgba(0, 0, 0, 0.28)",
  "0 48px 96px rgba(0, 0, 0, 0.3)",
  "0 52px 104px rgba(0, 0, 0, 0.32)",
  "0 56px 112px rgba(0, 0, 0, 0.34)",
  "0 60px 120px rgba(0, 0, 0, 0.36)",
  "0 64px 128px rgba(0, 0, 0, 0.38)",
  "0 68px 136px rgba(0, 0, 0, 0.4)",
  "0 72px 144px rgba(0, 0, 0, 0.42)",
  "0 76px 152px rgba(0, 0, 0, 0.44)",
];

const muiSaaSTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0074EB",
      dark: "#005BC4",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#FF4757",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F8FBFF",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A202C",
      secondary: "#718096",
    },
    success: {
      main: "#22C55E",
    },
    warning: {
      main: "#FACC15",
    },
    error: {
      main: "#EF4444",
    },
    divider: "#CBD5E0",
    grey: {
      100: "#F1F5F9",
      200: "#E2E8F0",
      300: "#CBD5E0",
      400: "#A0AEC0",
      500: "#718096",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 16,
    h1: { fontWeight: 700, color: "#1A202C" },
    h2: { fontWeight: 700, color: "#1A202C" },
    h3: { fontWeight: 700, color: "#1A202C" },
    body1: { color: "#1A202C" },
    body2: { color: "#1A202C" },
    button: { textTransform: "none" },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          fontWeight: 500,
        },
        containedPrimary: {
          background: "linear-gradient(120deg, #0074EB, #005BC4)",
          "&:hover": {
            backgroundColor: "#005BC4",
          },
        },
        containedSecondary: {
          backgroundColor: "#FF4757",
          "&:hover": {
            backgroundColor: "#E03A48",
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: "#CBD5E0 #F1F5F9",
          "&::-webkit-scrollbar": {
            width: 8,
            height: 8,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#CBD5E0",
            borderRadius: 8,
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#A0AEC0",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#F1F5F9",
          },
        },
      },
    },
  },
  shadows,
  zIndex: {
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },
});

export default muiSaaSTheme;
