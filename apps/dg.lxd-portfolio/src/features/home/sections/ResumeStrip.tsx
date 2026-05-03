/**
 * ResumeStrip — a full-width availability banner with a PDF download button.
 *
 * The download uses `useFileDownload` to fetch the PDF as a Blob and trigger
 * a native browser save dialog. Falls back to `window.open` if the fetch fails.
 *
 * The PDF must be present at `public/Daisy_Gonzalez_Resume.pdf` so Vite
 * serves it at the static path `/Daisy_Gonzalez_Resume.pdf`.
 */
import { useFileDownload } from "../../../shared/hooks/useFileDownload";

export default function ResumeStrip() {
  const { download, isDownloading } = useFileDownload(
    "/Daisy_Gonzalez_Resume.pdf",
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
