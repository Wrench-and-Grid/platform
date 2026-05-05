import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

type PdfViewerModalProps = {
  url: string | null;
  title: string;
  onClose: () => void;
};

export default function PdfViewerModal({ url, title, onClose }: PdfViewerModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [prevUrl, setPrevUrl] = useState(url);
  const [error, setError] = useState<string | null>(null);

  if (url !== prevUrl) {
    setPrevUrl(url);
    setError(null);
  }

  useEffect(() => {
    if (!url) return;
    const id = setTimeout(() => closeRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
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
          >
            <div className="pdf-vm-bar">
              <span className="pdf-vm-title">{title}</span>
              <div className="pdf-vm-bar-actions">
                <button
                  type="button"
                  className="pdf-vm-open-tab-btn"
                  onClick={() => window.open(url!, "_blank", "noopener,noreferrer")}
                  aria-label="Open PDF in new tab"
                >
                  <ExternalLink size={16} />
                </button>
                <button
                  ref={closeRef}
                  type="button"
                  className="rdm-close"
                  onClick={onClose}
                  aria-label="Close PDF viewer"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="pdf-vm-document">
              {error ? (
                <div className="pdf-vm-state pdf-vm-state--error">
                  <div className="pdf-vm-state-title pdf-vm-state-title--light">{error}</div>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pdf-vm-fallback-link pdf-vm-fallback-link--primary"
                  >
                    Download PDF
                  </a>
                </div>
              ) : (
                <embed
                  src={`${url}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
                  type="application/pdf"
                  className="pdf-vm-frame"
                  title={`PDF Viewer: ${title}`}
                  onError={() => setError("Unable to display PDF. Please download to view.")}
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
