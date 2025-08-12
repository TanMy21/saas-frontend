import type { Theme } from "@mui/material/styles";

declare module "@mui/system" {
  interface SxProps<T = Theme> {
    [key: string]: any;
  }
}