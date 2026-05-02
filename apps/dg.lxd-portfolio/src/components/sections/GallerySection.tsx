import AbstractArtwork from "../AbstractArtwork";
import RouteEntryLink from "../RouteEntryLink";
import { galleryFilters, galleryItems, type GalleryCategory } from "../../data/gallery";

type GallerySectionProps = {
  activeFilter: GalleryCategory;
  onFilterChange: (filter: GalleryCategory) => void;
};

export default function GallerySection({ activeFilter, onFilterChange }: GallerySectionProps) {
  return (
    <section id="gallery">
      <div className="gallery-head">
        <div>
          <div className="s-label">Gallery</div>
          <h2>FEATURED WORKS</h2>
        </div>
        <div className="gallery-filter">
          {galleryFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              className={`gf-btn ${activeFilter === filter ? "active" : ""}`}
              onClick={() => onFilterChange(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      <div className="gallery-grid">
        {galleryItems.map((item) => {
          const show = activeFilter === "All" || item.category === activeFilter;

          return (
            <div
              key={item.id}
              className="g-item"
              aria-hidden={!show}
              style={{
                opacity: show ? 1 : 0.14,
                transform: show ? "scale(1)" : "scale(0.97)",
                transition: "opacity 0.3s, transform 0.3s",
              }}
            >
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }} />
              ) : (
                item.artworkVariant && <AbstractArtwork variant={item.artworkVariant} />
              )}
              <div className="g-overlay">
                <div className="g-info">
                  <div className="g-title">{item.title}</div>
                  <div className="g-cat">{item.category}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="gallery-entry">
        <RouteEntryLink
          to="/gallery"
          returnTo="#gallery"
          className="gallery-entry-link"
          cursorLabel="Enter Gallery"
        >
          <span className="gallery-entry-rule" aria-hidden="true" />
          <span>Enter Gallery </span>
          <span className="gallery-entry-rule" aria-hidden="true" />
        </RouteEntryLink>
      </div>
    </section>
  );
}
