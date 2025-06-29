import { useTheme } from "@mui/material/styles";
import { type Theme } from "@mui/material/styles";

export const useAppTheme = () => {
  const theme = useTheme<Theme>() as Theme & {
    gradient: {
      from: string;
      to: string;
      angle: string;
      background: string;
    };
  };

  return {
    palette: theme.palette,
    brand: theme.brand,
    iconStyle: theme.iconStyles,
    typography: theme.typography,
    shadows: theme.shadows,
    shape: theme.shape,
    zIndex: theme.zIndex,
    components: theme.components,
    gradient: theme.gradient,
    borders: theme.borders,
    primary: theme.palette.primary,
    secondary: theme.palette.secondary,
    text: theme.palette.text,
    background: theme.palette.background,
    grey: theme.palette.grey,
    textStyles: theme.textStyles,
    tabStyles: theme.tabStyles,
    scrollStyles: theme.scrollStyles,
    spacing: theme.spacing,
  };
};
