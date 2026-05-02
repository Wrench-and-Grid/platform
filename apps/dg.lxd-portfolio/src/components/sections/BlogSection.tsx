import AbstractArtwork from "../AbstractArtwork";
import RouteEntryLink from "../RouteEntryLink";
import { featuredBlogPosts } from "../../data/posts";

export default function BlogSection() {
  return (
    <section id="blog">
      <div className="blog-head">
        <div>
          <div className="s-label">Blog</div>
          <h2>THINKING OUT LOUD</h2>
        </div>
      </div>
      <p className="blog-intro">
        Notes on creative leadership, public-facing storytelling, and design in service of people.
      </p>
      <div className="blog-grid">
        {featuredBlogPosts.map((post) => (
          <div key={post.id} className="blog-card">
            <div className="blog-thumb">
              <AbstractArtwork variant={post.thumbVariant} />
            </div>
            <div className="blog-meta">
              <span className={`blog-cat blog-cat--${post.tone}`}>{post.category}</span>
              <span className="blog-date">{post.date}</span>
            </div>
            <div className="blog-title">{post.title}</div>
            <p className="blog-excerpt">{post.excerpt}</p>
          </div>
        ))}
      </div>
      <div className="gallery-entry">
        <RouteEntryLink
          to="/blog"
          returnTo="#blog"
          className="gallery-entry-link"
          cursorLabel="All Posts"
        >
          <span className="gallery-entry-rule" aria-hidden="true" />
          <span>All Posts</span>
          <span className="gallery-entry-rule" aria-hidden="true" />
        </RouteEntryLink>
      </div>
    </section>
  );
}
