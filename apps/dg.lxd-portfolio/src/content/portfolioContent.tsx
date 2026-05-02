import type { ReactElement } from "react";
import GalleryImage from "../assets/gallery1.jpg";
import GalleryImage2 from "../assets/gallery2.png";
import GalleryImage3 from "../assets/gallery3.png";
import GalleryImage4 from "../assets/gallery4.png";
import GalleryImage5 from "../assets/gallery5.png";

export type GalleryCategory = "All" | "Painting" | "Print" | "Digital";

export type GalleryItem = {
  id: number;
  title: string;
  category: Exclude<GalleryCategory, "All">;
  artwork: ReactElement;
};

export type WorkItem = {
  number: string;
  title: string;
  description: string;
  tags: Array<{ label: string; className: string }>;
};

export type BlogPost = {
  category: string;
  categoryClassName: string;
  date: string;
  title: string;
  excerpt: string;
  thumb: ReactElement;
};

export const filters: GalleryCategory[] = ["All", "Painting", "Print", "Digital"];

export const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: "Garabato Coloreable",
    category: "Painting",
    artwork: (
      <img src={GalleryImage} alt="gallery image 1" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    ),
  },
  {
    id: 2,
    title: "Mural Altavista",
    category: "Print",
    artwork: (
    <img src={GalleryImage2} alt="gallery image 2" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />

    ),
  },
  {
    id: 3,
    title: "USK April 26, 2025",
    category: "Digital",
    artwork: (
    <img src={GalleryImage3} alt="gallery image 3" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />

    ),
  },
  {
    id: 4,
    title: "Silletero Watercolor",
    category: "Painting",
    artwork: (
    <img src={GalleryImage4} alt="gallery image 4" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />

    ),
  },
  {
    id: 5,
    title: "Nocturne",
    category: "Print",
    artwork: (
    <img src={GalleryImage5} alt="gallery image 5" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />

    ),
  },
  {
    id: 6,
    title: "Open Water",
    category: "Digital",
    artwork: (
      <svg viewBox="0 0 480 240" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <rect width="480" height="240" fill="#aee6ed" opacity=".68" />
        <rect x="0" y="0" width="240" height="240" fill="#3939ff" opacity=".18" />
        <circle cx="240" cy="120" r="120" fill="#f7f5f2" opacity=".48" />
        <circle cx="400" cy="60" r="55" fill="#ff5b22" opacity=".32" />
      </svg>
    ),
  },
  {
    id: 7,
    title: "Solstice",
    category: "Painting",
    artwork: (
      <svg viewBox="0 0 480 240" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <rect width="480" height="240" fill="#f4f386" opacity=".78" />
        <circle cx="150" cy="150" r="130" fill="#ff5b22" opacity=".28" />
        <rect x="200" y="0" width="280" height="240" fill="#b8bfff" opacity=".32" />
        <circle cx="380" cy="80" r="60" fill="#3939ff" opacity=".18" />
      </svg>
    ),
  },
  {
    id: 8,
    title: "Convergence",
    category: "Print",
    artwork: (
      <svg viewBox="0 0 480 240" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <rect width="480" height="240" fill="#b8bfff" />
        <circle cx="100" cy="100" r="80" fill="#3939ff" opacity=".22" />
        <circle cx="300" cy="150" r="100" fill="#ff5b22" opacity=".28" />
        <rect x="0" y="180" width="480" height="60" fill="#f4f386" opacity=".38" />
        <circle cx="440" cy="60" r="45" fill="#aee6ed" opacity=".58" />
      </svg>
    ),
  },
];

export const workItems: WorkItem[] = [
  {
    number: "01",
    title: "Roots Campaign",
    description:
      "Full brand identity and campaign design for an environmental nonprofit reaching 200K+ households across three states.",
    tags: [
      { label: "Nonprofit", className: "work-tag work-tag--yellow" },
      { label: "Branding", className: "work-tag work-tag--aqua" },
    ],
  },
  {
    number: "02",
    title: "Voices in Print",
    description:
      "Editorial illustration series commissioned for a national literacy program, now in classrooms across 14 cities.",
    tags: [
      { label: "Illustration", className: "work-tag work-tag--lavender" },
      { label: "Editorial", className: "work-tag work-tag--yellow" },
    ],
  },
  {
    number: "03",
    title: "Meridian Identity System",
    description:
      "Visual identity, art direction, and design system for a social enterprise focused on economic mobility.",
    tags: [
      { label: "Identity", className: "work-tag work-tag--aqua" },
      { label: "Art Direction", className: "work-tag work-tag--orange" },
    ],
  },
  {
    number: "04",
    title: "Open Ground Exhibition",
    description:
      "A 12-piece fine art series exhibited in New York and Chicago, exploring themes of migration and belonging.",
    tags: [
      { label: "Fine Art", className: "work-tag work-tag--lavender" },
      { label: "Exhibition", className: "work-tag work-tag--yellow" },
    ],
  },
];

export const blogPosts: BlogPost[] = [
  {
    category: "Process",
    categoryClassName: "blog-cat blog-cat--yellow",
    date: "March 12, 2025",
    title: "Why I always start with analog before going digital",
    excerpt:
      "There's something irreplaceable about pencil and paper in the early stages of a project.",
    thumb: (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#aee6ed" />
        <circle cx="200" cy="120" r="110" fill="#3939ff" opacity=".18" />
        <rect x="0" y="180" width="400" height="120" fill="#ff5b22" opacity=".22" />
        <circle cx="320" cy="80" r="50" fill="#f4f386" opacity=".58" />
      </svg>
    ),
  },
  {
    category: "Nonprofit",
    categoryClassName: "blog-cat blog-cat--aqua",
    date: "Feb 5, 2025",
    title: "Design for good: what mission-driven clients need most",
    excerpt:
      "Working with nonprofits isn't charity work - it's some of the most complex, high-stakes design you'll ever do.",
    thumb: (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#b8bfff" />
        <circle cx="100" cy="200" r="120" fill="#ff5b22" opacity=".32" />
        <rect x="200" y="0" width="200" height="300" fill="#3939ff" opacity=".13" />
        <circle cx="300" cy="80" r="70" fill="#f7f5f2" opacity=".48" />
      </svg>
    ),
  },
  {
    category: "Art",
    categoryClassName: "blog-cat blog-cat--lavender",
    date: "Jan 20, 2025",
    title: "Color as a language: palettes that mean something",
    excerpt:
      "How I develop color systems that communicate mood, values, and intention.",
    thumb: (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#f4f386" opacity=".88" />
        <circle cx="300" cy="180" r="130" fill="#ff5b22" opacity=".28" />
        <circle cx="80" cy="80" r="80" fill="#3939ff" opacity=".15" />
        <rect x="0" y="220" width="400" height="80" fill="#b8bfff" opacity=".38" />
      </svg>
    ),
  },
];

