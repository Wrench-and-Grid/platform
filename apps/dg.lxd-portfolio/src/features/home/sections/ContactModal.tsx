import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

const EMAIL = "daisy.gu07@gmail.com";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ContactModal({ isOpen, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => closeRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      clearTimeout(timer);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // fallback: select the text visually — not critical
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="ctm-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Contact Daisy González"
        >
          <motion.div
            className="ctm-panel"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* gradient top bar */}
            <div className="ctm-accent-bar" aria-hidden="true" />

            <button
              ref={closeRef}
              className="ctm-close"
              onClick={onClose}
              aria-label="Close dialog"
            >
              ×
            </button>

            <div className="ctm-body">
              <p className="ctm-eyebrow">Get in touch</p>
              <h2 className="ctm-headline">LET'S CHAT!</h2>
              <p className="ctm-sub">
                Shoot me an email — whether it's a collaboration, a cool
                opportunity, or just a hello, I'd love to hear from you.
              </p>

              <div className="ctm-email-row">
                <span className="ctm-email-icon" aria-hidden="true">✉</span>
                <a
                  className="ctm-email-link"
                  href={`mailto:${EMAIL}`}
                  onClick={onClose}
                >
                  {EMAIL}
                </a>
              </div>

              <div className="ctm-actions">
                <button
                  className={`ctm-copy-btn${copied ? " is-copied" : ""}`}
                  onClick={handleCopy}
                >
                  {copied ? "✓ Copied!" : "Copy email"}
                </button>
                <a
                  className="ctm-open-btn"
                  href={`mailto:${EMAIL}`}
                  onClick={onClose}
                >
                  Open in Mail
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
