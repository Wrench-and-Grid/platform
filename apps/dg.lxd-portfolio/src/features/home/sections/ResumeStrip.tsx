export default function ResumeStrip() {
  return (
    <div className="resume-strip">
      <p>Available for freelance, collaborations &amp; full-time opportunities.</p>
      <a href="assets/resume.pdf" className="resume-dl" download>
        <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
          <path d="M8 2v9M5 8l3 3 3-3M3 13h10" />
        </svg>
        Download Resume
      </a>
    </div>
  );
}

