import { useFileDownload } from "../../../hooks/useFileDownload";
import { RESUME_PDF_URL } from "../../../lib/api";

export default function ResumeStrip() {
  const { download, isDownloading, status } = useFileDownload(
    RESUME_PDF_URL,
    "daisy-gonzalez-resume.pdf"
  );

  return (
    <div className="resume-strip">
      <p>Available for freelance, collaborations &amp; full-time opportunities.</p>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: ".35rem" }}>
        <button
          type="button"
          className="resume-dl"
          onClick={download}
          disabled={isDownloading || status === "error"}
          aria-label={isDownloading ? "Downloading resume…" : "Download resume PDF"}
        >
          {isDownloading ? "Downloading…" : "Download Resume"}
        </button>
        {status === "error" && (
          <span style={{ fontSize: ".72rem", color: "var(--clr-orange)", letterSpacing: ".02em" }}>
            Resume unavailable — please reach out directly.
          </span>
        )}
      </div>
    </div>
  );
}
