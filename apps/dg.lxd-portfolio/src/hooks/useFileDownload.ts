import { useCallback, useReducer, useRef } from "react";

export type DownloadStatus = "idle" | "fetching" | "done" | "error";

type State = { status: DownloadStatus };
type Action = { type: "start" } | { type: "done" } | { type: "error" };

function reducer(_state: State, action: Action): State {
  switch (action.type) {
    case "start": return { status: "fetching" };
    case "done":  return { status: "done" };
    case "error": return { status: "error" };
  }
}

export function useFileDownload(
  filePath: string,
  downloadName: string,
  mimeType = "application/pdf"
) {
  const [{ status }, dispatch] = useReducer(reducer, { status: "idle" });
  // Ref tracks the in-flight AbortController so the download callback stays
  // stable (no status in deps) and concurrent calls are safely ignored.
  const controllerRef = useRef<AbortController | null>(null);

  const download = useCallback(async () => {
    if (controllerRef.current) return;

    const controller = new AbortController();
    controllerRef.current = controller;
    dispatch({ type: "start" });

    try {
      const response = await fetch(filePath, { signal: controller.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const buffer = await response.arrayBuffer();
      const blob = new Blob([buffer], { type: mimeType });
      const objectUrl = URL.createObjectURL(blob);

      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = downloadName;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(objectUrl);

      dispatch({ type: "done" });
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      dispatch({ type: "error" });
    } finally {
      controllerRef.current = null;
    }
  }, [filePath, downloadName, mimeType]);

  return { download, status, isDownloading: status === "fetching" };
}
