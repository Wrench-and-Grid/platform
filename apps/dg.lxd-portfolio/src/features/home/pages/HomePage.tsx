import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { type GalleryCategory } from "../../gallery/data/gallery";
import useRevealOnScroll from "../hooks/useRevealOnScroll";
import AboutSection from "../sections/AboutSection";
import ContactSection from "../sections/ContactSection";
import GallerySection from "../sections/GallerySection";
import HeroSection from "../sections/HeroSection";
import NavBar from "../sections/NavBar";
import ResumeStrip from "../sections/ResumeStrip";
import SiteFooter from "../sections/SiteFooter";
import WorkSection from "../sections/WorkSection";

type HomePageProps = {
  onFluidInteractionRegionChange: (node: HTMLElement | null) => void;
};

export default function HomePage({ onFluidInteractionRegionChange }: HomePageProps) {
  const [activeFilter, setActiveFilter] = useState<GalleryCategory>("All");
  const location = useLocation();

  useRevealOnScroll(".work-item, .g-item, .about-right");

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
      <ResumeStrip />
      <ContactSection />
      <SiteFooter />
    </>
  );
}
