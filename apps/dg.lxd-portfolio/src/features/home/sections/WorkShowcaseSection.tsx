/**
 * WorkShowcaseSection — homepage featured projects grid with category filters.
 *
 * Shows the first 4 work items (`workShowcaseItems`) in a CSS grid. Items
 * outside the active filter fade and scale down rather than being removed
 * from the DOM — this preserves layout stability and allows smooth CSS
 * transitions without a layout recalculation.
 *
 * The "View All Work" link uses `RouteEntryLink` to:
 * 1. Navigate to `/work` with `returnTo` state so the Back button returns here.
 * 2. Stamp `#work-showcase` into `window.history` on the outgoing navigation.
 *
 * @param activeFilter   - Currently selected category filter.
 * @param onFilterChange - Callback to update the active filter in the parent.
 */
import RouteEntryLink from "../../../shared/components/RouteEntryLink";
import {
  workCategoryFilters,
  workShowcaseItems,
  type WorkCategoryFilter,
} from "../../work/data/works";

type WorkShowcaseSectionProps = {
  activeFilter: WorkCategoryFilter;
  onFilterChange: (filter: WorkCategoryFilter) => void;
};

export default function WorkShowcaseSection({
  activeFilter,
  onFilterChange,
}: WorkShowcaseSectionProps) {
  return (
    <section id="work-showcase">
      <div className="work-showcase-head">
        <div>
          <div className="s-label">Work</div>
          <h2>FEATURED PROJECTS</h2>
        </div>
        <div className="work-showcase-filter">
          {workCategoryFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              className={`wsf-btn ${activeFilter === filter ? "active" : ""}`}
              onClick={() => onFilterChange(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="work-showcase-grid">
        {workShowcaseItems.map((item) => {
          const show = activeFilter === "All" || item.category === activeFilter;

          return (
            <div
              key={item.slug}
              className="ws-item"
              aria-hidden={!show}
              style={{
                opacity: show ? 1 : 0.14,
                transform: show ? "scale(1)" : "scale(0.97)",
                transition: "opacity 0.3s, transform 0.3s",
              }}
            >
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  style={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }}
                />
              )}
              <div className="ws-overlay">
                <div className="ws-info">
                  <div className="ws-title">{item.title}</div>
                  <div className="ws-details">
                    <span className="ws-client">{item.client}</span>
                    <span className="ws-year">{item.year}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="work-showcase-entry">
        <RouteEntryLink
          to="/work"
          returnTo="#work-showcase"
          className="work-showcase-entry-link"
          cursorLabel="View All Work"
        >
          View All Work
        </RouteEntryLink>
      </div>
    </section>
  );
}
