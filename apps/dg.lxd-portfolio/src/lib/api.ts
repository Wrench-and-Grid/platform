/**
 * CloudFront CDN base URL. Set VITE_CDN_BASE_URL in .env.local (dev) and
 * production env vars. When unset, paths resolve relative to the origin
 * (useful for local asset serving during development).
 */
const CDN_BASE = import.meta.env.VITE_CDN_BASE_URL ?? "";

/**
 * Direct CloudFront URL for the resume PDF.
 * The S3 object is expected at: <bucket>/resume/Daisy-Gonzalez-Resume.pdf
 */
export const RESUME_PDF_URL = `${CDN_BASE}/resume/Daisy-Gonzalez-Resume.pdf`;
