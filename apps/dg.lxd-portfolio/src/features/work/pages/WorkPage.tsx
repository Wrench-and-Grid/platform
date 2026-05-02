import { useState } from "react";
import { useLocation } from "react-router-dom";
import WorkProjectRow from "../components/WorkProjectRow";
import WorkSidebar from "../components/WorkSidebar";
import {
  latestWorkTags,
  workCategoryFilters,
  workItems,
  type WorkCategoryFilter,
} from "../data/works";
import PageTransition from "../../../shared/components/PageTransition";
import RoutePageHeader from "../../../shared/components/RoutePageHeader";
import useScrollToTop from "../../../shared/hooks/useScrollToTop";
import { getReturnToHash } from "../../../shared/lib/navigation";

export default function WorkPage() {
  useScrollToTop();

  const [activeCategory, setActiveCategory] = useState<WorkCategoryFilter>("All");
  const location = useLocation();
  const returnTo = getReturnToHash(location.state, "#work");
  const visibleWork =
    activeCategory === "All"
      ? workItems
      : workItems.filter((item) => item.category === activeCategory);

  return (
    <PageTransition kind="blog" className="route-page route-page--blog work-archive-page">
      <RoutePageHeader className="page-rail page-rail--blog" returnTo={returnTo} />

      <section className="blog-page-hero">
        <div className="page-kicker">Project Archive</div>
        <h1>SEE ALL WORK</h1>
        <p>
          LXD work, Brand Identity Strategy work and workshops organized.
        </p>
      </section>

      <div className="blog-page-grid">
        <div className="blog-article-list">
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