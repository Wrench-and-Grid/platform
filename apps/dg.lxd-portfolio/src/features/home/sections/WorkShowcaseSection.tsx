/**
 * WorkShowcaseSection — homepage featured projects grid with category filters.
 *
 * Shows the first 4 work items (`workShowcaseItems`) in a CSS grid.
 *
 * Category filter pills navigate to `/work` with the selected category
 * pre-applied and the first item in that category's detail modal pre-opened.
 *
 * Individual project cards navigate to `/work` and open that item's modal
 * directly, letting users preview a project without browsing the full archive.
 *
 * The "View All Work" link uses `RouteEntryLink` to stamp `#work-showcase`
 * into `window.history` so the Back button returns here.
 */
import { useNavigate } from "react-router-dom";
import RouteEntryLink from "../../../components/RouteEntryLink";
import {
  workCategoryFilters,
  workItems,
  workShowcaseItems,
  type WorkCategoryFilter,
} from "../../work/data/works";

export default function WorkShowcaseSection() {
  const navigate = useNavigate();

  function goToCategory(filter: WorkCategoryFilter) {
    const firstInCategory =
      filter === "All" ? undefined : workItems.find((item) => item.category === filter);
    navigate("/work", {
      state: {
        returnTo: "#work-showcase" as const,
        ...(filter !== "All" && { category: filter }),
        ...(firstInCategory && { openSlug: firstInCategory.slug }),
      },
    });
  }

  function goToItem(slug: string) {
    navigate("/work", {
      state: {
        returnTo: "#work-showcase" as const,
        openSlug: slug,
      },
    });
  }

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
              className="wsf-btn"
              onClick={() => goToCategory(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="work-showcase-grid">
        {workShowcaseItems.map((item) => (
          <div
            key={item.slug}
            className="ws-item"
            role="button"
            tabIndex={0}
            aria-label={`View ${item.title}`}
            onClick={() => goToItem(item.slug)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") goToItem(item.slug); }}
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
        ))}
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
