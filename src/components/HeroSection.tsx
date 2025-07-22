import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { PlayCircle } from 'lucide-react';

const HeroSection = () => {
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

  return (
    <section 
      className="sticky top-0 min-h-screen flex items-center justify-center overflow-hidden z-0"
    >
      {/* Video Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-l from-stone-900/90 via-stone-900/20 to-stone-900/10 z-10"></div>
        <img
          src="/background/Wallpaper_Landscape.webp"
          alt="Background"
          className="w-full h-full object-cover opacity-70 absolute inset-0"
          style={{ objectPosition: 'center' }}
        />
      </div>

      {/* Content */}
      <div 
        className={`container mx-auto px-4 text-center relative z-20 transform transition-all duration-1000 ease-out mt-[calc(100vh-400px)] scale-[0.99] ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        <div className="max-w-5xl -ml-20 -mt-20">
          {/* Play Button (Lucide PlayCircle) */}
          <button
            onClick={openVideoModal}
            className="flex justify-center mb-4 mx-auto"
            aria-label="Watch on YouTube"
            type="button"
          >
            <PlayCircle size={48} className="text-accent hover:scale-110 transition-transform cursor-pointer" />
          </button>
          <p className="text-lg md:text-2xl text-white mb-8 max-w-3xl mx-auto leading-relaxed">
            Uncover the ancient secrets. Survive the traps. Claim the Sunstone.
          </p>
          
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
        </div>  
      </div>
      <div 
          className="absolute bottom-10 transform -translate-x-1/2 animate-bounce cursor-pointer z-20"
          onClick={scrollToAbout}
        >
          <ChevronDown size={32} className="text-amber-300 opacity-80" />
        </div>

      {/* Animated Particles */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent animate-pulse"></div>
      </div>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={closeVideoModal}
        >
          <div
            className="w-full max-w-4xl p-2 border-4 border-accent rounded-xl bg-black"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=0&enablejsapi=1"
                title="Game Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <button
              onClick={closeVideoModal}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors mx-auto block"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;