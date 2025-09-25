import * as React from "react";

import * as RDFS from "react-device-frameset";

/**
 * Resolves the component regardless of whether the lib exports:
 * - default
 * - named { DeviceFrameset }
 * - or something else weird in ESM/CJS interop
 */
const ResolvedDeviceFrameset: any =
  (RDFS as any).DeviceFrameset || (RDFS as any).default || (RDFS as any);

const DeviceFrame: React.FC<any> = (props) => {
  const Comp = ResolvedDeviceFrameset;
  if (!Comp) {
    // Safety: don't crash the app if the lib failed to load
    console.error("react-device-frameset export not found:", RDFS);
    return (
      <div style={{ border: "1px dashed red", padding: 8 }}>
        Device frame failed to load
      </div>
    );
  }
  // Use createElement to bypass any lingering JSX typing glitches
  return React.createElement(Comp, props, props.children);
};

export default DeviceFrame;
