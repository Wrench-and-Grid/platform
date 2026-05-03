/**
 * PageTransition — wraps a route's content in a Framer Motion `<motion.main>`
 * that animates in/out based on the `kind` prop.
 *
 * Each `kind` maps to a distinct enter/exit personality:
 * - `home`    — soft vertical slide (subtle, feels like scrolling into view)
 * - `gallery` — scale + vertical slide (spatial depth, like opening a frame)
 * - `work`    — horizontal slide (lateral navigation between archive and home)
 *
 * The component is consumed inside `<AnimatePresence mode="wait">` in App.tsx,
 * which ensures the exit animation of the outgoing page completes before the
 * entering page starts.
 *
 * @param children  - Page content to wrap.
 * @param className - Optional CSS class forwarded to the `<motion.main>`.
 * @param kind      - Transition personality key.
 */
import type { ReactNode } from "react";
import { motion } from "framer-motion";

type PageTransitionKind = "gallery" | "home" | "work";

type PageTransitionProps = {
  children: ReactNode;
  className?: string;
  kind: PageTransitionKind;
};

const transitionStates = {
  home: {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
  },
  gallery: {
    initial: { opacity: 0, scale: 0.985, y: 18 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 1.015, y: -10 },
  },
  work: {
    // opacity + x are GPU-composited — avoids layout repaints from clipPath
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
} satisfies Record<
  PageTransitionKind,
  {
    animate: Record<string, number | string>;
    exit: Record<string, number | string>;
    initial: Record<string, number | string>;
  }
>;

export default function PageTransition({ children, className, kind }: PageTransitionProps) {
  return (
    <motion.main
      initial="initial"
      animate="animate"
      exit="exit"
      variants={transitionStates[kind]}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.main>
  );
}
