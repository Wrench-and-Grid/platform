/**
 * useScrollToTop — instantly scrolls the window to the top whenever the
 * current pathname changes.
 *
 * Used on archive / detail pages (e.g. WorkPage) so navigating to a new
 * route never starts mid-scroll. Uses `behavior: "auto"` (not smooth) so
 * the jump is invisible during the page-transition animation.
 */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function useScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);
}
