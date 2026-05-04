/**
 * works.ts — data layer for the Work feature.
 *
 * Exports:
 * - `WorkItem`            — full project record used in the archive list.
 * - `workItems`           — complete ordered project catalogue.
 * - `workShowcaseItems`   — first 4 items surfaced on the homepage showcase.
 * - `workCategoryFilters` — ordered filter options for category pills.
 * - `latestWorkTags`      — deduplicated tag labels (up to 8) for the sidebar.
 *
 * PDF HOSTING (AWS S3 + CloudFront)
 * ─────────────────────────────────
 * 1. Set VITE_CDN_BASE_URL in your .env.local (dev) and Vercel env vars (prod).
 *    Example: VITE_CDN_BASE_URL=https://cdn.yourdomain.com
 *
 * 2. Upload your PDFs to S3 under the key prefix "pdfs/":
 *    s3://dg-lxd-portfolio-assets/pdfs/<filename>.pdf
 *
 * 3. Each pdfFiles entry below maps to:
 *    ${CDN_BASE}/pdfs/<filename>.pdf
 *    Replace <filename> with the exact S3 object key you uploaded.
 *
 * See docs/aws-pdf-hosting.md for the full S3 + CloudFront setup guide.
 */
import FWImage01 from "../../../assets/FWImage01.jpg";
import FWImage02 from "../../../assets/FWImage02.jpg";
import FWImage03 from "../../../assets/FWImage03.jpg";
import FWImage04 from "../../../assets/FWImage04.jpg";
import FWImage05 from "../../../assets/FWImage05.jpg";

// Set VITE_CDN_BASE_URL in .env.local → "https://cdn.yourdomain.com"
// Leave unset during local dev to use the public/pdfs/ fallback folder.
const CDN_BASE = import.meta.env.VITE_CDN_BASE_URL ?? "";

const pdf = (filename: string) => `${CDN_BASE}/pdfs/${filename}`;

export type WorkTagTone = "aqua" | "lavender" | "orange" | "yellow";

export type WorkCategory =
  | "Learning & Design Work"
  | "Community Work"
  | "Brand Identity Work";

export type WorkCategoryFilter = "All" | WorkCategory;

export interface WorkTag {
  label: string;
  tone: WorkTagTone;
}

export interface PdfFile {
  label: string;
  /** Absolute URL or root-relative path (e.g. "/pdfs/my-doc.pdf"). */
  url: string;
}

export interface WorkItem {
  /** URL slug used as the unique key and for future detail-page routing. */
  slug: string;
  /** Zero-padded display number (e.g. "01"). */
  number: string;
  title: string;
  category: WorkCategory;
  client: string;
  year: string;
  role: string;
  description: string;
  /** Optional hero image URL. Falls back to abstract artwork when absent. */
  imageUrl?: string;
  tags: WorkTag[];
  /** Optional downloadable / viewable PDF attachments shown in the detail modal. */
  pdfFiles?: PdfFile[];
}

export const workItems: WorkItem[] = [
  {
    slug: "react-essential-guide",
    number: "01",
    title: "React Essential Guide",
    category: "Learning & Design Work",
    client: "Nieva Team",
    year: "2024",
    role: "Learning Experience Designer",
    description:
      "Developed an interactive React learning experience that translates technical concepts into accessible, engaging instruction.",
    imageUrl: FWImage01,
    tags: [
      { label: "EdTech", tone: "yellow" },
      { label: "StartUp", tone: "aqua" },
    ],
    pdfFiles: [
      { label: "React Essential Guide", url: pdf("react-essential-guide.pdf") },
    ],
  },
  {
    slug: "applied-technology-workshop",
    number: "02",
    title: "Applied Technology Workshop",
    category: "Learning & Design Work",
    client: "Corporación Garabato Inspira",
    year: "2025",
    role: "LXD + Workshop Facilitator",
    description:
      "Developed and delivered a learning experience that translated design principles into practical tools small business owners could immediately apply to their work.",
    imageUrl: FWImage02,
    tags: [
      { label: "Workshop", tone: "lavender" },
      { label: "Nonprofit", tone: "yellow" },
    ],
    pdfFiles: [
      { label: "Applied Technology", url: pdf("applied-technology.pdf") },
    ],
  },
  {
    slug: "young-authors-lab",
    number: "03",
    title: "Young Authors Lab",
    category: "Learning & Design Work",
    client: "Corporacion Garabato Inspira",
    year: "2025",
    role: "Learning Experience Designer & Program Lead",
    description:
      "Designed and developed a learner-centered writing program that introduces young participants to storytelling and authorship through guided activities and creative exploration. The experience is designed to build confidence, voice, and self-expression.",
    imageUrl: FWImage03,
    tags: [
      { label: "Nonprofit", tone: "aqua" },
      { label: "Workshop", tone: "orange" },
      { label: "LXD", tone: "lavender" },
    ],
  },
  {
    slug: "open-ground-exhibition",
    number: "04",
    title: "Open Ground Exhibition",
    category: "Learning & Design Work",
    client: "Harbor House Gallery",
    year: "2023",
    role: "Exhibition Design",
    description:
      "A 12-piece fine art series exhibited in New York and Chicago, exploring themes of migration and belonging.",
    imageUrl: FWImage04,
    tags: [
      { label: "Fine Art", tone: "lavender" },
      { label: "Exhibition", tone: "yellow" },
    ],
  },
  {
    slug: "city-block-mutual-aid-toolkit",
    number: "05",
    title: "City Block Mutual Aid Toolkit",
    category: "Community Work",
    client: "Brooklyn Relief Network",
    year: "2026",
    role: "Campaign System + Toolkit Design",
    description:
      "A portable visual kit for volunteers and organizers, built to scale fast across multilingual neighborhood events.",
    imageUrl: FWImage05,
    tags: [
      { label: "Outreach", tone: "orange" },
      { label: "Toolkit", tone: "aqua" },
    ],
  },
  {
    slug: "lantern-listening-tour",
    number: "06",
    title: "Lantern Listening Tour",
    category: "Learning & Design Work",
    client: "The Listening Project",
    year: "2024",
    role: "Experience Design + Storytelling",
    description:
      "A pop-up storytelling system translating interview recordings into posters, field notes, and a traveling installation.",
    imageUrl: FWImage05,
    tags: [
      { label: "Experience", tone: "yellow" },
      { label: "Storytelling", tone: "lavender" },
    ],
  },
];

export const workCategoryFilters: WorkCategoryFilter[] = [
  "All",
  "Learning & Design Work",
  "Community Work",
  "Brand Identity Work",
];

/** Unique tag labels across all work items, capped at 8 for sidebar display. */
export const latestWorkTags = Array.from(
  new Set(workItems.flatMap((item) => item.tags.map((tag) => tag.label)))
).slice(0, 8);

export const workShowcaseItems = workItems.slice(0, 4);
