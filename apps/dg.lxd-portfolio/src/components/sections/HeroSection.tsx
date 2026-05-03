import type { RefCallback } from "react";
import heroImage from "../../assets/hero.png";
import FloatingLinkedIn from "../FloatingLinkedIn";

type HeroSectionProps = {
  onMountRegion?: RefCallback<HTMLElement>;
};

export default function HeroSection({ onMountRegion }: HeroSectionProps) {
  const impactStatements = [
    "Nonprofit Program Management",
    "Community Outreach",
    "Mission-Led Storytelling",
    "Creative Direction",
    "Learning Design Impact",
  ];

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
            <img src={heroImage} alt="Daisy G. portrait" />
            <div className="hero-photo-label">Daisy G. | Creative Director</div>
          </div>
          <p className="hero-tagline">Art that moves people to act - one mark at a time.</p>
        </div>
        <div className="hero-right-col">
          <div className="hero-cta">
            <FloatingLinkedIn />
            {/* <a href="#work" className="btn-primary" data-cursor="View Work">View Works</a>
            <a href="#gallery" className="btn-ghost" data-cursor="Gallery">Gallery</a> */}
          </div>
        </div>
      </div>
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
