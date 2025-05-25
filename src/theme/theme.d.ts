import "@mui/material/styles";

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
    };
    brand: {
      base: string;
      bgColor1: string;
      bgColor2: string;
      bgColor3: string;
      divider1: string;
      btnTxt1: string;
    };
    textStyles: {
      gradientPrimary: React.CSSProperties;
      gradientSecondary?: React.CSSProperties;
      strongH6?: React.CSSProperties;
      subtitleText?: React.CSSProperties;
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
      910?: string;
      920?: string;
      950?: string;
      955?: string;
      960?: string;
    };
  }

  interface TypeBackground {
    soft1?: string;
    softRed?: string;
    section?: string;
    hero?: string;
  }

  interface TypeText {
    danger?: string;
  }

  interface ThemeOptions {
    gradient?: {
      from?: string;
      to?: string;
      angle?: string;
      background?: string;
    };
    borders?: Partial<Theme["borders"]>;
    brand?: {
      base?: string;
      bgColor1?: string;
      bgColor2?: string;
      bgColor3?: string;
      divider1?: string;
      btnTxt1?: string;
    };
    textStyles?: Partial<Theme["textStyles"]>;
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
  }
}

declare module "@mui/material" {
  interface Color {
    910?: string;
    920?: string;
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
