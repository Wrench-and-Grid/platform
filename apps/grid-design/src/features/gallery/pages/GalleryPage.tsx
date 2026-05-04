import { useLocation } from "react-router-dom";
import GalleryRoom from "../components/GalleryRoom";
import { galleryItems } from "../data/gallery";
import PageTransition from "../../../components/PageTransition";
import RoutePageHeader from "../../../components/RoutePageHeader";
import useScrollToTop from "../../../hooks/useScrollToTop";
import { getReturnToHash } from "../../../lib/navigation";

export default function GalleryPage() {
  useScrollToTop();

  const location = useLocation();
  const returnTo = getReturnToHash(location.state, "#gallery");

  return (
    <PageTransition kind="gallery" className="route-page route-page--gallery">
      <RoutePageHeader className="page-rail page-rail--gallery" returnTo={returnTo} />

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
