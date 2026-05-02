import type { BlogPost } from "../data/posts";

type BlogArticleRowProps = {
  post: BlogPost;
};

export default function BlogArticleRow({ post }: BlogArticleRowProps) {
  return (
    <article className="blog-article-row" data-cursor="Read">
      <div className="blog-article-issue">{post.issue}</div>
      <div className="blog-article-copy">
        <div className="blog-article-header">
          <h2 className="blog-article-title">{post.title}</h2>
          <div className="blog-article-meta">
            <span className={`blog-pill blog-pill--${post.tone}`}>{post.category}</span>
            <time dateTime={post.isoDate}>{post.date}</time>
          </div>
        </div>
        <p className="blog-article-excerpt">{post.excerpt}</p>
      </div>
    </article>
  );
}
