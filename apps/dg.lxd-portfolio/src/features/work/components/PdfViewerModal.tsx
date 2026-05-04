import { useEffect, useReducer, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Loader2 } from "lucide-react";

type PdfStatus = "loading" | "ready" | "error";

type PdfViewerModalProps = {
  url: string | null;
  title: string;
  onClose: () => void;
};

type State = {
  status: PdfStatus;
  blobUrl: string | null;
  errorMsg: string;
};

type Action =
  | { type: "reset" }
  | { type: "ready"; blobUrl: string }
  | { type: "error"; errorMsg: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "reset":
      return { status: "loading", blobUrl: null, errorMsg: "" };
    case "ready":
      return { status: "ready", blobUrl: action.blobUrl, errorMsg: "" };
    case "error":
      return { status: "error", blobUrl: null, errorMsg: action.errorMsg };
    default:
      return state;
  }
}

export default function PdfViewerModal({ url, title, onClose }: PdfViewerModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [state, dispatch] = useReducer(reducer, { status: "loading", blobUrl: null, errorMsg: "" });

  // Fetch the PDF into a blob: URL so the <iframe> src is never a routable path.
  // Without this, the SPA's catch-all <Route path="*"> boots inside the iframe
  // and immediately redirects to "/" — showing the home page instead of the PDF.
  useEffect(() => {
    if (!url) return;

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
    const id = setTimeout(() => closeRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(id);
      document.removeEventListener("keydown", onKey);
    };
  }, [url, onClose]);

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
                  Open in new tab
                </a>
              </div>
            )}

            {state.status === "ready" && state.blobUrl && (
              <iframe
                className="pdf-vm-frame"
                src={`${state.blobUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                title={title}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
