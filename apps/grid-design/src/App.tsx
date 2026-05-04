import { Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import NavBar from './features/home/sections/NavBar'
import HeroSection from './features/home/sections/HeroSection'
import WorkSection from './features/home/sections/WorkSection'
import BlogSection from './features/home/sections/BlogSection'
import SiteFooter from './features/home/sections/SiteFooter'
import GalleryPage from './features/gallery/pages/GalleryPage'

function HomePage() {
  return (
    <>
      <NavBar />
      <main>
        <HeroSection />
        <WorkSection />
        <BlogSection />
      </main>
      <SiteFooter />
    </>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}
