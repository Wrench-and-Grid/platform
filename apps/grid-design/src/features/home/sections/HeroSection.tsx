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
