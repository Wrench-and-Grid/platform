import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type RouteEntryLinkProps = {
  children: ReactNode;
  className: string;
  cursorLabel?: string;
  returnTo: `#${string}`;
  to: string;
};

function rememberHomeAnchor(hash: `#${string}`) {
  if (typeof window === "undefined" || window.location.pathname !== "/") {
    return;
  }

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
