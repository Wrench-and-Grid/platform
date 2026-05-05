import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Download, ExternalLink } from "lucide-react";
import { useFileDownload } from "../../../hooks/useFileDownload";
import { RESUME_PDF_URL } from "../../../lib/api";

type ResumeDownloadModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ResumeDownloadModal({ isOpen, onClose }: ResumeDownloadModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const downloadRef = useRef<HTMLButtonElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { download, isDownloading } = useFileDownload(
    RESUME_PDF_URL,
    "daisy-gonzalez-resume.pdf"
  );

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const id = setTimeout(() => downloadRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
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
            aria-label="Resume preview"
          >
            <div className="rdm-bar">
              <span className="rdm-title">Resume Preview</span>
              <div className="rdm-bar-actions">
                <button
                  type="button"
                  className="rdm-download-bar-btn"
                  onClick={() => window.open(RESUME_PDF_URL, '_blank', 'noopener,noreferrer')}
                  aria-label="Open resume in new tab"
                >
                  <ExternalLink size={16} />
                </button>
                <button
                  ref={downloadRef}
                  type="button"
                  className="rdm-download-bar-btn"
                  onClick={download}
                  disabled={isDownloading}
                  aria-label={isDownloading ? "Downloading resume…" : "Download resume PDF"}
                >
                  {isDownloading ? "↓" : <Download size={16} />}
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

            <div className="rdm-document">
              <iframe
                ref={iframeRef}
                className="rdm-frame"
                src={`${RESUME_PDF_URL}#toolbar=0&navpanes=0&scrollbar=1&zoom=page-width`}
                title="Resume Preview"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}