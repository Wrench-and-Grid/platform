import { useEffect, useReducer, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Document, Page, pdfjs } from "react-pdf";
import { AlertCircle, ExternalLink, Loader2, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

type PdfStatus = "loading" | "ready" | "error" | "ios";

type PdfViewerModalProps = {
  url: string | null;
  title: string;
  onClose: () => void;
};

type State = {
  status: PdfStatus;
  blobUrl: string | null;
  errorMsg: string;
  numPages: number;
  currentPage: number;
  scale: number;
};

type Action =
  | { type: "reset" }
  | { type: "ready"; blobUrl: string }
  | { type: "error"; errorMsg: string }
  | { type: "ios" }
  | { type: "loadSuccess"; numPages: number }
  | { type: "setPage"; page: number }
  | { type: "setScale"; scale: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "reset": return { status: "loading", blobUrl: null, errorMsg: "", numPages: 0, currentPage: 1, scale: 1.0 };
    case "ready": return { ...state, status: "ready", blobUrl: action.blobUrl, errorMsg: "" };
    case "error": return { ...state, status: "error", blobUrl: null, errorMsg: action.errorMsg };
    case "ios":   return { ...state, status: "ios", blobUrl: null, errorMsg: "" };
    case "loadSuccess": return { ...state, numPages: action.numPages };
    case "setPage": return { ...state, currentPage: Math.max(1, Math.min(action.page, state.numPages)) };
    case "setScale": return { ...state, scale: Math.max(0.5, Math.min(action.scale, 2.0)) };
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

export default function PdfViewerModal({ url, title, onClose }: PdfViewerModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const openTabRef = useRef<HTMLButtonElement>(null);
  const [state, dispatch] = useReducer(reducer, {
    status: "loading",
    blobUrl: null,
    errorMsg: "",
    numPages: 0,
    currentPage: 1,
    scale: 1.0,
  });

  useEffect(() => {
    if (!url) return;

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

    fetch(url, { signal: controller.signal })
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
  }, [url]);

  useEffect(() => {
    if (!url) return;
    const id = setTimeout(() => {
      if (state.status === "ready") {
        openTabRef.current?.focus();
      } else {
        closeRef.current?.focus();
      }
    }, 60);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(id);
      document.removeEventListener("keydown", onKey);
    };
  }, [url, onClose, state.status]);

  return createPortal(
    <AnimatePresence>
      {url && (
        <motion.div
          className="pdf-vm-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
        >
          <motion.div
            className="pdf-vm-shell"
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label={`PDF viewer: ${title}`}
            aria-busy={state.status === "loading"}
          >
            <div className="pdf-vm-bar">
              <span className="pdf-vm-title">{title}</span>
              <div className="pdf-vm-bar-actions">
                {state.status === "ready" && (
                  <button
                    ref={openTabRef}
                    type="button"
                    className="pdf-vm-open-tab-btn"
                    onClick={() => window.open(url!, '_blank', 'noopener,noreferrer')}
                    aria-label="Open PDF in new tab"
                  >
                    <ExternalLink size={16} />
                  </button>
                )}
                <button
                  ref={closeRef}
                  type="button"
                  className="wdm-close"
                  onClick={onClose}
                  aria-label="Close PDF viewer"
                >
                  ✕
                </button>
              </div>
            </div>

            {state.status === "loading" && (
              <div className="pdf-vm-state" aria-live="polite">
                <Loader2 className="pdf-vm-spinner" size={32} aria-hidden="true" />
                <span>Loading document…</span>
              </div>
            )}

            {state.status === "error" && (
              <div className="pdf-vm-state pdf-vm-state--error" aria-live="assertive">
                <AlertCircle size={32} aria-hidden="true" />
                <p>Could not load the document.</p>
                {state.errorMsg && <code className="pdf-vm-error-code">{state.errorMsg}</code>}
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pdf-vm-fallback-link"
                >
                  Open in new tab ↗
                </a>
              </div>
            )}

            {state.status === "ios" && (
              <div className="pdf-vm-state">
                <ExternalLink size={32} aria-hidden="true" />
                <p>Tap below to view this document.</p>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pdf-vm-fallback-link--primary"
                >
                  Open PDF
                </a>
              </div>
            )}

            {state.status === "ready" && state.blobUrl && (
              <div className="pdf-vm-viewer">
                <div className="pdf-vm-controls">
                  <div className="pdf-vm-nav">
                    <button
                      type="button"
                      className="pdf-vm-nav-btn"
                      onClick={() => dispatch({ type: "setPage", page: state.currentPage - 1 })}
                      disabled={state.currentPage <= 1}
                      aria-label="Previous page"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="pdf-vm-page-info">
                      {state.currentPage} of {state.numPages}
                    </span>
                    <button
                      type="button"
                      className="pdf-vm-nav-btn"
                      onClick={() => dispatch({ type: "setPage", page: state.currentPage + 1 })}
                      disabled={state.currentPage >= state.numPages}
                      aria-label="Next page"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                  <div className="pdf-vm-zoom">
                    <button
                      type="button"
                      className="pdf-vm-zoom-btn"
                      onClick={() => dispatch({ type: "setScale", scale: state.scale - 0.2 })}
                      disabled={state.scale <= 0.5}
                      aria-label="Zoom out"
                    >
                      <ZoomOut size={16} />
                    </button>
                    <span className="pdf-vm-zoom-info">{Math.round(state.scale * 100)}%</span>
                    <button
                      type="button"
                      className="pdf-vm-zoom-btn"
                      onClick={() => dispatch({ type: "setScale", scale: state.scale + 0.2 })}
                      disabled={state.scale >= 2.0}
                      aria-label="Zoom in"
                    >
                      <ZoomIn size={16} />
                    </button>
                  </div>
                </div>
                <div className="pdf-vm-document">
                  <Document
                    file={state.blobUrl}
                    onLoadSuccess={({ numPages }) => dispatch({ type: "loadSuccess", numPages })}
                    onLoadError={(error) => dispatch({ type: "error", errorMsg: error.message })}
                    loading={
                      <div className="pdf-vm-state" aria-live="polite">
                        <Loader2 className="pdf-vm-spinner" size={32} aria-hidden="true" />
                        <span>Loading document…</span>
                      </div>
                    }
                    error={
                      <div className="pdf-vm-state pdf-vm-state--error" aria-live="assertive">
                        <AlertCircle size={32} aria-hidden="true" />
                        <p>Could not load the document.</p>
                      </div>
                    }
                  >
                    <Page
                      pageNumber={state.currentPage}
                      scale={state.scale}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      className="pdf-vm-page"
                    />
                  </Document>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
