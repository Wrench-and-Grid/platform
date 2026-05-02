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
            Whether you're a nonprofit looking for a creative partner, a gallery interested
            in my art, or a recruiter - I'd love to hear from you.
          </p>
          <div className="contact-highlights" aria-label="Focus areas">
            <span>Community campaigns</span>
            <span>Mission-driven brand</span>
            <span>Outreach strategy</span>
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
            <input id="name" className="form-input" type="text" placeholder="Jane Smith" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email address</label>
            <input id="email" className="form-input" type="email" placeholder="jane@organization.org" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="type">I'm reaching out as a</label>
            <select id="type" className="form-input" defaultValue="">
              <option value="" disabled>Select one</option>
              <option>Nonprofit organization</option>
              <option>Prospective client</option>
              <option>Art buyer / gallery</option>
              <option>Recruiter</option>
              <option>Collaborator</option>
              <option>Other</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="message">Message</label>
            <textarea
              id="message"
              className="form-input"
              placeholder="Tell me about your project, opportunity, or interest..."
            />
          </div>
          <button className="form-submit" type="button">Send Message &#x2192;</button>
        </div>
      </div>
    </section>
  );
}
