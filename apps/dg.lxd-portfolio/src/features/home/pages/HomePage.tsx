/**
 * HomePage — root page rendered at `/`.
 *
 * Orchestrates all homepage sections and manages two pieces of cross-section
 * state:
 *
 * 1. `activeWorkFilter` — passed down to `WorkShowcaseSection` so the filter
 *    state persists through the section's lifetime without being lifted further.
 *
 * 2. `onFluidInteractionRegionChange` — a `RefCallback` passed to `HeroSection`
 *    which forwards the hero DOM node up to `App`. `App` then passes that node
 *    to `FluidCanvas` so the WebGL simulation only reacts to pointer events
 *    within the hero viewport.
 *
 * Scroll restoration:
 * - On mount, if the URL contains a hash (e.g. `/#work-showcase` from a Back
 *   navigation), a `requestAnimationFrame` deferred `scrollIntoView` is used
 *   to ensure the target section has painted before scrolling to it.
 */
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AboutSection from "../sections/AboutSection";
import ContactSection from "../sections/ContactSection";
import HeroSection from "../sections/HeroSection";
import NavBar from "../sections/NavBar";
import ResumeStrip from "../sections/ResumeStrip";
import WorkShowcaseSection from "../sections/WorkShowcaseSection";
import { type WorkCategoryFilter } from "../../work/data/works";
import useRevealOnScroll from "../../../hooks/useRevealOnScroll";

type HomePageProps = {
  onFluidInteractionRegionChange: (node: HTMLElement | null) => void;
};

export default function HomePage({ onFluidInteractionRegionChange }: HomePageProps) {
  const [activeWorkFilter, setActiveWorkFilter] = useState<WorkCategoryFilter>("All");
  const location = useLocation();

  useRevealOnScroll(".work-item, .g-item, .about-right");

  /** Scroll to the hash anchor after the page has painted. */
  useEffect(() => {
    if (!location.hash) return;

    const target = document.querySelector<HTMLElement>(location.hash);
    if (!target) return;

    window.requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [location.hash]);

  return (
    <>
      <NavBar />
      <HeroSection onMountRegion={onFluidInteractionRegionChange} />
      <AboutSection />
      <WorkShowcaseSection activeFilter={activeWorkFilter} onFilterChange={setActiveWorkFilter} />
      <ResumeStrip />
      <ContactSection />
    </>
  );
}
