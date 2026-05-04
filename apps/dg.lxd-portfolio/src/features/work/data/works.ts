/**
 * works.ts — data layer for the Work feature.
 *
 * Exports:
 * - `WorkItem`            — full project record used in the archive list.
 * - `workItems`           — complete ordered project catalogue.
 * - `workShowcaseItems`   — first 4 items surfaced on the homepage showcase.
 * - `workCategoryFilters` — ordered filter options for category pills.
 * - `latestWorkTags`      — deduplicated tag labels (up to 8) for the sidebar.
 */
import GalleryImage from "../../../assets/gallery1.webp";
import GalleryImage2 from "../../../assets/gallery2.webp";
import GalleryImage3 from "../../../assets/gallery3.webp";
import GalleryImage4 from "../../../assets/gallery4.webp";

export type WorkTagTone = "aqua" | "lavender" | "orange" | "yellow";

export type WorkCategory =
  | "Learning & Design"
  | "Community Campaigns"
  | "Brand Identity";

export type WorkCategoryFilter = "All" | WorkCategory;

export interface WorkTag {
  label: string;
  tone: WorkTagTone;
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
}

export const workItems: WorkItem[] = [
  {
    slug: "roots-campaign",
    number: "01",
    title: "Roots Campaign",
    category: "Community Campaigns",
    client: "Earth Neighbors Initiative",
    year: "2025",
    role: "Identity + Campaign Direction",
    description:
      "Full brand identity and campaign design for an environmental nonprofit reaching 200K+ households across three states.",
    imageUrl: GalleryImage,
    tags: [
      { label: "Nonprofit", tone: "yellow" },
      { label: "Branding", tone: "aqua" },
    ],
  },
  {
    slug: "voices-in-print",
    number: "02",
    title: "Voices in Print",
    category: "Learning & Design",
    client: "Reading Forward",
    year: "2024",
    role: "Editorial Illustration",
    description:
      "Editorial illustration series commissioned for a national literacy program, now in classrooms across 14 cities.",
    imageUrl: GalleryImage2,
    tags: [
      { label: "Illustration", tone: "lavender" },
      { label: "Editorial", tone: "yellow" },
    ],
  },
  {
    slug: "meridian-identity-system",
    number: "03",
    title: "Meridian Identity System",
    category: "Brand Identity",
    client: "Meridian Social Enterprise",
    year: "2025",
    role: "Visual System + Art Direction",
    description:
      "Visual identity, art direction, and design system for a social enterprise focused on economic mobility.",
    imageUrl: GalleryImage3,
    tags: [
      { label: "Identity", tone: "aqua" },
      { label: "Art Direction", tone: "orange" },
    ],
  },
  {
    slug: "open-ground-exhibition",
    number: "04",
    title: "Open Ground Exhibition",
    category: "Learning & Design",
    client: "Harbor House Gallery",
    year: "2023",
    role: "Exhibition Design",
    description:
      "A 12-piece fine art series exhibited in New York and Chicago, exploring themes of migration and belonging.",
    imageUrl: GalleryImage4,
    tags: [
      { label: "Fine Art", tone: "lavender" },
      { label: "Exhibition", tone: "yellow" },
    ],
  },
  {
    slug: "city-block-mutual-aid-toolkit",
    number: "05",
    title: "City Block Mutual Aid Toolkit",
    category: "Community Campaigns",
    client: "Brooklyn Relief Network",
    year: "2026",
    role: "Campaign System + Toolkit Design",
    description:
      "A portable visual kit for volunteers and organizers, built to scale fast across multilingual neighborhood events.",
    imageUrl: GalleryImage,
    tags: [
      { label: "Outreach", tone: "orange" },
      { label: "Toolkit", tone: "aqua" },
    ],
  },
  {
    slug: "lantern-listening-tour",
    number: "06",
    title: "Lantern Listening Tour",
    category: "Learning & Design",
    client: "The Listening Project",
    year: "2024",
    role: "Experience Design + Storytelling",
    description:
      "A pop-up storytelling system translating interview recordings into posters, field notes, and a traveling installation.",
    imageUrl: GalleryImage2,
    tags: [
      { label: "Experience", tone: "yellow" },
      { label: "Storytelling", tone: "lavender" },
    ],
  },
];

export const workCategoryFilters: WorkCategoryFilter[] = [
  "All",
  "Learning & Design",
  "Community Campaigns",
  "Brand Identity",
];

/** Unique tag labels across all work items, capped at 8 for sidebar display. */
export const latestWorkTags = Array.from(
  new Set(workItems.flatMap((item) => item.tags.map((tag) => tag.label)))
).slice(0, 8);

export const workShowcaseItems = workItems.slice(0, 4);
