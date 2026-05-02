import type { ReactNode } from "react";
import { motion } from "framer-motion";

type PageTransitionKind = "blog" | "gallery" | "home" | "work";

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
    initial: { clipPath: "inset(0 100% 0 0)", opacity: 0.35 },
    animate: { clipPath: "inset(0 0 0 0)", opacity: 1 },
    exit: { clipPath: "inset(0 0 0 100%)", opacity: 0.2 },
  },
  blog: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
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
