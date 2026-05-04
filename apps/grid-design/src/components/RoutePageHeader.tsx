import { Link } from "react-router-dom";
import type { ReturnAnchor } from "../lib/navigation";

type RoutePageHeaderProps = {
  className: string;
  returnTo: ReturnAnchor;
};

export default function RoutePageHeader({ className, returnTo }: RoutePageHeaderProps) {
  return (
    <header className={className}>
      <Link to={{ pathname: "/", hash: returnTo }} className="page-back" data-cursor="Back">
        Back
      </Link>
      <Link to="/" className="page-logo" data-cursor="Home">
        <span>GRID</span>
        <span>DESIGN</span>
      </Link>
    </header>
  );
}
