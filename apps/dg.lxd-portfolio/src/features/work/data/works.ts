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
import FWImage01 from "../../../assets/FWImage101.png";
import FWImage02 from "../../../assets/FWImage102.png";
import FWImage03 from "../../../assets/FWImage103.png";
import FWImage04 from "../../../assets/FWImage104.png";
import FWImage05 from "../../../assets/FWImage105.png";

// Set VITE_CDN_BASE_URL in .env.local → "https://cdn.yourdomain.com"
// Leave unset during local dev to use the public/pdfs/ fallback folder.
const CDN_BASE = import.meta.env.VITE_CDN_BASE_URL ?? "";

const pdf = (filename: string) => `${CDN_BASE}/pdfs/${filename}`;

export type WorkTagTone = "aqua" | "lavender" | "orange" | "yellow";

export type WorkCategory =
  | "Learning & Design Work"
  | "Community Work"
  | "Visual Identity Work";

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
  /** Short description (1–2 sentences) for preview/list view. */
  shortDescription: string;
  /** Full description for detail view. */
  fullDescription: string;
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
    shortDescription:
      "Developed an interactive React learning experience that translates technical concepts into accessible, engaging instruction.",
    fullDescription:
      "Over the course of 4 months, developed an interactive React learning experience that translates technical concepts into accessible, engaging instruction. In close collaboration with a developer, I led the learning experience design, visual direction, and audio integration to create a cohesive and intuitive experience. The course was tested through multiple rounds of beta testing with intermediate to advanced programmers new to React, allowing us to refine the structure, pacing, and clarity based on real learner feedback..",
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
    shortDescription:
      "Designed and delivered a learning experience translating design principles into accessible, practical tools for small business owners.",
    fullDescription:
      "Collaborated with Corporación Garabato Inspira, who were working with a group of 15–20 small business owners receiving workshops and resources to grow their businesses. A recurring challenge across the group was low budget and limited knowledge of fundamental design principles. Through Applied Technology, I designed and delivered a learning experience that translated these concepts into accessible, practical tools. The focus was on empowering participants to take ownership of their brand and design decisions—building confidence and enabling them to apply these skills independently within their constraints..",
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
    shortDescription:
      "Designed and developed Young Author’s Lab, a 10-session learning experience focused on introducing children to storytelling through structured, creative exploration.",
    fullDescription:
      "Designed and developed Young Author’s Lab, a 10-session learning experience focused on introducing children to storytelling through structured, creative exploration. I delivered in partnership with Corporación Garabato Inspira, the program worked with a cohort of young children from the community and guided them through a progressive learning journey—from recognizing stories in their environment to producing first drafts of illustrated books.The design prioritized learner confidence as a precursor to skill development. Through group storytelling, peer feedback, and iterative creation, children shifted from seeing themselves as consumers of stories to authors of their own narratives. The final outcome included presentation moment where each child shared their work, reinforcing ownership and voice.",
    imageUrl: FWImage03,
    tags: [
      { label: "Nonprofit", tone: "aqua" },
      { label: "Workshop", tone: "orange" },
      { label: "LXD", tone: "lavender" },
    ],
  },
  {
    slug: "brand-and-content-strategy",
    number: "04",
    title: "Brand and Content Strategy",
    category: "Visual Identity Work",
    client: "Andrea Sernobich",
    year: "2026",
    role: "Social Media Strategist",
    shortDescription:
      "Shaped a social media strategy that feels aligned, intentional, and recognizable.",
    fullDescription:
      "Partnered with Andrea to shape a social media strategy that feels aligned, intentional, and recognizable. By defining content direction, tone, and structure, the work focused on turning scattered ideas into a cohesive presence that builds both visibility and trust.",
    imageUrl: FWImage04,
    tags: [
      { label: "Visual Identity", tone: "lavender" },
      { label: "Communications", tone: "yellow" },
    ],
  },
  {
    slug: "community-mural-project",
    number: "05",
    title: "Altavista Community Mural Project",
    category: "Community Work",
    client: "Corporación Garabato Inspira",
    year: "2025",
    role: "Creative Director",
    shortDescription:
      "Directed the creative vision for the Altavista Mural Project, translating community narratives into a cohesive visual experience.",
    fullDescription:
      "Directed the creative vision for the Altavista Mural Project with Corporación Garabato Inspira, translating community narratives into a cohesive visual experience. The role involved defining the concept, guiding collaboration with participants, and ensuring the final piece reflected both collective input and intentional design",
    imageUrl: FWImage05,
    tags: [
      { label: "Nonprofit", tone: "orange" },
      { label: "Muralism", tone: "aqua" },
    ],
  },
  {
    slug: "design-day-program-atd",
    number: "06",
    title: "Design Day Program",
    category: "Community Work",
    client: "ATD NYC",
    year: "2026",
    role: "AVP of Programs",
    shortDescription:
      "Co-led a community-centered Design Day, translating an organizational challenge into a collaborative, volunteer-driven learning experience.",
    fullDescription:
      "In partnership with CIET at LaGuardia Community College, I served as AVP of Programs and co-led the Design Day initiative alongside the VP. We designed the experience around a real organizational challenge, beginning with proposal development to frame the problem and align outcomes. From there, we led volunteer recruitment and structured the event as a collaborative, hands-on experience. I also supported the creation of design assets to guide participants and ensure a cohesive experience. The result was a community-driven learning environment that combined strategy, storytelling, and applied design to generate meaningful solutions for the partner organization.",
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
  "Visual Identity Work",
];

/** Unique tag labels across all work items, capped at 8 for sidebar display. */
export const latestWorkTags = Array.from(
  new Set(workItems.flatMap((item) => item.tags.map((tag) => tag.label)))
).slice(0, 8);

export const workShowcaseItems = workItems.slice(0, 4);
