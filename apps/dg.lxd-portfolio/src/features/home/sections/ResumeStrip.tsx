import { useFileDownload } from "../../../hooks/useFileDownload";
import { API_URL } from "../../../lib/api";

export default function ResumeStrip() {
  const { download, isDownloading } = useFileDownload(
    `${API_URL}/api/v1/resume`,
    "Daisy-Gonzalez-Resume.pdf"
  );

  return (
    <div className="resume-strip">
      <p>Available for freelance, collaborations &amp; full-time opportunities.</p>
      <button
        type="button"
        className="resume-dl"
        onClick={download}
        disabled={isDownloading}
        aria-label={isDownloading ? "Downloading resume…" : "Download resume PDF"}
      >
        {isDownloading ? "Downloading…" : "Download Resume"}
      </button>
    </div>
  );
}
