import "@mui/material/styles";
import { type CSSObject } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    gradient: {
      from: string;
      to: string;
      angle: string;
      background: string;
    };

    borders: {
      default: string;
      subtle: string;
      strong: string;
      light: string;
      top: string;
      bottom: string;
      left: string;
      right: string;
      avatarIcon: string;
      avatarIconHovered: string;
    };

    brand: {
      base: string;
      bgColor1: string;
      bgColor2: string;
      bgColor3: string;
      divider1: string;
      divider2: string;
      btnTxt1: string;
      borderColor1?: string;
      avatarBg1?: string;
      avatarBg2?: string;
      avatarBg3?: string;
      avatarTxt1?: string;
    };

    textStyles: {
      gradientPrimary: React.CSSProperties;
      gradientSecondary?: React.CSSProperties;
      strongH4?: React.CSSProperties;
      strongH6?: React.CSSProperties;
      subtitleText?: React.CSSProperties;
      bodyDanger?: React.CSSProperties;
      bodyGrey?: React.CSSProperties;
      greetingsText?: React.CSSProperties;
      cardSurveyTitle?: React.CSSProperties;
      cardSurveyCreatedAt?: React.CSSProperties;
      metricLabelValue?: React.CSSProperties;
      metricLabelTitle?: React.CSSProperties;
      listViewMetricLabelValue?: React.CSSProperties;
      listViewMetricLabelTitle?: React.CSSProperties;
      newActionCardSubtitle?: React.CSSProperties;
      modalTitle?: React.CSSProperties;
    };

    tabStyles: {
      base: SxProps<Theme>;
      createTab: SxProps<Theme>;
      flowTab: SxProps<Theme>;
      resultsTab: SxProps<Theme>;
      indicatorColorMap: Record<string, string>;
    };

    iconStyles: {
      errorLarge: React.CSSProperties;
      alert: React.CSSProperties;
      success: React.CSSProperties;
      expandMore: React.CSSProperties;
      listLayoutIcon: React.CSSProperties;
    };

    scrollStyles: {
      custom1: CSSObject;
      builderMain: CSSObject;
      elementsPanel: CSSObject;
    };
  }

  interface Palette {
    grey: {
      50?: string;
      100?: string;
      200?: string;
      300?: string;
      400?: string;
      500?: string;
      600?: string;
      700?: string;
      800?: string;
      900?: string;
      905?: string;
      910?: string;
      920?: string;
      930?: string;
      931?: string;
      940?: string;
      950?: string;
      955?: string;
      960?: string;
    };
  }

  interface TypeBackground {
    subtle?: string;
    soft1?: string;
    soft2?: string;
    soft3?: string;
    soft4?: string;
    soft5?: string;
    soft6?: string;
    success?: string;
    successSoft?: string;
    softRed?: string;
    section?: string;
    hero?: string;
    neutral?: string;
    softGrey?: string;
  }

  interface TypeText {
    primaryDark?: string;
    danger?: string;
    tabRoot?: string;
    tabSelected?: string;
  }

  interface ThemeOptions {
    gradient?: {
      from?: string;
      to?: string;
      angle?: string;
      background?: string;
    };

    borders?: Partial<Theme["borders"]>;

    iconStyles?: Partial<Theme["iconStyles"]>;

    brand?: {
      base?: string;
      bgColor1?: string;
      bgColor2?: string;
      bgColor3?: string;
      divider1?: string;
      divider2?: string;
      btnTxt1?: string;
      borderColor1?: string;
      avatarBg1?: string;
      avatarBg2?: string;
      avatarBg3?: string;
      avatarTxt1?: string;
    };

    textStyles?: Partial<Theme["textStyles"]>;
    tabStyles?: {
      base?: SxProps<Theme>;
      createTab?: SxProps<Theme>;
      flowTab?: SxProps<Theme>;
      resultsTab?: SxProps<Theme>;
      indicatorColorMap?: Record<string, string>;
    };
    scrollStyles?: {
      custom1?: CSSObject;
      builderMain?: CSSObject;
      elementsPanel?: CSSObject;
    };
  }

  interface PaletteOptions {
    background?: Partial<PaletteBackground>;
    grey?: Partial<Palette["grey"]>;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    gradientPrimary: true;
    getStarted: true;
    landingSignIn: true;
    backLink1: true;
    backLink2: true;
    textLink1: true;
    textLink2: true;
    headerBtn1: true;
    submitDisabled1: true;
    submit1: true;
    cancelBtn: true;
    submitBtn2: true;
    dangerBtn: true;
    addBtn: true;
  }
}

declare module "@mui/material" {
  interface Color {
    905?: string;
    910?: string;
    920?: string;
    930?: string;
    931?: string;
    935?: string;
    940?: string;
    950?: string;
    955?: string;
    960?: string;
  }
}

declare module "@mui/material/TextField" {
  interface TextFieldPropsVariantOverrides {
    filledRounded: true;
    filledMinimal: true;
    outlineMuted: true;
  }
}
