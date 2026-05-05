import { useState } from "react";
import ResumeDownloadModal from "./ResumeDownloadModal";

export default function ResumeStrip() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="resume-strip">
        <p>Available for freelance, collaborations &amp; full-time opportunities.</p>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: ".35rem" }}>
          <button
            type="button"
            className="resume-dl"
            onClick={() => setIsModalOpen(true)}
            aria-label="Download resume PDF"
          >
            View Resume
          </button>
        </div>
      </div>
      <ResumeDownloadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
