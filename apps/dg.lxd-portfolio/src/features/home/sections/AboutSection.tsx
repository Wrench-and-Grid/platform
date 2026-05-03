/**
 * AboutSection — two-column bio section with an auto-advancing portrait
 * carousel on the left and editorial copy + stats on the right.
 *
 * Carousel behaviour:
 * - Auto-advances every 7 seconds via `setInterval`.
 * - Prev/Next buttons and pagination dots allow manual navigation.
 * - The `.about-portrait` container uses `aspect-ratio: 1` (1:1 square)
 *   so the image always fills a consistent square footprint regardless of
 *   the viewport width.
 * - Images use `loading="lazy"` since this section is below the fold.
 */
import { useState, useEffect } from "react";
import aboutImage from "../../../assets/carousel1.webp";
import aboutImage2 from "../../../assets/carousel2.webp";
import aboutImage3 from "../../../assets/carousel3.webp";
import aboutImage4 from "../../../assets/carousel4.webp";

const aboutImages = [aboutImage, aboutImage2, aboutImage3, aboutImage4];
const AUTO_ADVANCE_MS = 7000;

export default function AboutSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  /** Auto-advance timer — resets when the component unmounts. */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % aboutImages.length);
    }, AUTO_ADVANCE_MS);

    return () => clearInterval(interval);
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % aboutImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + aboutImages.length) % aboutImages.length);
  };

  return (
    <section id="about">
      <div className="about-left">
        <div className="about-portrait carousel">
          <img
            src={aboutImages[currentImageIndex]}
            alt="Daisy Gonzalez"
            loading="lazy"
            decoding="async"
          />
          {aboutImages.length > 1 && (
            <>
              <button
                className="carousel-btn carousel-prev"
                onClick={prevImage}
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                className="carousel-btn carousel-next"
                onClick={nextImage}
                aria-label="Next image"
              >
                ›
              </button>
              <div className="carousel-dots">
                {aboutImages.map((_, index) => (
                  <button
                    key={index}
                    className={`dot ${index === currentImageIndex ? "active" : ""}`}
                    onClick={() => setCurrentImageIndex(index)}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="about-right">
        <div className="s-label">About Daisy</div>
        <h2>
          CREATIVE WORK
          <br />
          ROOTED IN <em>purpose.</em>
        </h2>
        <p className="about-body">
          I&apos;m Daisy Gonzalez - a Creative Director, Communicator and Learning Experience
          Designer with a deep commitment to mission-driven work. My craft sits at the
          intersection of design, storytelling, and social impact, helping nonprofits, brands,
          and changemakers communicate what matters most.
        </p>
        <p className="about-body">
          Whether I&apos;m crafting a campaign, developing a visual identity, or building a
          learning experience, I bring the same conviction: design and systems aren&apos;t
          opposites. Thoughtful communication can move people to act.
        </p>

        <div className="about-stats">
          <div className="stat-item">
            <div className="stat-num">2+</div>
            <div className="stat-label">Years of practice</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">5</div>
            <div className="stat-label">Clients &amp; partners</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">5+</div>
            <div className="stat-label">Projects &amp; Designs</div>
          </div>
        </div>

        <div className="about-tags">
          <span className="tag tag--yellow">Brand Identity</span>
          <span className="tag tag--aqua">Campaign Design</span>
          <span className="tag">Illustration</span>
          <span className="tag">Art Direction</span>
          <span className="tag">Nonprofit</span>
          <span className="tag">Visual Storytelling</span>
          <span className="tag">Editorial</span>
        </div>

        <div className="about-community-note">
          <div className="about-community-kicker">Community Focus</div>
        </div>
      </div>
    </section>
  );
}
