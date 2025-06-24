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
  "none", //0
  "0 1px 2px rgba(0, 0, 0, 0.05)", //1
  "0 4px 6px rgba(0, 0, 0, 0.1)", //2
  "0 10px 15px rgba(0, 0, 0, 0.15)", //3
  "0 1px 3px rgba(0, 0, 0, 0.08)", //4
  "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)", //5
  "0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 8px 10px -6px rgba(0, 0, 0, 0.1)", //6
  "0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)", //7
  "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)", //8
  "0px 4px 20px rgba(0,0,0,0.05)", //9
  "0 0 0 2px rgba(69, 97, 226, 0.2)", //10
  "0px 20px 56px rgba(47, 45, 94, 0.06), 0px 6px 20px rgba(47, 45, 94, 0.06)", //11
  "0px 20px 56px rgba(47, 45, 94, 0.12), 0px 6px 20px rgba(47, 45, 94, 0.24)", //12
  "0 32px 64px rgba(0, 0, 0, 0.22)", //13
  "0 36px 72px rgba(0, 0, 0, 0.24)", //14
  "0 40px 80px rgba(0, 0, 0, 0.26)", //15
  "0 44px 88px rgba(0, 0, 0, 0.28)", //16
  "0 48px 96px rgba(0, 0, 0, 0.3)", //17
  "0 52px 104px rgba(0, 0, 0, 0.32)", //18
  "0 56px 112px rgba(0, 0, 0, 0.34)", //19
  "0 60px 120px rgba(0, 0, 0, 0.36)", //20
  "0 64px 128px rgba(0, 0, 0, 0.38)", //21
  "0 68px 136px rgba(0, 0, 0, 0.4)", //22
  "0 72px 144px rgba(0, 0, 0, 0.42)", //23
  "0 76px 152px rgba(0, 0, 0, 0.44)", //24
];

const electricBlueLightTheme = createTheme({
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
      dark: "#202635",
    },
    background: {
      default: "#F8FBFF",
      paper: "#FFFFFF",
      subtle: "F9F9FA",
      soft1: "#F8F9FF",
      soft2: "#F3F7FB",
      soft3: "#2055CE",
      soft4: "#ABB6D0",
      soft5: "#2B7CB7",
      soft6: "#E6F0FD",
      softRed: "#FEF2F2",
      success: "#F0FDF4",
      successSoft: "#EDF7ED",
      neutral: "#E9EDF6",
      softGrey: "#ECECEC",
    },
    text: {
      primary: "#1A202C",
      primaryDark: "#022B67",
      secondary: "#718096",
      danger: "#B91A1A",
      tabRoot: "#34375D",
      tabSelected: "#8A36D2",
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
      100: "#F9FAFB",
      200: "#F3F4F6",
      300: "#E5E7EB",
      400: "#D1D5DB",
      500: "#9CA3AF",
      600: "#6B7280",
      700: "#4B5563",
      800: "#374151",
      900: "#1F2937",
      910: "#111827",
    },
  },
  brand: {
    base: "#182331",
    bgColor1: "#f9fafb",
    bgColor2: "#E9EDF6",
    bgColor3: "#F8F9FF",
    divider1: "#747B88",
    divider2: "#E2E5E9",
    btnTxt1: "#6760EA",
    borderColor1: "#EDEDED",
    avatarBg1: "#85A5CA",
    avatarBg2: "#B9A90B",
    avatarBg3: "#C9DADE",
    avatarTxt1: "#FFFFFF",
  },
  iconStyles: {
    errorLarge: {
      color: "#DC2626",
      fontSize: "32px",
    },
    alert: {
      color: "#EF4444",
    },
    success: {
      color: "#22C55E",
      fontSize: "32px",
    },
    expandMore: {
      color: "#333B6B",
    },
    listLayoutIcon: {
      color: "#FFFFFF",
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
  borders: {
    default: "1px solid #e5e7eb",
    subtle: "1px solid #F1F3F5",
    strong: "2px solid #E5E7EB",
    light: "1px solid #F1F5F9",
    top: "1px solid #e5e7eb",
    bottom: "1px solid #e5e7eb",
    left: "1px solid #e5e7eb",
    right: "1px solid #e5e7eb",
    avatarIcon: "6px solid rgba(232, 231, 231, 0.5)",
    avatarIconHovered: "6px solid rgba(232, 231, 231, 1)",
  },
  gradient: {
    from: "#0074EB",
    to: "#005BC4",
    angle: "171deg",
    background: "linear-gradient(171deg, #0074EB 53%, #005BC4 93%)",
  },
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: "gradientPrimary" },
          style: {
            py: 1.5,
            background: "linear-gradient(171deg, #0074EB 53%, #005BC4 93%)",
            color: "white",
            borderRadius: "24px",
            fontWeight: "bold",
            transition: "opacity 0.2s",
            textTransform: "none",
            "&:hover": { opacity: 0.9 },
          },
        },
        {
          props: { variant: "getStarted" },
          style: {
            padding: "12px 24px",
            background: "linear-gradient(171deg, #0074EB 53%, #005BC4 93%)",
            color: "#FFFFFF",
            borderRadius: "24px",
            fontWeight: "600",
            transition: "all 0.3s ease-in-out",
            boxShadow: shadows[5],
            width: "260px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            backgroundSize: "200% 200%",
            textTransform: "unset",
            animation: "gradientAnimation 3s ease infinite",
            "&:hover": {
              boxShadow: shadows[6],
              transform: "scale(1.05)",
            },
          },
        },
        {
          props: { variant: "landingSignIn" },
          style: {
            padding: "12px 24px",
            background: "#FFFFFF",
            color: "#182331",
            borderRadius: "24px",
            fontWeight: "600",
            transition: "all 0.3s ease-in-out",
            gap: 2,
            boxShadow: shadows[7],
            border: "1px solid #e5e7eb",
            width: "260px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textTransform: "unset",
            "&:hover": {
              backgroundColor: "#f9fafb",
              boxShadow: shadows[8],
              transform: "scale(1.05)",
            },
          },
        },
        {
          props: { variant: "backLink1" },
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            color: "#7C3AED",
            fontWeight: "medium",
            textTransform: "none",
            background: "none",
            textDecoration: "none",
            "&:hover": { textDecoration: "none", background: "none" },
          },
        },
        {
          props: { variant: "backLink2" },
          style: {
            color: "#7C3BED",
            fontWeight: "bold",
            fontSize: "1rem",
            textTransform: "unset",
            "&:hover": { textDecoration: "none", background: "none" },
          },
        },
        {
          props: { variant: "textLink1" },
          style: {
            textTransform: "unset",
            color: "#7E3DED",
            fontWeight: "bold",
            fontSize: "16px",
            textDecoration: "none",
            background: "none",
            "&:hover": {
              textDecoration: "none",
              background: "none",
            },
          },
        },
        {
          props: { variant: "textLink2" },
          style: {
            py: 1.5,
            background:
              "linear-gradient(171deg,rgba(0, 127, 200, 1) 53%, rgba(0, 167, 193, 1) 93%)",
            color: "white",
            borderRadius: "16px",
            fontWeight: "bold",
            transition: "opacity 0.2s",
            textTransform: "unset",
            "&:hover": { opacity: 0.9 },
          },
        },
        {
          props: { variant: "headerBtn1" },
          style: {
            fontSize: "1.1rem",
            fontWeight: "bold",
            color: "#1D2B5A",
            textTransform: "none",
            display: "flex",
            alignItems: "center",
            gap: 1,
            "&:hover": {
              backgroundColor: "transparent",
            },
          },
        },
        {
          props: { variant: "submitDisabled1" },
          style: {
            py: 1.5,
            background: "linear-gradient(171deg, #0074EB 53%, #005BC4 93%)",
            color: "white",
            borderRadius: "24px",
            fontWeight: "bold",
            transition: "opacity 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textTransform: "unset",
            "&:hover": { opacity: 0.9 },
            "&:disabled": { cursor: "not-allowed", opacity: 0.7 },
          },
        },
        {
          props: { variant: "submit1" },
          style: {
            mt: 2,
            mb: 2,
            textTransform: "capitalize",
            backgroundColor: "#005BC4",
            color: "#FFFFFF",
            fontWeight: 600,
            borderRadius: "24px",
            "&:hover": {
              backgroundColor: "#005BC4",
            },
          },
        },
        {
          props: { variant: "cancelBtn" },
          style: {
            width: "16%",
            height: "80%",
            px: "36px",
            // p: "24px 48px",
            backgroundColor: "transparent",
            color: "#005BC4",
            fontWeight: "bold",
            border: "1px solid rgb(81, 142, 211)",
            "&.MuiButton-root:hover": {
              bgcolor: "transparent",
            },
            textTransform: "capitalize",
            borderRadius: "24px",
          },
        },
        {
          props: { variant: "submitBtn2" },
          style: {
            width: "48%",
            height: "80%",
            p: 2,
            backgroundColor: "#005BC4",
            color: "white",
            fontWeight: "bold",
            "&.MuiButton-root:hover": {
              backgroundColor: "#005BC4",
            },
            textTransform: "unset",
            borderRadius: "16px",
          },
        },
        {
          props: { variant: "dangerBtn" },
          style: {
            backgroundColor: "#B31212",
            color: "white",
            width: "36%",
            height: "40px",
            "&.MuiButton-root:hover": {
              bgcolor: "#B31212",
            },
            textTransform: "capitalize",
            borderRadius: "12px",
            fontWeight: "bold",
          },
        },
      ],
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
  textStyles: {
    gradientPrimary: {
      fontSize: "5rem",
      fontWeight: "bold",
      background: "linear-gradient(171deg, #0074EB 53%, #005BC4 93%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundSize: "200% 200%",
      animation: "gradientAnimation 3s ease infinite",
      letterSpacing: "-0.015em",
      display: "inline-block",
    },
    gradientSecondary: {
      fontSize: "3rem",
      backgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundImage: "linear-gradient(171deg, #0074EB 53%, #005BC4 93%)",
      fontWeight: "bold",
    },
    strongH6: {
      fontSize: "1.25rem",
      lineHeight: 1.6,
      fontWeight: "bold",
      color: "#080F1F",
    },
    strongH4: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      backgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundImage:
        "linear-gradient(171deg,rgba(0, 127, 200, 1) 53%, rgba(0, 167, 193, 1) 93%)",
    },
    bodyDanger: {
      color: "#7F1D1D",
      fontWeight: "bold",
    },
    bodyGrey: {
      color: "#6B727F",
      fontWeight: "bold",
    },
    subtitleText: {
      fontSize: "1.6rem",
      color: "#718096",
      maxWidth: "60rem",
      margin: "0 auto",
      lineHeight: "1.625",
      textAlign: "center",
    },
    greetingsText: {
      fontWeight: "bold",
      color: "#332C49",
      padding: "8px",
    },
    modalTitle: {
      fontSize: "20px",
      fontWeight: "bold",
      color: "#272F3F",
    },
    cardSurveyTitle: {
      fontSize: "1.25rem",
      fontWeight: "bold",
      color: "#272F3F",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    cardSurveyCreatedAt: {
      fontSize: "14px",
      fontWeight: "bold",
      color: "#7E7571",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    newActionCardSubtitle: {
      fontSize: "15px",
      fontWeight: "bold",
      color: "#7E7571",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    metricLabelValue: {
      fontSize: "36px",
      color: "#3B3C3F",
      fontWeight: "bold",
    },
    metricLabelTitle: {
      fontSize: "16px",
      color: "#737783",
      fontWeight: "bold",
    },
    listViewMetricLabelValue: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#0F1828",
    },
    listViewMetricLabelTitle: {
      fontSize: "16px",
      color: "#6B727F",
    },
  },
  tabStyles: {
    base: {
      height: "64px",
      minHeight: "64px",
      "& .MuiTabs-flexContainer": {
        alignItems: "flex-end", // push tabs to bottom
        height: "100%",
      },
      "& .MuiTab-root": {
        minHeight: "auto",
        paddingBottom: "4px", // THIS adds spacing between text & indicator
      },
      "& .MuiTabs-indicator": {
        height: "3px",
        backgroundColor: "#6366F1",
      },
    },
    createTab: {
      fontWeight: 600,
      "&.Mui-selected": {
        color: "#6366F1",
        "& .MuiTab-iconWrapper": {
          color: "#6366F1",
        },
      },
    },
    flowTab: {
      fontWeight: 600,
      color: "#1ABEBE",
      "&.Mui-selected": {
        color: "#1ABEBE",
        "& .MuiTab-iconWrapper": {
          color: "#1ABEBE",
        },
      },
    },
    resultsTab: {
      fontWeight: 600,
      color: "#B9A90B",
      "&.Mui-selected": {
        color: "#B9A90B",
        "& .MuiTab-iconWrapper": {
          color: "#B9A90B",
        },
      },
    },
    indicatorColorMap: {
      create: "#6366F1",
      flow: "#1ABEBE",
      results: "#B9A90B",
    },
  },
  scrollStyles: {
    custom1: {
      scrollbarGutter: "stable both-edges",
      overflowX: "hidden",
      overflowY: "hidden",
      width: "100%",
      height: "100%",
      "&::-webkit-scrollbar": {
        width: "10px",
      },
      "&::-webkit-scrollbar-track": {
        background: "#f1f1f1",
      },
      "&::-webkit-scrollbar-thumb": {
        background: "#61A5D2",
        borderRadius: "10px",
        "&:hover": {
          background: "#555",
        },
      },
    },
    builderMain: {
      scrollbarGutter: "stable both-edges",
      "&::-webkit-scrollbar": {
        width: "10px",
      },
      "&::-webkit-scrollbar-track": {
        background: "#f1f1f1",
      },
      "&::-webkit-scrollbar-thumb": {
        background: "#005BC4",
        borderRadius: "10px",
        "&:hover": {
          background: "#555",
        },
      },
    },
    elementsPanel: {
      scrollbarGutter: "stable both-edges",
      "&::-webkit-scrollbar": {
        width: "8px",
      },
      "&::-webkit-scrollbar-track": {
        background: "#f1f1f1",
      },
      "&::-webkit-scrollbar-thumb": {
        background: "#005BC4",
        borderRadius: "10px",
        "&:hover": {
          background: "#555",
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

export default electricBlueLightTheme;
