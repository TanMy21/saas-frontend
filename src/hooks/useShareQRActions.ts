import { useState } from "react";

import { qrToCanvas } from "../utils/utils";

export const useShareQRActions = (
  qrContainerRef: React.RefObject<HTMLDivElement>,
  shareID: string,
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
      const canvas = await qrToCanvas(svgNode);

      const link = document.createElement("a");
      link.download = `${shareID}-qr.png`;
      link.href = canvas.toDataURL();
      link.click();

      triggerCopied("download");
      setDownloadStatus("downloaded");
      track("SHARE_QR_DOWNLOADED");

      setTimeout(() => {
        setDownloadStatus("idle");
        clear();
      }, 2000);
    } catch {
      console.error("QR download failed");
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
