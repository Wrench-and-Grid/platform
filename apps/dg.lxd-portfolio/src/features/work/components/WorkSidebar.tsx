/**
 * WorkSidebar — sticky aside panel on the WorkPage archive.
 *
 * Contains:
 * - An editorial pull-quote.
 * - A short narrative description of the archive's scope.
 * - Category filter pills that delegate selection up to WorkPage state.
 * - A capabilities tag cloud derived from `latestWorkTags`.
 * - A project brief input for lightweight in-page lead capture.
 *
 * @param activeCategory   - Currently selected filter (highlighted pill).
 * @param categories       - Ordered list of filter options.
 * @param onCategoryChange - Callback invoked when a filter pill is clicked.
 * @param tags             - Flat list of capability tag labels.
 */
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
    <aside className="archive-sidebar work-sidebar">
      <blockquote className="archive-sidebar-quote">
        &ldquo;The strongest projects carry both strategy and feeling. I want the work to
        do its job and leave a mark.&rdquo;
      </blockquote>

      <p className="work-sidebar-note">
        A cross-section of identity systems, editorial commissions, exhibitions, and
        campaign work built for organizations with a clear point of view.
      </p>

      <div className="archive-sidebar-block">
        <div className="archive-sidebar-label">Project Type</div>
        <div className="archive-sidebar-pills">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`archive-filter-pill ${activeCategory === category ? "is-active" : ""}`}
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="archive-sidebar-block">
        <div className="archive-sidebar-label">Capabilities</div>
        <div className="archive-sidebar-tags">
          {tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>

      <form className="archive-brief">
        <label className="archive-sidebar-label" htmlFor="work-brief">
          Project Brief
        </label>
        <div className="archive-brief-row">
          <input
            id="work-brief"
            type="text"
            className="archive-brief-input"
            placeholder="Tell me what you're building"
          />
          <button type="button" className="archive-brief-submit" aria-label="Submit project brief">
            &rarr;
          </button>
        </div>
      </form>
    </aside>
  );
}
