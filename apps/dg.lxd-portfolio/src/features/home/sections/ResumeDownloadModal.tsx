import { useEffect, useRef, useState } from "react";
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
  const { download, isDownloading } = useFileDownload(
    RESUME_PDF_URL,
    "daisy-gonzalez-resume.pdf"
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
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
                  onClick={() => window.open(RESUME_PDF_URL, "_blank", "noopener,noreferrer")}
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
              {error ? (
                <div className="rdm-state">
                  <h3 className="rdm-state-title pdf-vm-state-title--light">{error}</h3>
                  <a
                    href={RESUME_PDF_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pdf-vm-fallback-link pdf-vm-fallback-link--primary"
                  >
                    Download Resume
                  </a>
                </div>
              ) : (
                <embed
                  src={`${RESUME_PDF_URL}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
                  type="application/pdf"
                  className="rdm-frame"
                  title="Resume Preview"
                  onError={() => setError("Unable to display resume. Please download to view.")}
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
