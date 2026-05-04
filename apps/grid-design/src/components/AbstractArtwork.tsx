import type { ArtworkVariant } from "../types/artwork";

type AbstractArtworkProps = {
  variant: ArtworkVariant;
  className?: string;
};

export default function AbstractArtwork({ variant, className }: AbstractArtworkProps) {
  switch (variant) {
    case "resonance":
      return (
        <svg
          viewBox="0 0 500 600"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          <rect width="500" height="600" fill="#b8bfff" />
          <circle cx="250" cy="300" r="200" fill="#3939ff" opacity=".28" />
          <circle cx="100" cy="150" r="100" fill="#ff5b22" opacity=".42" />
          <rect x="0" y="350" width="500" height="250" fill="#3939ff" opacity=".15" />
          <circle cx="400" cy="500" r="80" fill="#f4f386" opacity=".5" />
        </svg>
      );
    case "meridian":
      return (
        <svg
          viewBox="0 0 400 240"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          <rect width="400" height="240" fill="#aee6ed" />
          <rect x="0" y="0" width="200" height="240" fill="#ff5b22" opacity=".28" />
          <circle cx="200" cy="120" r="90" fill="#f7f5f2" opacity=".58" />
          <circle cx="320" cy="50" r="40" fill="#f4f386" opacity=".7" />
        </svg>
      );
    case "field-notes":
      return (
        <svg
          viewBox="0 0 400 240"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          <rect width="400" height="240" fill="#f4f386" />
          <circle cx="120" cy="80" r="100" fill="#ff5b22" opacity=".38" />
          <rect x="180" y="0" width="220" height="240" fill="#3939ff" opacity=".1" />
          <circle cx="320" cy="180" r="60" fill="#b8bfff" opacity=".65" />
        </svg>
      );
    case "threshold":
      return (
        <svg
          viewBox="0 0 480 240"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          <rect width="480" height="240" fill="#ff5b22" opacity=".82" />
          <circle cx="240" cy="120" r="110" fill="#f7f5f2" opacity=".28" />
          <rect
            x="60"
            y="30"
            width="360"
            height="180"
            rx="90"
            fill="none"
            stroke="#f7f5f2"
            strokeWidth="2.5"
            opacity=".35"
          />
          <circle cx="100" cy="200" r="50" fill="#f4f386" opacity=".48" />
          <circle cx="400" cy="40" r="35" fill="#b8bfff" opacity=".5" />
        </svg>
      );
    case "nocturne":
      return (
        <svg
          viewBox="0 0 320 240"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          <rect width="320" height="240" fill="#111010" />
          <circle cx="100" cy="100" r="80" fill="#b8bfff" opacity=".32" />
          <circle cx="230" cy="160" r="60" fill="#ff5b22" opacity=".42" />
          <rect x="0" y="180" width="320" height="60" fill="#f4f386" opacity=".14" />
        </svg>
      );
    case "open-water":
      return (
        <svg
          viewBox="0 0 480 240"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          <rect width="480" height="240" fill="#aee6ed" opacity=".68" />
          <rect x="0" y="0" width="240" height="240" fill="#3939ff" opacity=".18" />
          <circle cx="240" cy="120" r="120" fill="#f7f5f2" opacity=".48" />
          <circle cx="400" cy="60" r="55" fill="#ff5b22" opacity=".32" />
        </svg>
      );
    case "solstice":
      return (
        <svg
          viewBox="0 0 480 240"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          <rect width="480" height="240" fill="#f4f386" opacity=".78" />
          <circle cx="150" cy="150" r="130" fill="#ff5b22" opacity=".28" />
          <rect x="200" y="0" width="280" height="240" fill="#b8bfff" opacity=".32" />
          <circle cx="380" cy="80" r="60" fill="#3939ff" opacity=".18" />
        </svg>
      );
    case "convergence":
      return (
        <svg
          viewBox="0 0 480 240"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          <rect width="480" height="240" fill="#b8bfff" />
          <circle cx="100" cy="100" r="80" fill="#3939ff" opacity=".22" />
          <circle cx="300" cy="150" r="100" fill="#ff5b22" opacity=".28" />
          <rect x="0" y="180" width="480" height="60" fill="#f4f386" opacity=".38" />
          <circle cx="440" cy="60" r="45" fill="#aee6ed" opacity=".58" />
        </svg>
      );
    case "paper-trace":
      return (
        <svg
          viewBox="0 0 420 300"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          <rect width="420" height="300" fill="#f7f5f2" />
          <rect x="26" y="32" width="368" height="236" rx="18" fill="#f4f386" opacity=".38" />
          <path d="M40 220C120 170 180 120 380 146" fill="none" stroke="#ff5b22" strokeWidth="24" opacity=".22" />
          <circle cx="148" cy="104" r="72" fill="#aee6ed" opacity=".46" />
          <circle cx="314" cy="178" r="92" fill="#3939ff" opacity=".12" />
        </svg>
      );
    case "mutual-aid":
      return (
        <svg
          viewBox="0 0 420 300"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          <rect width="420" height="300" fill="#111010" />
          <rect x="0" y="0" width="210" height="300" fill="#3939ff" opacity=".12" />
          <circle cx="110" cy="110" r="86" fill="#aee6ed" opacity=".26" />
          <circle cx="290" cy="138" r="120" fill="#ff5b22" opacity=".28" />
          <path d="M30 252H390" stroke="#f4f386" strokeWidth="18" opacity=".25" />
        </svg>
      );
    case "studio-notes":
      return (
        <svg
          viewBox="0 0 420 300"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          <rect width="420" height="300" fill="#ece8e3" />
          <circle cx="210" cy="130" r="116" fill="#b8bfff" opacity=".34" />
          <circle cx="126" cy="214" r="82" fill="#ff5b22" opacity=".2" />
          <rect x="98" y="56" width="220" height="160" rx="80" fill="none" stroke="#111010" strokeWidth="3" opacity=".2" />
          <circle cx="322" cy="84" r="46" fill="#f4f386" opacity=".54" />
        </svg>
      );
    default:
      return null;
  }
}
