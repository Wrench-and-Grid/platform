import { useEffect, useState } from "react";
import aboutImage from "../../../assets/carousel1.jpg";
import aboutImage2 from "../../../assets/carousel2.jpg";
import aboutImage3 from "../../../assets/carousel3.png";
import aboutImage4 from "../../../assets/carousel4.png";

const aboutImages = [aboutImage, aboutImage2, aboutImage3, aboutImage4];

export default function AboutSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % aboutImages.length);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % aboutImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + aboutImages.length) % aboutImages.length);
  };

  return (
    <section id="about">
      <div className="about-left">
        <div className="about-portrait carousel">
          <img src={aboutImages[currentImageIndex]} alt="Daisy Gonzalez" />
          {aboutImages.length > 1 && (
            <>
              <button
                type="button"
                className="carousel-btn carousel-prev"
                onClick={prevImage}
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                type="button"
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
                    type="button"
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
          CREATING WITH
          <br />
          PURPOSE IN <em>mind.</em>
        </h2>
        <p className="about-body">
          My name is Daisy Gonzalez, a Learning Experience Designer, Creative Director, and Communicator
          with a deep commitment to mission-driven work. My craft sits at the
          intersection of design, storytelling, and social impact. I love helping nonprofits,
          brands, and changemakers communicate what matters most.
        </p>
        <p className="about-body">
          Whether I&apos;m crafting a campaign, developing a visual identity, or building a
          learning experience, I bring the same conviction: design and systems aren&apos;t
          opposites. Thoughtful communication can move people to act.
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
            <div className="stat-num">5+</div>
            <div className="stat-label">Projects &amp; Designs</div>
          </div>
        </div>
        <div className="about-tags">
          <span className="tag tag--yellow">Brand Identity</span>
          <span className="tag tag--aqua">Learning Design</span>
          <span className="tag tag--lavender">Illustration</span>
          <span className="tag tag--yellow">Creative Direction</span>
          <span className="tag tag--orange">Visual Storytelling</span>
          <span className="tag tag--yellow">Technical Writing</span>
        </div>
        <div className="about-community-note">
          <div className="about-community-kicker">Community Focus</div>
          <p>
            GRID DESIGN partners with nonprofits, teams, and individuals to turn strategy
            into visuals people can actually feel and act on.
          </p>
        </div>
      </div>
    </section>
  );
}