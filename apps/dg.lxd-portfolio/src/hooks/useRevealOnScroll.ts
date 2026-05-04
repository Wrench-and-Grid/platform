/**
 * useRevealOnScroll — triggers a CSS-class-based entrance animation on
 * elements matching `selector` when they scroll into the viewport.
 *
 * Mechanism:
 * 1. All matching elements immediately receive `will-reveal` (opacity 0,
 *    translateY offset) so they are invisible before the observer fires.
 * 2. An `IntersectionObserver` watches each element. When one intersects,
 *    `will-reveal` is swapped for `is-revealed` (opacity 1, no offset),
 *    triggering the CSS transition defined in `index.css`.
 * 3. Each element is unobserved immediately after it reveals — avoids
 *    redundant observer callbacks for elements that are already visible.
 *
 * Respects `prefers-reduced-motion`: if the user has requested reduced
 * motion, the hook exits immediately and no classes are added.
 *
 * @param selector - CSS selector for the elements to animate on scroll.
 */
import { useEffect } from "react";

export default function useRevealOnScroll(selector: string) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (!elements.length) return;

    elements.forEach((el) => el.classList.add("will-reveal"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("will-reveal");
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -40px 0px" }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [selector]);
}
