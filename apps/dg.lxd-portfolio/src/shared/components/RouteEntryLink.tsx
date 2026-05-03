/**
 * RouteEntryLink — a React Router `<Link>` that also persists the current
 * page's anchor hash into `window.history` before navigating away.
 *
 * This enables the "Back" button on archive pages to scroll the homepage
 * back to exactly the section the user left from (e.g. `#work-showcase`).
 *
 * @param children    - Link text / content.
 * @param className   - CSS class applied to the anchor element.
 * @param cursorLabel - Value written to `data-cursor` for the custom cursor.
 * @param returnTo    - Hash anchor (e.g. `#work-showcase`) stored in route state
 *                      and in `window.history` for the return journey.
 * @param to          - Destination path passed to React Router `<Link>`.
 */
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type RouteEntryLinkProps = {
  children: ReactNode;
  className: string;
  cursorLabel?: string;
  returnTo: `#${string}`;
  to: string;
};

/** Stamps the current anchor hash into `window.history` so the back-navigate
 *  lands on the right section — only runs when we're already on the homepage. */
function rememberHomeAnchor(hash: `#${string}`) {
  if (typeof window === "undefined" || window.location.pathname !== "/") return;
  const nextUrl = `${window.location.pathname}${window.location.search}${hash}`;
  window.history.replaceState(window.history.state, "", nextUrl);
}

export default function RouteEntryLink({
  children,
  className,
  cursorLabel,
  returnTo,
  to,
}: RouteEntryLinkProps) {
  return (
    <Link
      to={to}
      state={{ returnTo }}
      className={className}
      data-cursor={cursorLabel}
      onClick={() => rememberHomeAnchor(returnTo)}
    >
      {children}
    </Link>
  );
}
