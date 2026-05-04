/**
 * useFileDownload — fetches a file from `filePath` and triggers a browser
 * download via a temporary object URL.
 *
 * Why not just `<a href="..." download>`?
 * Cross-origin URLs and some CDN configs block the `download` attribute.
 * Fetching the file as an `ArrayBuffer` then constructing a `Blob` ensures
 * the browser treats it as a local download regardless of response headers.
 *
 * On fetch failure the hook falls back to `window.open(filePath)` so the
 * user can still access the file in a new tab.
 *
 * @param filePath     - Absolute path (or URL) to the file to download.
 * @param downloadName - Suggested filename shown in the browser save dialog.
 * @param mimeType     - MIME type for the Blob (default: `application/pdf`).
 *
 * @returns `{ download, status, isDownloading }`
 *   - `download`      — async function that initiates the download.
 *   - `status`        — `"idle" | "fetching" | "done" | "error"`.
 *   - `isDownloading` — `true` while the fetch is in flight.
 */
import { useCallback, useState } from "react";

type DownloadStatus = "idle" | "fetching" | "done" | "error";

export function useFileDownload(
  filePath: string,
  downloadName: string,
  mimeType = "application/pdf"
) {
  const [status, setStatus] = useState<DownloadStatus>("idle");

  const download = useCallback(async () => {
    if (status === "fetching") return;

    setStatus("fetching");

    try {
      const response = await fetch(filePath);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const buffer = await response.arrayBuffer();
      const blob = new Blob([buffer], { type: mimeType });
      const url = URL.createObjectURL(blob);

      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = downloadName;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      URL.revokeObjectURL(url);
      setStatus("done");
    } catch {
      setStatus("error");
      window.open(filePath);
    }
  }, [filePath, downloadName, mimeType, status]);

  return { download, status, isDownloading: status === "fetching" };
}
