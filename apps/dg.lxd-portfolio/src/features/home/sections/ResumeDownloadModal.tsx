import { useEffect, useReducer, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Loader2, AlertCircle, ExternalLink } from "lucide-react";
import { useFileDownload } from "../../../hooks/useFileDownload";
import { RESUME_PDF_URL } from "../../../lib/api";

type PdfStatus = "loading" | "ready" | "error" | "ios";

type State = {
  status: PdfStatus;
  blobUrl: string | null;
  errorMsg: string;
};

type Action =
  | { type: "reset" }
  | { type: "ready"; blobUrl: string }
  | { type: "error"; errorMsg: string }
  | { type: "ios" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "reset": return { status: "loading", blobUrl: null, errorMsg: "" };
    case "ready": return { status: "ready", blobUrl: action.blobUrl, errorMsg: "" };
    case "error": return { status: "error", blobUrl: null, errorMsg: action.errorMsg };
    case "ios":   return { status: "ios",   blobUrl: null, errorMsg: "" };
    default:      return state;
  }
}

// iOS Safari cannot render PDFs in iframes reliably — blob URLs silently fail
// or render at unscaled native resolution with no touch-scroll support.
// iPadOS ≥13 reports as "MacIntel" + maxTouchPoints > 1, so check both.
const isIOSDevice =
  typeof navigator !== "undefined" &&
  (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.userAgent.includes("Mac") && navigator.maxTouchPoints > 1));

type ResumeDownloadModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ResumeDownloadModal({ isOpen, onClose }: ResumeDownloadModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const downloadRef = useRef<HTMLButtonElement>(null);
  const [pdfState, dispatch] = useReducer(reducer, {
    status: "loading",
    blobUrl: null,
    errorMsg: "",
  });
  const { download, isDownloading } = useFileDownload(
    RESUME_PDF_URL,
    "daisy-gonzalez-resume.pdf"
  );

  useEffect(() => {
    if (!isOpen) return;

    // iOS: skip the fetch entirely — show a direct-link fallback immediately.
    // The blob → iframe path works on Android Chrome and desktop browsers.
    if (isIOSDevice) {
      dispatch({ type: "ios" });
      return;
    }

    // Fetch the PDF into a blob: URL so the <iframe> src is never a routable
    // path. Without this, the SPA catch-all <Route path="*"> bootstraps inside
    // the iframe and redirects to "/" — showing the home page instead of the PDF.
    let revoked = false;
    let objectUrl: string | null = null;
    const controller = new AbortController();

    dispatch({ type: "reset" });

    fetch(RESUME_PDF_URL, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status} — ${res.statusText}`);
        return res.blob();
      })
      .then((blob) => {
        if (revoked) return;
        objectUrl = URL.createObjectURL(blob);
        dispatch({ type: "ready", blobUrl: objectUrl });
      })
      .catch((err: Error) => {
        if (revoked || err.name === "AbortError") return;
        dispatch({ type: "error", errorMsg: err.message ?? "Unknown error." });
      });

    return () => {
      revoked = true;
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const id = setTimeout(() => downloadRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(id);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="rdm-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
        >
          <motion.div
            className="rdm-shell"
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Resume download"
            aria-busy={isDownloading}
          >
            <div className="rdm-bar">
              <span className="rdm-title">Resume Preview</span>
              <div className="rdm-bar-actions">
                <button
                  ref={downloadRef}
                  type="button"
                  className="rdm-download-bar-btn"
                  onClick={download}
                  disabled={isDownloading}
                  aria-label={isDownloading ? "Downloading resume…" : "Download resume PDF"}
                >
                  {isDownloading ? <Loader2 size={16} className="rdm-spinner" /> : <Download size={16} />}
                </button>
                <button
                  ref={closeRef}
                  type="button"
                  className="rdm-close"
                  onClick={onClose}
                  aria-label="Close resume modal"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="rdm-content">
              {pdfState.status === "loading" && (
                <div className="rdm-state" aria-live="polite">
                  <Loader2 className="rdm-spinner" size={32} aria-hidden="true" />
                  <span>Loading resume…</span>
                </div>
              )}

              {pdfState.status === "error" && (
                <div className="rdm-state rdm-state--error" aria-live="assertive">
                  <AlertCircle size={32} aria-hidden="true" />
                  <p>Could not load the resume.</p>
                  {pdfState.errorMsg && <code className="rdm-error-code">{pdfState.errorMsg}</code>}
                  <a
                    href={RESUME_PDF_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rdm-fallback-link"
                  >
                    Open in new tab
                  </a>
                </div>
              )}

              {pdfState.status === "ios" && (
                <div className="rdm-state">
                  <ExternalLink size={32} aria-hidden="true" />
                  <p>Tap below to view this resume.</p>
                  <a
                    href={RESUME_PDF_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rdm-fallback-link--primary"
                  >
                    Open Resume
                  </a>
                </div>
              )}

              {pdfState.status === "ready" && pdfState.blobUrl && (
                <iframe
                  className="rdm-frame"
                  src={`${pdfState.blobUrl}#toolbar=0&navpanes=0&scrollbar=1&zoom=page-width`}
                  title="Resume Preview"
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}