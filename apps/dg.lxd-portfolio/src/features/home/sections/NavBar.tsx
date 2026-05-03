/**
 * NavBar — fixed top navigation bar for the homepage.
 *
 * Features:
 * - SVG logo that scrolls to the top when already on `/`, otherwise navigates home.
 * - Desktop nav links with smooth-scroll to `#about` and `#contact`.
 * - Hamburger button that opens a full-screen mobile overlay menu.
 * - Keyboard trap: `Escape` closes the mobile menu.
 * - Scroll-lock: `document.body.style.overflow = "hidden"` while menu is open
 *   to prevent background scroll on mobile.
 */
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  /** Lock body scroll while the mobile overlay is open. */
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  /** Close the mobile menu on Escape. */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) setIsMenuOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  const handleLogoClick = (e: React.MouseEvent) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  /** Smooth-scroll to `#contact` if already on the homepage; otherwise navigate there. */
  const handleContactClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      setIsMenuOpen(false);

      if (location.pathname !== "/") {
        navigate("/#contact");
        return;
      }

      document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [location.pathname, navigate]
  );

  return (
    <nav>
      <Link to="/" className="nav-logo" onClick={handleLogoClick}>
        <img src="/dg_logo.svg" alt="Logo" className="nav-logo-mark" width="96" height="96" />
      </Link>

      <div
        id="primary-navigation"
        className={`nav-menu ${isMenuOpen ? "is-open" : ""}`}
        aria-hidden={!isMenuOpen}
      >
        <ul className="nav-links" onClick={() => setIsMenuOpen(false)}>
          <li><a href="#about">About Me</a></li>
          <li><Link to="/work" state={{ returnTo: "#work" }}>Work</Link></li>
          <li><a href="#contact" onClick={handleContactClick}>Contact</a></li>
        </ul>
      </div>

      <button
        className={`hamburger ${isMenuOpen ? "is-open" : ""}`}
        onClick={toggleMenu}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMenuOpen}
        aria-controls="primary-navigation"
      >
        <span className="hamburger-line" />
        <span className="hamburger-line" />
        <span className="hamburger-line" />
      </button>
    </nav>
  );
}
