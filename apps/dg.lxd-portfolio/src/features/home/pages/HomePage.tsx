/**
 * HomePage — root page rendered at `/`.
 *
 * `onFluidInteractionRegionChange` — a `RefCallback` passed to `HeroSection`
 * which forwards the hero DOM node up to `App`. `App` then passes that node
 * to `FluidCanvas` so the WebGL simulation only reacts to pointer events
 * within the hero viewport.
 *
 * Scroll restoration:
 * - On mount, if the URL contains a hash (e.g. `/#work-showcase` from a Back
 *   navigation), a `requestAnimationFrame` deferred `scrollIntoView` is used
 *   to ensure the target section has painted before scrolling to it.
 */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AboutSection from "../sections/AboutSection";
import ContactSection from "../sections/ContactSection";
import HeroSection from "../sections/HeroSection";
import NavBar from "../sections/NavBar";
import ResumeStrip from "../sections/ResumeStrip";
import WorkShowcaseSection from "../sections/WorkShowcaseSection";
import useRevealOnScroll from "../../../hooks/useRevealOnScroll";

type HomePageProps = {
  onFluidInteractionRegionChange: (node: HTMLElement | null) => void;
};

export default function HomePage({ onFluidInteractionRegionChange }: HomePageProps) {
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
      <WorkShowcaseSection />
      <ResumeStrip />
      <ContactSection />
    </>
  );
}
