import type { ArtworkVariant } from "../components/AbstractArtwork";

export type BlogCategory = "Art" | "Leadership" | "Nonprofit" | "Process" | "Studio";
export type BlogCategoryFilter = "All" | BlogCategory;
export type BlogTone = "aqua" | "lavender" | "orange" | "yellow";

export interface BlogPost {
  category: BlogCategory;
  date: string;
  excerpt: string;
  id: string;
  isoDate: string;
  issue: string;
  tags: string[];
  thumbVariant: ArtworkVariant;
  title: string;
  tone: BlogTone;
}

export const blogCategoryFilters: BlogCategoryFilter[] = [
  "All",
  "Process",
  "Nonprofit",
  "Art",
  "Leadership",
  "Studio",
];

export const blogPosts: BlogPost[] = [
  {
    id: "analog-before-digital",
    issue: "01",
    category: "Process",
    tone: "yellow",
    isoDate: "2025-03-12",
    date: "March 12, 2025",
    title: "Why I always start with analog before going digital",
    excerpt: "There's something irreplaceable about pencil and paper in the early stages of a project.",
    tags: ["Sketchbooks", "Research", "Process"],
    thumbVariant: "open-water",
  },
  {
    id: "design-for-good",
    issue: "02",
    category: "Nonprofit",
    tone: "aqua",
    isoDate: "2025-02-05",
    date: "Feb 5, 2025",
    title: "Design for good: what mission-driven clients need most",
    excerpt:
      "Working with nonprofits isn't charity work. It's some of the most complex, high-stakes design you'll ever do.",
    tags: ["Mission-led", "Clients", "Messaging"],
    thumbVariant: "convergence",
  },
  {
    id: "color-as-language",
    issue: "03",
    category: "Art",
    tone: "lavender",
    isoDate: "2025-01-20",
    date: "Jan 20, 2025",
    title: "Color as a language: palettes that mean something",
    excerpt: "How I develop color systems that communicate mood, values, and intention.",
    tags: ["Color", "Meaning", "Editorial"],
    thumbVariant: "solstice",
  },
  {
    id: "leadership-through-critiques",
    issue: "04",
    category: "Leadership",
    tone: "orange",
    isoDate: "2025-04-22",
    date: "April 22, 2025",
    title: "Creative leadership looks more like critique than charisma",
    excerpt:
      "The healthiest studios are built on clarity, invitation, and a critique culture that never confuses honesty with harm.",
    tags: ["Leadership", "Feedback", "Studios"],
    thumbVariant: "paper-trace",
  },
  {
    id: "studio-rhythm",
    issue: "05",
    category: "Studio",
    tone: "aqua",
    isoDate: "2024-11-09",
    date: "Nov 9, 2024",
    title: "The quiet studio rituals that keep my work human",
    excerpt:
      "My best decisions usually arrive after the room settles: tape on the wall, music low, and just enough space to listen.",
    tags: ["Studio", "Ritual", "Practice"],
    thumbVariant: "studio-notes",
  },
  {
    id: "mutual-aid-visuals",
    issue: "06",
    category: "Nonprofit",
    tone: "yellow",
    isoDate: "2024-10-02",
    date: "Oct 2, 2024",
    title: "What fast-response mutual aid design taught me about clarity",
    excerpt:
      "When information has to move at community speed, every visual decision either helps people act or slows them down.",
    tags: ["Mutual Aid", "Urgency", "Systems"],
    thumbVariant: "mutual-aid",
  },
];

export const featuredBlogPosts = blogPosts.slice(0, 3);

export const latestBlogTags = Array.from(new Set(blogPosts.flatMap((post) => post.tags))).slice(0, 8);
