import GalleryImage from "../../../assets/gallery1.webp";
import GalleryImage2 from "../../../assets/gallery2.webp";
import GalleryImage3 from "../../../assets/gallery3.webp";
import GalleryImage4 from "../../../assets/gallery4.webp";
import GalleryImage5 from "../../../assets/gallery5.webp";
import type { ArtworkVariant } from "../../../lib/artwork";

export type GalleryCategory = "All" | "Painting" | "Print" | "Digital";

export interface GalleryItem {
  artworkVariant?: ArtworkVariant;
  category: Exclude<GalleryCategory, "All">;
  collection: string;
  description: string;
  id: number;
  medium: string;
  title: string;
  year: string;
  imageUrl?: string;
}

export const galleryFilters: GalleryCategory[] = ["All", "Painting", "Print", "Digital"];

export const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: "Garabato Coloreable",
    category: "Painting",
    imageUrl: GalleryImage,
    medium: "Acrylic on panel",
    year: "2025",
    collection: "Signal Archive",
    description: "A saturated field study on how grief and optimism can share the same frame.",
  },
  {
    id: 2,
    title: "Mural Altavista",
    category: "Print",
    imageUrl: GalleryImage2,
    medium: "Risograph diptych",
    year: "2024",
    collection: "Public Memory Prints",
    description: "A sharp-edged print balancing civic geometry with a softer human horizon.",
  },
  {
    id: 3,
    title: "USK April 26, 2025",
    category: "Digital",
    imageUrl: GalleryImage3,
    medium: "Digital pigment study",
    year: "2025",
    collection: "Process Fragments",
    description: "A color record of outreach sketches made while listening to neighborhood stories.",
  },
  {
    id: 4,
    title: "Silletero Watercolor",
    category: "Painting",
    imageUrl: GalleryImage4,
    medium: "Mixed media on linen",
    year: "2023",
    collection: "Open Ground",
    description: "An abstract portal piece about migration, pause, and crossing into shared space.",
  },
  {
    id: 5,
    title: "Nocturne",
    category: "Print",
    imageUrl: GalleryImage5,
    medium: "Screenprint",
    year: "2024",
    collection: "Evening Works",
    description: "A darker study where warm signal flares rise out of a nearly black field.",
  },
  {
    id: 6,
    title: "Open Water",
    category: "Digital",
    artworkVariant: "open-water",
    medium: "Motion still",
    year: "2026",
    collection: "Blue Shift",
    description: "An airy composition built from the same currents that power the site background.",
  },
  {
    id: 7,
    title: "Solstice",
    category: "Painting",
    artworkVariant: "solstice",
    medium: "Acrylic and chalk",
    year: "2023",
    collection: "Seasonal Notes",
    description: "A warm-spectrum canvas tracking the emotional temperature of public gathering.",
  },
  {
    id: 8,
    title: "Convergence",
    category: "Print",
    artworkVariant: "convergence",
    medium: "Archival giclee",
    year: "2025",
    collection: "Signal Archive",
    description: "Circular forms stack like overlapping conversations in a room built for exchange.",
  },
];
