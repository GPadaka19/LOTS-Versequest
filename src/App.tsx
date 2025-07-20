import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import GallerySection from './components/GallerySection';
import FeaturesSection from './components/FeaturesSection';
import DeveloperSection from './components/DeveloperSection';
import DownloadSection from './components/DownloadSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import MerchWheel from './components/MerchWheel';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/merch-wheel" element={<MerchWheel />} />
      </Routes>
      <div className="relative bg-stone-900 text-stone-100 min-h-screen">
        <div className="absolute inset-0 bg-[url('/background/Wallpaper_Landscape.webp')] opacity-10 bg-fixed"></div>
        <Navbar />
        <main className="relative">
          <HeroSection />
          <AboutSection />
          <GallerySection />
          <FeaturesSection />
          <DeveloperSection />
          <DownloadSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;