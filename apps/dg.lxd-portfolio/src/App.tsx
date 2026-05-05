/**
 * App — root component responsible for routing, the WebGL fluid canvas, and
 * global UI chrome (custom cursor, grain filter).
 *
 * Architecture notes:
 * - All pages are loaded via `React.lazy` + `Suspense` for code splitting.
 *   Each route's bundle is fetched only when that route is first visited.
 * - `FluidCanvas` is rendered conditionally — only on the home route (`/`).
 *   This prevents the WebGL render loop from running on `/work` and any
 *   future routes where it would be invisible and wasteful.
 * - `CustomCursor` and `GrainFilter` are synchronous (no lazy) because they
 *   are tiny and must be present before any page paint.
 * - `AnimatePresence mode="wait"` lets the outgoing page finish its exit
 *   animation before the incoming page begins its entrance animation. Each
 *   `<Route>` wraps its page in its own `<Suspense>` so an async import of the
 *   *incoming* page does not interrupt the *outgoing* page's exit animation.
 */
import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import CustomCursor from "./components/CustomCursor";
import GrainFilter from "./components/GrainFilter";

const FluidCanvas = lazy(() => import("./components/FluidCanvas"));
const HomePage    = lazy(() => import("./features/home/pages/HomePage"));
const WorkPage    = lazy(() => import("./features/work/pages/WorkPage"));

/** Opaque off-white overlay shown while a page chunk is loading. */
function PageFallback() {
  return (
    <div
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, background: "var(--clr-off-white)", zIndex: 50 }}
    />
  );
}

export default function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    if (location.pathname === "/") {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  const [fluidInteractionRegion, setFluidInteractionRegion] = useState<HTMLElement | null>(null);

  /** Stable callback passed to HomePage → HeroSection → passed as `ref`. */
  const handleFluidInteractionRegionChange = useCallback((node: HTMLElement | null) => {
    setFluidInteractionRegion(node);
  }, []);

  return (
    <>
      <CustomCursor />

      {/* FluidCanvas mounts only on `/` — keeps WebGL off all archive routes */}
      {isHome && (
        <Suspense fallback={null}>
          <FluidCanvas
            className="fluid-canvas-root"
            interactionRegion={fluidInteractionRegion}
          />
        </Suspense>
      )}

      <GrainFilter />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <Suspense fallback={<PageFallback />}>
                <HomePage onFluidInteractionRegionChange={handleFluidInteractionRegionChange} />
              </Suspense>
            }
          />
          <Route
            path="/work"
            element={
              <Suspense fallback={<PageFallback />}>
                <WorkPage />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}
