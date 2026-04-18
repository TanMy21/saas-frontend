import { useState } from "react";

import { qrToCanvas } from "../utils/utils";

export const useShareQRActions = (
  qrContainerRef: React.RefObject<HTMLDivElement>,
  shareID: string,
  title: string,
  triggerCopied: (key: string) => void,
  clear: () => void,
  track: (actionType: string) => void,
) => {
  const [copyQrStatus, setCopyQrStatus] = useState<
    "idle" | "copying" | "copied"
  >("idle");

  const [downloadStatus, setDownloadStatus] = useState<
    "idle" | "downloading" | "downloaded"
  >("idle");

  const copyQR = async () => {
    const svgNode = qrContainerRef.current?.querySelector("svg");
    if (!svgNode) return;

    setCopyQrStatus("copying");

    try {
      const canvas = await qrToCanvas(svgNode);

      const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res));

      if (!blob) throw new Error();

      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);

      triggerCopied("qr");
      setCopyQrStatus("copied");
      track("SHARE_QR_COPIED");

      setTimeout(() => {
        setCopyQrStatus("idle");
        clear();
      }, 2000);
    } catch {
      console.error("QR copy failed");
      setCopyQrStatus("idle");
    }
  };

  const downloadQR = async () => {
    const svgNode = qrContainerRef.current?.querySelector("svg");
    if (!svgNode) return;

    setDownloadStatus("downloading");

    try {
      const qrCanvas = await qrToCanvas(svgNode);

      const outerPadding = 24;
      const titleTopOffset = 16;
      const lineHeight = 20;
      const maxLines = 3;
      const gapBetweenTitleAndQR = 12;

      const scale = 2; // increase image quality

      const finalCanvas = document.createElement("canvas");
      const ctx = finalCanvas.getContext("2d");

      if (!ctx) {
        setDownloadStatus("idle");
        return;
      }

      // font
      ctx.font = "600 16px Inter, sans-serif";

      const wrapText = (text: string, maxWidth: number): string[] => {
        const words = text.trim().split(/\s+/);
        if (!words.length) return ["Survey"];

        const lines: string[] = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
          const word = words[i];
          const testLine = `${currentLine} ${word}`;
          const width = ctx.measureText(testLine).width;

          if (width <= maxWidth) {
            currentLine = testLine;
          } else {
            lines.push(currentLine);
            currentLine = word;
          }
        }

        lines.push(currentLine);

        if (lines.length > maxLines) {
          const clipped = lines.slice(0, maxLines);
          clipped[clipped.length - 1] += "…";
          return clipped;
        }

        return lines;
      };

      const maxTextWidth = qrCanvas.width - 16;
      const lines = wrapText(title || "Survey", maxTextWidth);
      const textHeight = lines.length * lineHeight;

      // logical size
      const logicalWidth = qrCanvas.width + outerPadding * 2;
      const logicalHeight =
        outerPadding +
        titleTopOffset +
        textHeight +
        gapBetweenTitleAndQR +
        qrCanvas.height +
        outerPadding;

      // actual canvas size (image quality)
      finalCanvas.width = logicalWidth * scale;
      finalCanvas.height = logicalHeight * scale;

      // reset + scale
      ctx.setTransform(scale, 0, 0, scale, 0, 0);

      ctx.imageSmoothingEnabled = false;

      // background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, logicalWidth, logicalHeight);

      ctx.fillStyle = "#0f172a";
      ctx.textAlign = "left";

      let currentY = outerPadding + titleTopOffset;

      // centered text
      lines.forEach((line) => {
        const textWidth = ctx.measureText(line).width;
        const textX = (logicalWidth - textWidth) / 2;

        ctx.fillText(line, textX, currentY);
        currentY += lineHeight;
      });

      const qrY = currentY + gapBetweenTitleAndQR;

      // centered QR
      const qrX = (logicalWidth - qrCanvas.width) / 2;

      ctx.drawImage(qrCanvas, qrX, qrY);

      // download
      const link = document.createElement("a");
      link.download = `${shareID}-qr.png`;
      link.href = finalCanvas.toDataURL("image/png", 1.0);
      link.click();

      triggerCopied("download");
      setDownloadStatus("downloaded");
      track("SHARE_QR_DOWNLOADED");

      setTimeout(() => {
        setDownloadStatus("idle");
        clear();
      }, 2000);
    } catch (error) {
      console.error("QR download failed", error);
      setDownloadStatus("idle");
    }
  };
  return {
    copyQrStatus,
    downloadStatus,
    copyQR,
    downloadQR,
  };
};
