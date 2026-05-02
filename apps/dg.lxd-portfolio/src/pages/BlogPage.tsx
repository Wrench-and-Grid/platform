import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import BlogArticleRow from "../components/BlogArticleRow";
import BlogSidebar from "../components/BlogSidebar";
import PageTransition from "../components/PageTransition";
import {
  blogCategoryFilters,
  blogPosts,
  latestBlogTags,
  type BlogCategoryFilter,
} from "../data/posts";
import useScrollToTop from "../hooks/useScrollToTop";

type RouteState = {
  returnTo?: `#${string}`;
};

export default function BlogPage() {
  useScrollToTop();

  const [activeCategory, setActiveCategory] = useState<BlogCategoryFilter>("All");
  const location = useLocation();
  const returnTo = ((location.state as RouteState | null)?.returnTo ?? "#blog") as `#${string}`;
  const visiblePosts =
    activeCategory === "All"
      ? blogPosts
      : blogPosts.filter((post) => post.category === activeCategory);

  return (
    <PageTransition kind="blog" className="route-page route-page--blog">
      <header className="page-rail page-rail--blog">
        <Link to={{ pathname: "/", hash: returnTo }} className="page-back" data-cursor="Back">
          Back
        </Link>
        <Link to="/" className="page-logo" data-cursor="Home">
          <span>GRID</span>
          <span>DESIGN</span>
        </Link>
      </header>

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
