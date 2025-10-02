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
          border: "3px solid #E0E0E0",
          borderRadius: "24px",
          marginTop: "1%",
          marginBottom: "2%",
          boxShadow: " 0 4px 20px rgba(0, 0, 0, 0.08)",
          transition: "minWidth 1s ease-in-out, opacity 1s ease-in-out",
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
