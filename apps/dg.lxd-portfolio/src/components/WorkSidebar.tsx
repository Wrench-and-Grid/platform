import type { WorkCategoryFilter } from "../data/works";

type WorkSidebarProps = {
  activeCategory: WorkCategoryFilter;
  categories: readonly WorkCategoryFilter[];
  onCategoryChange: (category: WorkCategoryFilter) => void;
  tags: readonly string[];
};

export default function WorkSidebar({
  activeCategory,
  categories,
  onCategoryChange,
  tags,
}: WorkSidebarProps) {
  return (
    <aside className="blog-sidebar work-sidebar">
      <blockquote className="blog-sidebar-quote">
        &ldquo;The strongest projects carry both strategy and feeling. I want the work to
        do its job and leave a mark.&rdquo;
      </blockquote>

      <p className="work-sidebar-note">
        A cross-section of identity systems, editorial commissions, exhibitions, and
        campaign work built for organizations with a clear point of view.
      </p>

      <div className="blog-sidebar-block">
        <div className="blog-sidebar-label">Project Type</div>
        <div className="blog-sidebar-pills">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`blog-filter-pill ${activeCategory === category ? "is-active" : ""}`}
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="blog-sidebar-block">
        <div className="blog-sidebar-label">Capabilities</div>
        <div className="blog-sidebar-tags">
          {tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>

      <form className="blog-subscribe">
        <label className="blog-sidebar-label" htmlFor="work-brief">
          Project Brief
        </label>
        <div className="blog-subscribe-row">
          <input
            id="work-brief"
            type="text"
            className="blog-subscribe-input"
            placeholder="Tell me what you're building"
          />
          <button type="button" className="blog-subscribe-submit" aria-label="Submit project brief">
            &rarr;
          </button>
        </div>
      </form>
    </aside>
  );
}
