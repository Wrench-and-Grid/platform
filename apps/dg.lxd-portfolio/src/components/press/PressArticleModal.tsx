import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Loader2 } from "lucide-react";

export type ActiveArticle = { url: string; title: string; source: string };

type PressArticleModalProps = {
  article: ActiveArticle | null;
  onClose: () => void;
};

export default function PressArticleModal({ article, onClose }: PressArticleModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!article) return;
    setLoading(true);
    document.body.style.overflow = "hidden";
    const id = setTimeout(() => closeRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      clearTimeout(id);
      document.removeEventListener("keydown", onKey);
    };
  }, [article, onClose]);

  return createPortal(
    <AnimatePresence>
      {article && (
        <motion.div
          className="pam-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
        >
          <motion.div
            className="pam-shell"
            onClick={e => e.stopPropagation()}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label={article.title}
          >
            <div className="pam-bar">
              <span className="pam-source">{article.source}</span>
              <div className="pam-bar-actions">
                <button
                  type="button"
                  className="pam-open-btn"
                  onClick={() => window.open(article.url, "_blank", "noopener,noreferrer")}
                  aria-label="Open article in new tab"
                >
                  <ExternalLink size={16} />
                </button>
                <button
                  ref={closeRef}
                  type="button"
                  className="rdm-close"
                  onClick={onClose}
                  aria-label="Close article"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="pam-document">
              {loading && (
                <div className="pam-loading">
                  <Loader2 size={24} className="pam-spinner" />
                  <span>Loading article…</span>
                </div>
              )}
              <iframe
                key={article.url}
                className="pam-frame"
                src={`/api/proxy?url=${encodeURIComponent(article.url)}`}
                title={article.title}
                onLoad={() => setLoading(false)}
                style={{ opacity: loading ? 0 : 1, transition: "opacity 0.3s ease" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
