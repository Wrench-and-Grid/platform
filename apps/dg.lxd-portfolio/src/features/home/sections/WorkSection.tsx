import { featuredWorkItems } from "../../work/data/works";
import RouteEntryLink from "../../../shared/components/RouteEntryLink";

export default function WorkSection() {
  return (
    <section id="work">
      <div className="work-head">
        <div className="s-label">My Work</div>
        <h2>LXD PORTFOLIO</h2>
      </div>
      <p className="work-intro">
        Experiences that translate complex ideas into clear, engaging journeys that drive real understanding, behavior change, and meaningful impact.
      </p>
      <div className="work-list">
        {featuredWorkItems.map((item) => (
          <div key={item.number} className="work-item">
            <div className="work-num">{item.number}</div>
            <div className="work-title">{item.title}</div>
            <div>
              <p className="work-desc">{item.description}</p>
              <div className="work-tags">
                {item.tags.map((tag) => (
                  <span key={tag.label} className={`work-tag work-tag--${tag.tone}`}>
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="work-arrow">&#x2197;</div>
          </div>
        ))}
      </div>
      <div className="work-entry">
        <RouteEntryLink
          to="/work"
          returnTo="#work"
          className="gallery-entry-link"
          cursorLabel="See All Work"
        >
          <span className="gallery-entry-rule" aria-hidden="true" />
          <span>See All Work </span>
          <span className="gallery-entry-rule" aria-hidden="true" />
        </RouteEntryLink>
      </div>
    </section>
  );
}