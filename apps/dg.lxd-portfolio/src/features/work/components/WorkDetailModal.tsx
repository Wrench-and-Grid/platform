import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { WorkItem } from "../data/works";
import PdfViewerModal from "./PdfViewerModal";

type WorkDetailModalProps = {
  item: WorkItem | null;
  onClose: () => void;
};

export default function WorkDetailModal({ item, onClose }: WorkDetailModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [activePdf, setActivePdf] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    if (!item) return;
    document.body.style.overflow = "hidden";
    const id = setTimeout(() => closeRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      clearTimeout(id);
      document.removeEventListener("keydown", onKey);
    };
  }, [item, onClose]);

  const portal = createPortal(
    <AnimatePresence>
      {item && (
        <motion.div
          className="wdm-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 52, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 52, opacity: 0 }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
          >
            <Card className="wdm-panel" role="dialog" aria-modal="true" aria-labelledby="wdm-title">
              <div className="wdm-top">
                <button
                  ref={closeRef}
                  className="wdm-close"
                  onClick={onClose}
                  aria-label="Close dialog"
                >
                  ✕
                </button>
              </div>

              {item.imageUrl && (
                <div className="wdm-image-wrap">
                  <img src={item.imageUrl} alt={item.title} />
                </div>
              )}

              <CardHeader className="wdm-header">
                <div className="wdm-kicker">
                  <Badge className={`archive-pill archive-pill--${item.tags[0]?.tone ?? "aqua"}`}>
                    {item.category}
                  </Badge>
                  <span className="wdm-number">{item.number}</span>
                </div>
                <CardTitle id="wdm-title" className="wdm-title">
                  {item.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="wdm-body">
                <div className="wdm-meta">
                  <div className="wdm-meta-row">
                    <span className="wdm-meta-label">Client</span>
                    <span className="wdm-meta-value">{item.client}</span>
                  </div>
                  <div className="wdm-meta-row">
                    <span className="wdm-meta-label">Year</span>
                    <span className="wdm-meta-value">{item.year}</span>
                  </div>
                  <div className="wdm-meta-row">
                    <span className="wdm-meta-label">Role</span>
                    <span className="wdm-meta-value">{item.role}</span>
                  </div>
                </div>

                <p className="wdm-description">{item.description}</p>
              </CardContent>

              {item.pdfFiles && item.pdfFiles.length > 0 && (
                <div className="wdm-pdf-section">
                  <p className="wdm-pdf-label">Documents</p>
                  <div className="wdm-pdf-grid">
                    {item.pdfFiles.map((pdf) => (
                      <button
                        key={pdf.label}
                        type="button"
                        className="wdm-pdf-thumb"
                        onClick={() => setActivePdf({ url: pdf.url, title: pdf.label })}
                        aria-label={`Open PDF: ${pdf.label}`}
                      >
                        Open PDF
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <CardFooter className="wdm-tags">
                {item.tags.map((tag) => (
                  <Badge key={tag.label} className={`archive-pill archive-pill--${tag.tone}`}>
                    {tag.label}
                  </Badge>
                ))}
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );

  return (
    <>
      {portal}
      <PdfViewerModal
        url={activePdf?.url ?? null}
        title={activePdf?.title ?? ""}
        onClose={() => setActivePdf(null)}
      />
    </>
  );
}
