export type WorkTagTone = "aqua" | "lavender" | "orange" | "yellow";
export type WorkCategory =
  | "Learning Experience"
  | "Workshop"
  | "Exhibition"
  | "Experience"
  | "Identity";
export type WorkCategoryFilter = "All" | WorkCategory;

export interface WorkTag {
  label: string;
  tone: WorkTagTone;
}

export interface WorkItem {
  category: WorkCategory;
  client: string;
  description: string;
  number: string;
  role: string;
  slug: string;
  tags: WorkTag[];
  title: string;
  year: string;
  pdf: string;
}

export const workItems: WorkItem[] = [
  {
    slug: "react-essential-guide",
    number: "01",
    title: "React Essential Guide",
    category: "Learning Experience",
    client: "Nieva Team",
    year: "2024",
    role: "Learning Experience Design",
    pdf: "/ReactEssentialGuide.pdf",
    description:
      "A structured React learning experience designed to guide learners through core concepts across 31 lessons and 4 modules.",
    tags: [
      { label: "Instructional Design", tone: "yellow" },
      { label: "UX Learning", tone: "aqua" },
    ],
  },
  {
    slug: "applied-technology",
    number: "02",
    title: "Applied Technology Workshop",
    category: "Workshop",
    client: "Corporación Garabato Inspira",
    year: "2025",
    role: "Workshop Facilitation",
    pdf: "/AppliedTechnology.pdf",
    description:
      "A 45-minute applied technology workshop equipping small business owners with practical design principles to elevate their brand clarity, credibility, and communication—without needing formal design skills.",
    tags: [
      { label: "Instructional Design", tone: "lavender" },
      { label: "Workshop", tone: "yellow" },
    ],
  },
  {
    slug: "meridian-identity-system",
    number: "03",
    title: "Meridian Identity System",
    category: "Identity",
    client: "Meridian Social Enterprise",
    year: "2025",
    role: "Visual System + Art Direction",
    pdf: "/pdfs/ReactEssentialGuide.pdf",
    description:
      "Visual identity, art direction, and design system for a social enterprise focused on economic mobility.",
    tags: [
      { label: "Identity", tone: "aqua" },
      { label: "Art Direction", tone: "orange" },
    ],
  },
  {
    slug: "open-ground-exhibition",
    number: "04",
    title: "Open Ground Exhibition",
    category: "Exhibition",
    client: "Harbor House Gallery",
    year: "2023",
    role: "Exhibition Design",
    pdf: "/pdfs/ReactEssentialGuide.pdf",
    description:
      "A 12-piece fine art series exhibited in New York and Chicago, exploring themes of migration and belonging.",
    tags: [
      { label: "Fine Art", tone: "lavender" },
      { label: "Exhibition", tone: "yellow" },
    ],
  },
  {
    slug: "city-block-mutual-aid-toolkit",
    number: "05",
    title: "City Block Mutual Aid Toolkit",
    category: "Learning Experience",
    client: "Brooklyn Relief Network",
    year: "2026",
    role: "Campaign System + Toolkit Design",
    pdf: "/pdfs/ReactEssentialGuide.pdf",
    description:
      "A portable visual kit for volunteers and organizers, built to scale fast across multilingual neighborhood events.",
    tags: [
      { label: "Outreach", tone: "orange" },
      { label: "Toolkit", tone: "aqua" },
    ],
  },
  {
    slug: "lantern-listening-tour",
    number: "06",
    title: "Lantern Listening Tour",
    category: "Experience",
    client: "The Listening Project",
    year: "2024",
    role: "Experience Design + Storytelling",
    pdf: "/pdfs/ReactEssentialGuide.pdf",
    description:
      "A pop-up storytelling system translating interview recordings into posters, field notes, and a traveling installation.",
    tags: [
      { label: "Experience", tone: "yellow" },
      { label: "Storytelling", tone: "lavender" },
    ],
  },
];

export const workCategoryFilters: WorkCategoryFilter[] = [
  "All",
  "Learning Experience",
  "Workshop",
  "Identity",
  "Exhibition",
  "Experience",
];

export const latestWorkTags = Array.from(
  new Set(workItems.flatMap((item) => item.tags.map((tag) => tag.label)))
).slice(0, 8);

export const featuredWorkItems = workItems.slice(0, 4);