import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface GalleryImage {
  src: string;
  title: string;
  description: string;
}

const images: GalleryImage[] = [
  {
    src: '/gallery/Arka_CU.webp',
    title: 'Arka',
    description: 'The mysterious warrior with a deep connection to the ancient powers of the Sunstone.'
  },
  {
    src: '/gallery/DrVictor_CU.webp',
    title: 'Dr. Victor',
    description: 'The brilliant but troubled scientist whose experiments with ancient artifacts led to the discovery of the Sunstone.'
  },
  {
    src: '/gallery/Dutch Army_CU.webp',
    title: 'Dutch Army',
    description: 'The elite military force tasked with protecting the Sunstone and maintaining order in the chaotic world.'
  }
];

const GallerySection = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const nextImage = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const openVideoModal = () => {
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
  };

  return (
    <section 
      id="gallery" 
      ref={sectionRef}
      className="py-20 bg-stone-800 text-white"
    >
      <div className="container mx-auto px-4">
        <div 
          className={`transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-amber-500 font-serif">
            Screenshots & Trailer
          </h2>
          
          <div className="mb-12 relative">
            <div id="indicators-carousel" className="relative w-full max-w-4xl mx-auto">
              {/* Carousel wrapper */}
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg shadow-2xl">
                {images.map((image, index) => (
                  <div 
                    key={index}
                    className={`absolute w-full h-full transition-all duration-700 ease-in-out ${
                      currentImage === index 
                        ? 'opacity-100 translate-x-0' 
                        : index < currentImage 
                          ? '-translate-x-full opacity-0'
                          : 'translate-x-full opacity-0'
                    }`}
                    data-carousel-item={currentImage === index ? 'active' : undefined}
                  >
                    <div className="relative w-full h-full group">
                      <img 
                        src={image.src} 
                        alt={image.title} 
                        className="absolute block w-full h-full object-contain bg-black"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-6 pb-16">
                          <h3 className="text-2xl font-bold text-amber-400 mb-2">{image.title}</h3>
                          <p className="text-white/90 text-sm md:text-base">{image.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Slider indicators */}
              <div className="absolute z-30 flex -translate-x-1/2 space-x-3 rtl:space-x-reverse bottom-5 left-1/2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentImage === index ? 'bg-amber-500 scale-125' : 'bg-white/50'
                    }`}
                    onClick={() => setCurrentImage(index)}
                    aria-current={currentImage === index}
                    aria-label={`Slide ${index + 1}`}
                    data-carousel-slide-to={index}
                  />
                ))}
              </div>

              {/* Slider controls */}
              <button 
                type="button" 
                className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                onClick={prevImage}
                data-carousel-prev
              >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white/70 group-focus:outline-none">
                  <ChevronLeft className="w-4 h-4 text-white" />
                  <span className="sr-only">Previous</span>
                </span>
              </button>
              <button 
                type="button" 
                className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                onClick={nextImage}
                data-carousel-next
              >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white/70 group-focus:outline-none">
                  <ChevronRight className="w-4 h-4 text-white" />
                  <span className="sr-only">Next</span>
                </span>
              </button>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button 
              onClick={openVideoModal}
              className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-md shadow-lg transition-all hover:scale-105"
            >
              <Play size={20} />
              <span>Watch Trailer</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Video Modal */}
      {isVideoModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={closeVideoModal}
        >
          <div 
            className="w-full max-w-4xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative" style={{ paddingBottom: '56.25%' }}>
              <iframe 
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Game Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <button 
              onClick={closeVideoModal}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;