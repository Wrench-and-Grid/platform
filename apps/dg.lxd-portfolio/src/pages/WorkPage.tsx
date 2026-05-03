import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import WorkProjectRow from "../components/WorkProjectRow";
import WorkSidebar from "../components/WorkSidebar";
import {
  latestWorkTags,
  workCategoryFilters,
  workItems,
  type WorkCategoryFilter,
} from "../data/works";
import useScrollToTop from "../hooks/useScrollToTop";

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
      <header className="page-rail page-rail--archive">
        <Link to={{ pathname: "/", hash: returnTo }} className="page-back" data-cursor="Back">
          Back
        </Link>
        <Link to="/" className="page-logo" data-cursor="Home">
          <span>GRID</span>
          <span>DESIGN</span>
        </Link>
      </header>

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
