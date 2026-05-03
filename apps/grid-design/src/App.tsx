import NavBar from './components/NavBar'
import HeroSection from './components/HeroSection'
import WorkSection from './components/WorkSection'
import BlogSection from './components/BlogSection'
import SiteFooter from './components/SiteFooter'

export default function App() {
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
