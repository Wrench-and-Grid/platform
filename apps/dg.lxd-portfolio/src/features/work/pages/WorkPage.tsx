/**
 * WorkPage — full project archive page (`/work`).
 *
 * Layout:
 * - Fixed rail nav with Back link and centered SVG logo.
 * - Hero header with archive title and editorial description.
 * - Two-column grid: scrollable project list on the left, sticky sidebar on
 *   the right with category filters, capability tags, and a brief input.
 *
 * State:
 * - `activeCategory` — drives which `WorkItem` entries are visible in the list.
 *
 * Navigation:
 * - The `returnTo` hash is read from React Router location state so the Back
 *   button scrolls the homepage to the section the user navigated from.
 */
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PageTransition from "../../../shared/components/PageTransition";
import WorkProjectRow from "../components/WorkProjectRow";
import WorkSidebar from "../components/WorkSidebar";
import {
  latestWorkTags,
  workCategoryFilters,
  workItems,
  type WorkCategoryFilter,
} from "../data/works";
import useScrollToTop from "../../../shared/hooks/useScrollToTop";

type RouteState = {
  returnTo?: `#${string}`;
};

export default function WorkPage() {
  useScrollToTop();

  const [activeCategory, setActiveCategory] = useState<WorkCategoryFilter>("All");
  const location = useLocation();
  const returnTo = ((location.state as RouteState | null)?.returnTo ?? "#work") as `#${string}`;

  const visibleWork =
    activeCategory === "All"
      ? workItems
      : workItems.filter((item) => item.category === activeCategory);

  return (
    <PageTransition kind="work" className="route-page route-page--archive work-archive-page">
      <nav className="work-page-rail" aria-label="Work archive navigation">
        <Link
          to={{ pathname: "/", hash: returnTo }}
          className="page-back"
          data-cursor="Back"
        >
          Back
        </Link>
        {/* Logo absolutely centred within the fixed rail — same technique as home nav */}
        <Link to="/" className="nav-logo work-page-nav-logo" data-cursor="Home">
          <img
            src="/dg_logo.svg"
            alt="Grid Design logo"
            className="nav-logo-mark"
            width="96"
            height="96"
          />
        </Link>
      </nav>

      <section className="archive-page-hero">
        <div className="page-kicker">Project Archive</div>
        <h1>SEE ALL WORK</h1>
        <p>
          Identity systems, campaign work, editorial commissions, and exhibitions organized
          with a clean archive rhythm.
        </p>
      </section>

      <div className="archive-page-grid">
        <div className="archive-item-list">
          {visibleWork.map((item) => (
            <WorkProjectRow key={item.slug} item={item} />
          ))}
        </div>

        <WorkSidebar
          activeCategory={activeCategory}
          categories={workCategoryFilters}
          onCategoryChange={setActiveCategory}
          tags={latestWorkTags}
        />
      </div>
    </PageTransition>
  );
}
