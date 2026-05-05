import { useEffect, useRef } from "react";
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
  const iframeRef = useRef<HTMLIFrameElement>(null);

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
          >
            <div className="pdf-vm-bar">
              <span className="pdf-vm-title">{title}</span>
              <div className="pdf-vm-bar-actions">
                <button
                  type="button"
                  className="pdf-vm-open-tab-btn"
                  onClick={() => window.open(url!, '_blank', 'noopener,noreferrer')}
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
              <iframe
                ref={iframeRef}
                className="pdf-vm-frame"
                src={`${url}#toolbar=0&navpanes=0&scrollbar=1&zoom=page-width`}
                title={`PDF Viewer: ${title}`}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
