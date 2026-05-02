import { useState } from "react";
import { useLocation } from "react-router-dom";
import BlogArticleRow from "../components/BlogArticleRow";
import BlogSidebar from "../components/BlogSidebar";
import {
  blogCategoryFilters,
  blogPosts,
  latestBlogTags,
  type BlogCategoryFilter,
} from "../data/posts";
import PageTransition from "../../../shared/components/PageTransition";
import RoutePageHeader from "../../../shared/components/RoutePageHeader";
import useScrollToTop from "../../../shared/hooks/useScrollToTop";
import { getReturnToHash } from "../../../shared/lib/navigation";

export default function BlogPage() {
  useScrollToTop();

  const [activeCategory, setActiveCategory] = useState<BlogCategoryFilter>("All");
  const location = useLocation();
  const returnTo = getReturnToHash(location.state, "#blog");
  const visiblePosts =
    activeCategory === "All"
      ? blogPosts
      : blogPosts.filter((post) => post.category === activeCategory);

  return (
    <PageTransition kind="blog" className="route-page route-page--blog">
      <RoutePageHeader className="page-rail page-rail--blog" returnTo={returnTo} />

      <section className="blog-page-hero">
        <div className="page-kicker">Editorial Spread</div>
        <h1>READ ALL WRITING</h1>
        <p>
          Essays, studio notes, and field reflections on public storytelling, creative leadership,
          and designing for people instead of spectacle.
        </p>
      </section>

      <div className="blog-page-grid">
        <div className="blog-article-list">
          {visiblePosts.map((post) => (
            <BlogArticleRow key={post.id} post={post} />
          ))}
        </div>

        <BlogSidebar
          activeCategory={activeCategory}
          categories={blogCategoryFilters}
          onCategoryChange={setActiveCategory}
          tags={latestBlogTags}
        />
      </div>
    </PageTransition>
  );
}
