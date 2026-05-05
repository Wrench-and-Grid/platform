LOCAL DEV FALLBACK
──────────────────
Place PDF files here during local development (when VITE_CDN_BASE_URL is not set).
File names must match exactly what is used in works.ts, e.g.:

  react-essential-guide.pdf
  applied-technology.pdf

These files are NOT deployed to production. Production PDFs live in:
  s3://dg-lxd-portfolio-assets/pdfs/

See docs/aws-pdf-hosting.md for the full setup guide.
