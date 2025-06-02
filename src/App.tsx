import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import GallerySection from './components/GallerySection';
import FeaturesSection from './components/FeaturesSection';
import DeveloperSection from './components/DeveloperSection';
import DownloadSection from './components/DownloadSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

function App() {
  return (
    <div className="relative bg-stone-900 text-stone-100 min-h-screen">
      <div className="absolute inset-0 bg-[url('/background/stone.webp')] opacity-10 bg-fixed"></div>
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
  );
}

export default App;