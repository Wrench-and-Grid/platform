/**
 * GrainFilter — injects an off-screen SVG `<defs>` block that defines two
 * reusable CSS `filter` references:
 *
 * - `#grain`       — subtle noise overlay used via `filter: url(#grain)` on
 *                    the `<body>` or page wrapper to give a tactile texture.
 * - `#spray-rough` — displacement-based roughness used for ink/stamp effects.
 *
 * The element is `position: absolute` with zero dimensions so it takes no
 * space in the layout, and `aria-hidden` so assistive tech ignores it.
 */
export default function GrainFilter() {
  return (
    <svg
      aria-hidden="true"
      width="0"
      height="0"
      focusable="false"
      style={{ position: "absolute" }}
    >
      <defs>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0.08" />
          </feComponentTransfer>
        </filter>
        <filter id="spray-rough" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="B" />
        </filter>
      </defs>
    </svg>
  );
}
