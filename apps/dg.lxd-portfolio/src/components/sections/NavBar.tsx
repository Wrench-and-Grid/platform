import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav>
      <Link to="/" className="nav-logo">
        {/* <span>GRID</span>
        <span>DESIGN</span> */}
        <img src="/logo.svg" alt="" className="nav-logo-mark" aria-hidden="true" />
      </Link>
      <ul className="nav-links">
        <li><a href="#about">About Me</a></li>
        <li><Link to="/gallery" state={{ returnTo: "#gallery" }}>Gallery</Link></li>
        <li><Link to="/work" state={{ returnTo: "#work" }}>Works</Link></li>
        <li><Link to="/blog" state={{ returnTo: "#blog" }}>Blog</Link></li>
      </ul>
      <a href="#contact" className="nav-contact">Contact Me</a>
    </nav>
  );
}
