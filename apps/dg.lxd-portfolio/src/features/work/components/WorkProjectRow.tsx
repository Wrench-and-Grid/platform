import type { WorkItem } from "../data/works";

type WorkProjectRowProps = {
  item: WorkItem;
  onOpen: () => void;
};

export default function WorkProjectRow({ item, onOpen }: WorkProjectRowProps) {
  return (
    <article
      className="archive-item-row work-project-row"
      data-cursor="Project"
      onClick={onOpen}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onOpen(); }}
      tabIndex={0}
      style={{ cursor: "pointer" }}
    >
      <div className="archive-item-issue">{item.number}</div>
      <div className="archive-item-copy">
        <div className="archive-item-header">
          <div>
            <h2 className="archive-item-title">{item.title}</h2>
            <div className="work-project-subhead">
              <span className="work-project-client">{item.client}</span>
              <span>{item.role}</span>
            </div>
          </div>
          <div className="archive-item-meta">
            <span className={`archive-pill archive-pill--${item.tags[0]?.tone ?? "aqua"}`}>
              {item.category}
            </span>
            <span>{item.year}</span>
          </div>
        </div>
        <p className="archive-item-excerpt">{item.description}</p>
        <div className="work-project-tags">
          {item.tags.map((tag) => (
            <span key={tag.label} className={`archive-pill archive-pill--${tag.tone}`}>
              {tag.label}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
