/**
 * HeroSection — the full-viewport opening section of the homepage.
 *
 * Composition:
 * - Meta bar (est. date + location)
 * - Large display type with name and slash accent
 * - Three-column mid row: discipline list | portrait + tagline | CTA
 * - Scrolling impact strip with looped discipline statements
 *
 * The section element receives `ref={onMountRegion}` so the parent (HomePage)
 * can pass the node to FluidCanvas as its pointer-interaction region — the
 * fluid simulation only responds to pointer events within this element.
 *
 * @param onMountRegion - RefCallback invoked with the `<section>` DOM node
 *                        once the component mounts (or null on unmount).
 */
import type { RefCallback } from "react";
import FloatingLinkedIn from "../../../shared/components/FloatingLinkedIn";

type HeroSectionProps = {
  onMountRegion?: RefCallback<HTMLElement>;
};

const impactStatements = [
  "Nonprofit Program Management",
  "Community Outreach",
  "Mission-Led Storytelling",
  "Creative Direction",
  "Learning Design Impact",
];

export default function HeroSection({ onMountRegion }: HeroSectionProps) {
  return (
    <section className="hero" ref={onMountRegion}>
      <div className="hero-meta-bar">
        <div className="hero-counter">EST. 2023</div>
        <div className="hero-location">Based in New York</div>
      </div>

      <div className="hero-type-wrap">
        <span className="hero-big">DAISY<span className="hero-inline-accent">/</span> G.</span>
      </div>

      <div className="hero-mid">
        <div className="hero-disciplines">
          <p>LXD</p>
          <p>Brand Identity</p>
          <p>Visual Storytelling</p>
          <p>Illustration</p>
        </div>

        <div className="hero-photo-wrap">
          <div className="hero-photo" data-cursor="Portrait">
            <img
              src="/hero.webp"
              alt="Daisy G. portrait"
              fetchPriority="high"
              decoding="async"
              width="380"
              height="507"
            />
            <div className="hero-photo-label">Daisy G. | Creative Director</div>
          </div>
          <p className="hero-tagline">
            Design that moves people&nbsp;&mdash; one deliberate mark, one mission at a time.
          </p>
        </div>

        <div className="hero-right-col">
          <div className="hero-cta">
            <FloatingLinkedIn />
          </div>
        </div>
      </div>

      {/* Looped ticker — items are duplicated to create a seamless infinite scroll */}
      <div className="hero-impact-strip" aria-label="Creative focus areas">
        <div className="hero-impact-track">
          {[...impactStatements, ...impactStatements].map((item, index) => (
            <span key={`${item}-${index}`} className="hero-impact-item">
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
