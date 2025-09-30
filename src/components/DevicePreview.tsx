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
        justifyContent: "center",
        width: "32%",
        height: display === "mobile" ? "92vh" : "100%",
        overflow: "hidden",
        // border:"2px solid red",
      }}
    >
      <div
        style={{
          height: "85%",
          aspectRatio: aspect,
          maxWidth: "100%",
          maxHeight: "100%",
          minHeight: 0,
          overflow: "hidden",
          borderRadius: 16,
          // border: "2px solid red",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Fill the mobile viewport */}
        <div className="scrollArea">{children}</div>
      </div>
    </div>
  );
}
