import type { BlogCategoryFilter } from "../data/posts";

type BlogSidebarProps = {
  activeCategory: BlogCategoryFilter;
  categories: readonly BlogCategoryFilter[];
  onCategoryChange: (category: BlogCategoryFilter) => void;
  tags: readonly string[];
};

export default function BlogSidebar({
  activeCategory,
  categories,
  onCategoryChange,
  tags,
}: BlogSidebarProps) {
  return (
    <aside className="blog-sidebar">
      <blockquote className="blog-sidebar-quote">
        &ldquo;The best design writing doesn&apos;t just document the work. It lets people
        feel the choices underneath it.&rdquo;
      </blockquote>

      <div className="blog-sidebar-block">
        <div className="blog-sidebar-label">Categories</div>
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
        <div className="blog-sidebar-label">Latest Tags</div>
        <div className="blog-sidebar-tags">
          {tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>

      <form className="blog-subscribe">
        <label className="blog-sidebar-label" htmlFor="subscribe-email">
          Subscribe
        </label>
        <div className="blog-subscribe-row">
          <input
            id="subscribe-email"
            type="email"
            className="blog-subscribe-input"
            placeholder="Email address"
          />
          <button type="button" className="blog-subscribe-submit" aria-label="Submit email">
            &rarr;
          </button>
        </div>
      </form>
    </aside>
  );
}
