import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AboutSection from "../components/sections/AboutSection";
import BlogSection from "../components/sections/BlogSection";
import ContactSection from "../components/sections/ContactSection";
import GallerySection from "../components/sections/GallerySection";
import HeroSection from "../components/sections/HeroSection";
import NavBar from "../components/sections/NavBar";
import ResumeStrip from "../components/sections/ResumeStrip";
import SiteFooter from "../components/sections/SiteFooter";
import WorkSection from "../components/sections/WorkSection";
import { type GalleryCategory } from "../data/gallery";
import useRevealOnScroll from "../hooks/useRevealOnScroll";

type HomePageProps = {
  onFluidInteractionRegionChange: (node: HTMLElement | null) => void;
};

export default function HomePage({ onFluidInteractionRegionChange }: HomePageProps) {
  const [activeFilter, setActiveFilter] = useState<GalleryCategory>("All");
  const location = useLocation();

  useRevealOnScroll(".blog-card, .work-item, .g-item, .about-right");

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const target = document.querySelector<HTMLElement>(location.hash);

    if (!target) {
      return;
    }

    window.requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [location.hash]);

  return (
    <>
      <NavBar />
      <HeroSection onMountRegion={onFluidInteractionRegionChange} />
      <AboutSection />
      <GallerySection activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      <WorkSection />
      <BlogSection />
      <ResumeStrip />
      <ContactSection />
      <SiteFooter />
    </>
  );
}
