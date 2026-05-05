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
import aboutImage from "../../../assets/Carousel01.jpg";
import aboutImage2 from "../../../assets/Carousel02.jpg";
import aboutImage3 from "../../../assets/Carousel03.jpg";
import aboutImage4 from "../../../assets/Carousel04.jpg";
import aboutImage5 from "../../../assets/Carousel05.jpg";
import aboutImage6 from "../../../assets/Carousel06.jpg";
import aboutImage7 from "../../../assets/Carousel07.jpg";
import aboutImage8 from "../../../assets/Carousel08.jpg";
import aboutImage9 from "../../../assets/Carousel09.jpg";

const aboutImages = [aboutImage, aboutImage2, aboutImage3, aboutImage4, aboutImage5, aboutImage6, aboutImage7, aboutImage8, aboutImage9];
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
          I&apos;m Daisy Gonzalez — a Learning Experience Designer, Creative Director, and Communicator. I&apos;m 
          drawn to work that carries meaning and I care deeply about how ideas are shaped, how they&apos;re 
          understood, and what they make people feel.
        </p>

        <p className="about-body">
          My work lives in that space between structure and story — where clarity, intention, and design 
          come together to help people connect, learn, and move forward. I&apos;m interested in building 
          experiences and working with people who share that same commitment to human-centered design — where learning feels engaging, relevant, 
          and personal.
        </p>

        <p className="about-body">
          Creativity is at the center of everything I do. It&apos;s how I make sense of the world, how I 
          solve problems, and how I bring ideas to life. Whether I&apos;m designing a learning experience, 
          shaping a narrative, or developing a creative concept, I approach my work with both curiosity 
          and intention.
        </p>

        <p className="about-body">
          I&apos;m especially drawn to projects that sit at the intersection of education, community, and 
          storytelling — where design can create access, build confidence, and shift how people see 
          themselves and their ideas. For me, this work is not just about creating something well-designed, 
          but about creating something that resonates and stays with people.
        </p>

        <div className="about-stats">
          <div className="stat-item">
            <div className="stat-num">3+</div>
            <div className="stat-label">Years of practice</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">5</div>
            <div className="stat-label">Clients &amp; partners</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">3+</div>
            <div className="stat-label">Projects &amp; Designs</div>
          </div>
        </div>

        <div className="about-tags">
          <span className="tag tag--yellow">Learning & Development</span>
          <span className="tag tag--aqua">LXD</span>
          <span className="tag">Startups</span>
          <span className="tag">EdTech</span>
          <span className="tag">Nonprofits</span>
          <span className="tag">Visual Storytelling</span>
          <span className="tag">Human-centered Design</span>
        </div>

        {/* <div className="about-community-note">
          <div className="about-community-kicker">Community Focus</div>
        </div> */}
      </div>
    </section>
  );
}
