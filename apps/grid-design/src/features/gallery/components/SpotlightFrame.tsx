import AbstractArtwork from "../../../components/AbstractArtwork";
import type { GalleryItem } from "../data/gallery";

type SpotlightFrameProps = {
  item: Pick<GalleryItem, "artworkVariant" | "category" | "imageUrl" | "medium" | "title" | "year">;
};

export default function SpotlightFrame({ item }: SpotlightFrameProps) {
  return (
    <figure className="gallery-frame" data-cursor="Inspect">
      <div className="gallery-frame-glow" aria-hidden="true" />
      <div className="gallery-frame-art">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="gallery-frame-media"
            loading="lazy"
          />
        ) : (
          <AbstractArtwork
            variant={item.artworkVariant ?? "resonance"}
            className="gallery-frame-media"
          />
        )}
      </div>
      <figcaption className="gallery-frame-placard">
        <span className="gallery-frame-title">{item.title}</span>
        <span className="gallery-frame-meta">
          <em>{item.medium}</em>
          <strong>{item.category}</strong>
          <span>{item.year}</span>
        </span>
      </figcaption>
    </figure>
  );
}
