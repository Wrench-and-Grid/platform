import heroImage from '../assets/hero.png'

const impactStatements = [
  'Nonprofit Program Management',
  'Community Outreach',
  'Mission-Led Storytelling',
  'Creative Direction',
  'Learning Design Impact',
]

export default function HeroSection() {
  return (
    <section id="home" className="hero">
      <div className="hero-meta-bar">
        <div className="hero-counter">EST. 2023</div>
        <div className="hero-location">Based in New York</div>
      </div>
      <div className="hero-type-wrap">
        <span className="hero-big">
          GRID <span className="hero-inline-accent">#</span> DESIGN
        </span>
      </div>
      {/* <div className="hero-mid">
        <div className="hero-disciplines">
          <p>LXD</p>
          <p>Brand Identity</p>
          <p>Visual Storytelling</p>
          <p>Illustration</p>
        </div>
        <div className="hero-photo-wrap">
          <div className="hero-photo">
            <img src={heroImage} alt="Daisy G. portrait" />
            <div className="hero-photo-label">Daisy G. | Creative Director</div>
          </div>
          <p className="hero-tagline">Art that moves people to act, one mark at a time.</p>
        </div>
        <div className="hero-right-col">
          <div className="hero-cta">
            <a
              href="https://www.linkedin.com/in/daisyg19/"
              target="_blank"
              rel="noopener noreferrer"
              className="floating-linkedin"
              aria-label="Visit LinkedIn"
            >
              <span className="floating-linkedin-badge" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path
                    fill="currentColor"
                    d="M6.94 8.5V19H3.5V8.5h3.44Zm.22-3.25c0 1-.76 1.75-1.94 1.75H5.2c-1.13 0-1.9-.75-1.9-1.75 0-1.03.8-1.75 1.96-1.75s1.88.72 1.9 1.75ZM20.5 12.56V19h-3.44v-6.04c0-1.52-.54-2.56-1.9-2.56-1.03 0-1.64.69-1.9 1.36-.1.24-.12.58-.12.92V19H9.7s.04-9.7 0-10.5h3.44v1.49c.46-.71 1.27-1.73 3.1-1.73 2.26 0 4.26 1.48 4.26 4.66Z"
                  />
                </svg>
              </span>
              <span className="floating-linkedin-label">LinkedIn</span>
            </a>
          </div>
        </div>
      </div> */}
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
  )
}
