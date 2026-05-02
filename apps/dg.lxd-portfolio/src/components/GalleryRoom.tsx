import type { GalleryItem } from "../data/gallery";
import SpotlightFrame from "./SpotlightFrame";

type GalleryRoomProps = {
  item: GalleryItem;
};

export default function GalleryRoom({ item }: GalleryRoomProps) {
  return (
    <article className="gallery-room">
      <div className="gallery-room-card">
        <div className="gallery-room-lightbar" aria-hidden="true">
          <span className="gallery-room-lightbar-cap" />
          <span className="gallery-room-lightbar-arm" />
        </div>
        <div className="gallery-room-stage">
          <SpotlightFrame item={item} />
        </div>
        <div className="gallery-room-note">
          <div className="gallery-room-caption">
            <span>{item.collection}</span>
            <span>{item.year}</span>
          </div>
          <p>{item.description}</p>
        </div>
      </div>
    </article>
  );
}
