import { useCallback, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import CustomCursor from "./components/CustomCursor";
import FluidCanvas from "./components/FluidCanvas";
// import FloatingLinkedIn from "./components/FloatingLinkedIn";
import GrainFilter from "./components/GrainFilter";
import BlogPage from "./pages/BlogPage";
import GalleryPage from "./pages/GalleryPage";
import HomePage from "./pages/HomePage";
import WorkPage from "./pages/WorkPage";

export default function App() {
  const location = useLocation();
  const [fluidInteractionRegion, setFluidInteractionRegion] = useState<HTMLElement | null>(null);
  const handleFluidInteractionRegionChange = useCallback((node: HTMLElement | null) => {
    setFluidInteractionRegion(node);
  }, []);

  return (
    <>
      <CustomCursor />
      <FluidCanvas
        className="fluid-canvas-root"
        interactionRegion={fluidInteractionRegion}
      />
      <GrainFilter />
      {/* <FloatingLinkedIn /> */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <HomePage
                onFluidInteractionRegionChange={handleFluidInteractionRegionChange}
              />
            }
          />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}
