export default function ContactSection() {
  return (
    <section id="contact">
      <div className="contact-inner">
        <div className="contact-left">
          <div className="s-label">Contact</div>
          <h2>
            LET&apos;S MAKE
            <br />
            SOMETHING <em>real.</em>
          </h2>
          <p>
            Whether you're a nonprofit looking for a creative partner or an interested recruiter - I'd love to hear from you.
          </p>
          <div className="contact-highlights" aria-label="Focus areas">
            <span>Community campaigns</span>
            <span>Mission-driven focus</span>
            <span>Outreach strategist</span>
          </div>
          {/* <div className="contact-links">
            <a href="mailto:hello@griddesign.co" className="contact-link">
              <div className="cl-icon">&#x2709;</div>
              hello@griddesign.co
            </a>
            <a href="https://instagram.com" className="contact-link" target="_blank" rel="noopener">
              <div className="cl-icon">ig</div>
              @griddesign
            </a>
            <a href="https://linkedin.com" className="contact-link" target="_blank" rel="noopener">
              <div className="cl-icon">in</div>
              Daisy G. on LinkedIn
            </a>
            <a href="assets/resume.pdf" className="contact-link" download>
              <div className="cl-icon">&#x2193;</div>
              Download Resume (PDF)
            </a>
          </div> */}
        </div>
        <div>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Your name</label>
            <input id="name" className="form-input" type="text" placeholder="Frida Kahlo" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email address</label>
            <input id="email" className="form-input" type="email" placeholder="frida@lacasaazul.org" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="type">I'm reaching out as a</label>
            <select id="type" className="form-input" defaultValue="">
              <option value="" disabled>Select one</option>
              <option>Recruiter</option>
              <option>Collaborator</option>
              <option>Nonprofit organization</option>
              <option>Prospective client</option>
              <option>Other</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="message">Message</label>
            <textarea
              id="message"
              className="form-input"
              placeholder="Tell me a bit about your project, opportunity, or interest..."
            />
          </div>
          <button className="form-submit" type="button">Let's Work! &#x2192;</button>
        </div>
      </div>
      <footer className="contact-footer">
        {/* <div className="footer-logo">DG.</div> */}
        {/* <div className="footer-copy">&copy; 2025 Daisy G. | All rights reserved</div> */}
        <div className="footer-logo">&copy; 2025 Daisy G. | All rights reserved</div>
        {/* <ul className="footer-links">
          <li><a href="#about">About</a></li>
          <li><a href="#gallery">Gallery</a></li>
          <li><a href="#work">Works</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul> */}
      </footer>
    </section>
  );
}
