/**
 * CloudFront CDN base URL. Set VITE_CDN_BASE_URL in .env.local (dev) and
 * production env vars. When unset, paths resolve relative to the origin
 * (useful for local asset serving during development).
 */
const CDN_BASE = import.meta.env.VITE_CDN_BASE_URL ?? "";

/**
 * Direct URL for the resume PDF.
 * Local: /pdfs/daisy-gonzalez-resume.pdf
 * Production: CDN_BASE/pdfs/daisy-gonzalez-resume.pdf (via CloudFront/S3)
 */
export const RESUME_PDF_URL = `${CDN_BASE}/pdfs/daisy-gonzalez-resume.pdf`;
