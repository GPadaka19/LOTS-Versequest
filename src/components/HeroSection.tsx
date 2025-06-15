import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToAbout = () => {
    const element = document.getElementById('about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/90 via-stone-900/50 to-stone-900/90 z-10"></div>
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-70 scale-x-[-1]"
          onError={() => {
            // Silent error handling
            const videoElement = document.querySelector('video');
            if (videoElement) {
              videoElement.style.display = 'none';
            }
          }}
        >
          <source src="/video/coverr-bridge-in-the-jungle-3371-1080p.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Content */}
      <div 
        className={`container mx-auto px-4 text-center relative z-20 transform transition-all duration-1000 ease-out mt-[35vh] md:mt-[30vh] lg:mt-[32vh] scale-[0.99] ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-5xl lg:text-5xl font-bold mb-4 text-amber-500 font-serif leading-tight">
            Legacy of the Sunstone
          </h1>
          <p className="text-lg md:text-2xl text-amber-100 mb-8 max-w-3xl mx-auto leading-relaxed">
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
              className="px-6 py-3 bg-stone-800 hover:bg-stone-700 text-amber-100 text-base font-bold rounded-md shadow-lg transform transition-all hover:scale-105 active:scale-95 min-w-[160px] border border-amber-500/30"
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

      {/* Video Attribution */}
      <div className="absolute bottom-2 right-2 text-xs text-stone-400/50 z-20">
        Video downloaded on <a href="https://coverr.co" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400">Coverr</a>
      </div>
    </section>
  );
};

export default HeroSection;