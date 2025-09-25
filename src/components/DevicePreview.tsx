import { ScreenLayoutProps } from "../utils/types";

const MOBILE = { w: 375, h: 812 };

export default function DevicePreview({
  display = "desktop",
  children,
}: ScreenLayoutProps) {
  if (display === "desktop") return <>{children}</>;

  const aspect = `${MOBILE.w} / ${MOBILE.h}`;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center", // center horizontally
        // alignItems: "center", // center vertically (within the 700px box)
        width: "32%",
        height: "100%", // fixed height 700
        // border:"2px solid red",
      }}
    >
      <div
        style={{
          height: "85%",  
          aspectRatio: aspect,  
          maxWidth: "100%",
          maxHeight: "100%",
          overflow: "hidden",
          borderRadius: 16,
          border: "2px solid red",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Fill the mobile viewport */}
        <div style={{ width: "100%", height: "100%", overflow: "auto" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
