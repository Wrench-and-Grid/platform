import { useState, useEffect } from 'react';
import aboutImage from '../../assets/carousel1.jpg';
import aboutImage2 from '../../assets/carousel2.jpg';
import aboutImage3 from '../../assets/carousel3.png';
import aboutImage4 from '../../assets/carousel4.png';

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
              <button className="carousel-btn carousel-prev" onClick={prevImage} aria-label="Previous image">
                ‹
              </button>
              <button className="carousel-btn carousel-next" onClick={nextImage} aria-label="Next image">
                ›
              </button>
              <div className="carousel-dots">
                {aboutImages.map((_, index) => (
                  <button
                    key={index}
                    className={`dot ${index === currentImageIndex ? 'active' : ''}`}
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
          I'm Daisy Gonzalez - a Creative Director, Communicator and Learning Experience Designer with a deep commitment to
          mission-driven work. My craft sits at the intersection of design, storytelling,
          and social impact, helping nonprofits, brands, and changemakers communicate what
          matters most.
        </p>
        <p className="about-body">
          Whether I'm crafting a campaign, developing a visual identity, or building a learning experience, I bring the same conviction: design and systems aren't opposites.
          Thoughtful communication can move people to act.
        </p>
        <div className="about-stats">
          <div className="stat-item"><div className="stat-num">2+</div><div className="stat-label">Years of practice</div></div>
          <div className="stat-item"><div className="stat-num">5</div><div className="stat-label">Clients &amp; partners</div></div>
          {/* <div className="stat-item"><div className="stat-num">12</div><div className="stat-label">Awards &amp; features</div></div> */}
          <div className="stat-item"><div className="stat-num">5+</div><div className="stat-label">Projects &amp; Designs</div></div>

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
          <p>
            GRID DESIGN partners with nonprofits, teams, and individuals to turn strategy into visuals people can actually feel and act on.
          </p>
        </div>
      </div>
    </section>
  );
}
