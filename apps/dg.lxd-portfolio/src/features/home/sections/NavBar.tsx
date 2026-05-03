import { Link } from "react-router-dom";
import RouteEntryLink from "../../../shared/components/RouteEntryLink";

export default function NavBar() {
  return (
    <nav>
      <Link to="/" className="nav-logo">
        <span>GRID</span>
        <span>DESIGN</span>
      </Link>
      <ul className="nav-links">
        <li>
          <a href="#about">About Me</a>
        </li>
        <li>
          <RouteEntryLink to="/gallery" returnTo="#gallery" className="section-route-link">
            Gallery
          </RouteEntryLink>
        </li>
        <li>
          <RouteEntryLink to="/work" returnTo="#work" className="section-route-link">
            Works
          </RouteEntryLink>
        </li>
      </ul>
      <a href="#contact" className="nav-contact">
        Contact Me
      </a>
    </nav>
  );
}
