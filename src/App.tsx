import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import CharacterGallery from './components/CharacterGallery';
import MapGallery from './components/MapGallery';
import FeaturesSection from './components/FeaturesSection';
import DeveloperSection from './components/DeveloperSection';
import DownloadSection from './components/DownloadSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import MerchWheel from './components/MerchWheel';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ColorGuide from './components/ColorGuide';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/merch-wheel" element={<MerchWheel />} />
        <Route path="/color" element={<ColorGuide />} />
      </Routes>
      <div className="relative bg-stone-900 text-stone-100 min-h-screen">
        <div className="absolute inset-0 bg-[url('/background/Wallpaper_Landscape.webp')] opacity-10 bg-fixed"></div>
        <Navbar />
        <main>
          {/* Portrait: 4 sections stacked, each 25% height */}
          <div className="hidden portrait:grid portrait:grid-rows-4 portrait:h-screen">
            <HeroSection compact />
            <AboutSection compact />
            <CharacterGallery compact />
            <MapGallery compact />
          </div>

          {/* Landscape: normal full-height sections */}
          <div className="portrait:hidden">
            <HeroSection />
            <AboutSection />
            <CharacterGallery />
            <MapGallery />
            {/* Section lain */}
          </div>
          {/* Section lain tetap di luar portrait/landscape switch */}
          <div className="relative z-10 bg-stone-900">
            <FeaturesSection />
            <DeveloperSection />
            <DownloadSection />
            <ContactSection />
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;