import type { WorkItem } from "../data/works";

type WorkProjectRowProps = {
  item: WorkItem;
};

export default function WorkProjectRow({ item }: WorkProjectRowProps) {
  return (
    <article className="blog-article-row work-project-row" data-cursor="Project">
      <div className="blog-article-issue">{item.number}</div>
      <div className="blog-article-copy">
        <div className="blog-article-header">
          <div>
            <h2 className="blog-article-title">{item.title}</h2>
            <div className="work-project-subhead">
              <span className="work-project-client">{item.client}</span>
              <span>{item.role}</span>
            </div>
          </div>
          <div className="blog-article-meta">
            <span className={`blog-pill blog-pill--${item.tags[0]?.tone ?? "aqua"}`}>
              {item.category}
            </span>
            <span>{item.year}</span>
          </div>
        </div>
        <p className="blog-article-excerpt">{item.description}</p>
        <div className="work-project-tags">
          {item.tags.map((tag) => (
            <span key={tag.label} className={`blog-pill blog-pill--${tag.tone}`}>
              {tag.label}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
