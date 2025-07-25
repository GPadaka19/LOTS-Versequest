import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { PlayCircle } from 'lucide-react';
import ReactDOM from 'react-dom';

interface HeroSectionProps {
  compact?: boolean;
}

const HeroSection = ({ compact = false }: HeroSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToAbout = () => {
    const element = document.getElementById('about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openVideoModal = () => setIsVideoModalOpen(true);
  const closeVideoModal = () => setIsVideoModalOpen(false);

  function renderModal(isOpen: boolean, close: () => void) {
    if (!isOpen) return null;
    return ReactDOM.createPortal(
      (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-end justify-start"
          onClick={close}
        >
          <div
            className="w-full max-w-4xl p-2 border-4 border-accent rounded-xl bg-black"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/PClEONKwGS8?autoplay=1&mute=0&enablejsapi=1"
                title="Game Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <button
              onClick={close}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors mx-auto block"
            >
              Close
            </button>
          </div>
        </div>
      ),
      document.body
    );
  }

  return (
    <section 
      className={compact ? "sticky top-0 h-[25vh] min-h-[120px] flex items-center justify-center overflow-hidden z-0" : "sticky top-0 min-h-screen flex items-center justify-center overflow-hidden z-0"}
    >
      {/* Video Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-l from-stone-900/90 via-stone-900/20 to-stone-900/10 z-10"></div>
        <img
          src="/background/Wallpaper_Landscape.webp"
          alt="Background"
          className={compact ? "w-full h-full object-cover opacity-70 absolute inset-0 scale-110" : "w-full h-full object-cover opacity-70 absolute inset-0"}
          style={{ objectPosition: 'center' }}
        />
      </div>

      {/* Content */}
      <div 
        className={`container mx-auto px-4 text-center relative z-20 transform transition-all duration-1000 ease-out ${compact ? 'mt-16 scale-95' : 'mt-32 md:mt-40 lg:mt-48 scale-100'} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
      >
        <div className={compact ? "max-w-xl ml-0 mt-72" : "mt-72 ml-0"}>
          {/* Play Button (Lucide PlayCircle) */}
          <button
            onClick={openVideoModal}
            className="flex justify-center mb-4 mx-auto"
            aria-label="Watch on YouTube"
            type="button"
          >
            <PlayCircle size={compact ? 32 : 48} className="text-accent hover:scale-110 transition-transform cursor-pointer" />
          </button>
          <p className={compact ? "text-base text-white mb-12 max-w-xl mx-auto leading-tight" : "text-lg md:text-2xl text-white mb-8 max-w-3xl mx-auto leading-relaxed"}>
            Uncover the ancient secrets. Survive the traps. Claim the Sunstone.
          </p>
          {!compact && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="https://s3.amazonaws.com/example/legacy-of-sunstone.zip" 
                className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-stone-900 text-base font-bold rounded-md shadow-lg transform transition-all hover:scale-105 active:scale-95 min-w-[160px]"
              >
                Download Now
              </a>
              <button 
                onClick={scrollToAbout}
                className="px-6 py-3 bg-stone-800 hover:bg-stone-700 text-amber-600 font-bold rounded-md shadow-lg transform transition-all hover:scale-105 active:scale-95 min-w-[160px]"
              >
                Learn More
              </button>
            </div>
          )}
        </div>  
      </div>
      {!compact && (
        <div 
            className="absolute bottom-10 transform -translate-x-1/2 animate-bounce cursor-pointer z-20"
            onClick={scrollToAbout}
          >
            <ChevronDown size={32} className="text-amber-300 opacity-80" />
          </div>
      )}
      {/* Animated Particles */}
      {!compact && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent animate-pulse"></div>
        </div>
      )}
      {/* Video Modal */}
      {renderModal(isVideoModalOpen, closeVideoModal)}
    </section>
  );
};

export default HeroSection;