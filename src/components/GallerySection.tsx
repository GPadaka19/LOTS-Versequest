import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

const images = [
  'https://images.pexels.com/photos/3361480/pexels-photo-3361480.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/2842070/pexels-photo-2842070.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/12385131/pexels-photo-12385131.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/3155506/pexels-photo-3155506.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/5409751/pexels-photo-5409751.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://fotomhs.amikom.ac.id/2022/22_11_5020.jpg'
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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
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
            <div id="indicators-carousel" className="relative w-full">
              {/* Carousel wrapper */}
              <div className="relative h-64 md:h-96 overflow-hidden rounded-lg shadow-2xl">
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
                    <img 
                      src={image} 
                      alt={`Game screenshot ${index + 1}`} 
                      className="absolute block w-full h-full object-cover"
                    />
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