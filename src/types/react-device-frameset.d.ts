// Ensure this path is inside your "include" and "typeRoots" (you already have)
declare module "react-device-frameset" {
  import * as React from "react";

  export type DeviceName =
    | "iPhone X"
    | "iPhone 8"
    | "iPhone 8 Plus"
    | "iPhone 5s"
    | "iPhone 5c"
    | "iPhone 4s"
    | "Galaxy Note 8"
    | "Nexus 5"
    | "Lumia 920"
    | "Samsung Galaxy S5"
    | "HTC One"
    | "iPad Mini"
    | "MacBook Pro"
    | (string & {}); // allow future names

  export interface DeviceFramesetProps {
    device: DeviceName;
    color?: string;
    landscape?: boolean;
    style?: React.CSSProperties;
    children?: React.ReactNode; // ← the missing bit
  }

  const DeviceFrameset: React.FC<DeviceFramesetProps>;
  export default DeviceFrameset; // ← IMPORTANT: default export
}
