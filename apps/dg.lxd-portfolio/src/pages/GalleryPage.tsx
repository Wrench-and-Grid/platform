import { Link, useLocation } from "react-router-dom";
import GalleryRoom from "../components/GalleryRoom";
import PageTransition from "../components/PageTransition";
import { galleryItems } from "../data/gallery";
import useScrollToTop from "../hooks/useScrollToTop";

type RouteState = {
  returnTo?: `#${string}`;
};

export default function GalleryPage() {
  useScrollToTop();

  const location = useLocation();
  const returnTo = ((location.state as RouteState | null)?.returnTo ?? "#gallery") as `#${string}`;

  return (
    <PageTransition kind="gallery" className="route-page route-page--gallery">
      <header className="page-rail page-rail--gallery">
        <Link to={{ pathname: "/", hash: returnTo }} className="page-back" data-cursor="Back">
          Back
        </Link>
        <Link to="/" className="page-logo" data-cursor="Home">
          <span>GRID</span>
          <span>DESIGN</span>
        </Link>
      </header>

      <section className="gallery-page-hero">
        <div className="gallery-page-copy">
          <div className="page-kicker">Spotlight Hang</div>
          <h1>ENTER THE GALLERY</h1>
          <p>
            A tighter salon-style hang with warm picture lights, soft materials, and a more even
            rhythm across the full collection.
          </p>
        </div>
      </section>

      <div className="gallery-page-grid">
        {galleryItems.map((item) => (
          <GalleryRoom key={item.id} item={item} />
        ))}
      </div>
    </PageTransition>
  );
}
