import { useEffect, useRef, useState } from 'react';

const DeveloperSection = () => {
  const [isVisible, setIsVisible] = useState(false);
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

  return (
    <section 
      id="developer" 
      ref={sectionRef}
      className="py-20 relative bg-base text-white"
    >
      <div className="absolute inset-0 bg-[url('/background/Wallpaper_Landscape.webp')] bg-cover bg-center opacity-5 bg-fixed pointer-events-none"></div>
      <div className="container mx-auto px-4">
        <div 
          className={`max-w-6xl mx-auto transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-amber-500 font-serif">
            Meet the Developers
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Developer 1 */}
            <div className="bg-secondary bg-opacity-80 p-8 rounded-lg shadow-lg flex flex-col items-center">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-amber-600 flex-shrink-0 mb-6">
                <img 
                  src="https://fotomhs.amikom.ac.id/2022/22_82_1395.jpg" 
                  alt="Jedidta Adoni Saputra" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2 text-amber-400">Jedidta Adoni Saputra</h3>
                <p className="text-gray-300 mb-4">22.82.1395</p>
                <p className="text-gray-100 leading-relaxed">
                  Game Developer & Designer
                </p>
              </div>
            </div>

            {/* Developer 2 */}
            <div className="bg-secondary bg-opacity-80 p-8 rounded-lg shadow-lg flex flex-col items-center">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-amber-600 flex-shrink-0 mb-6">
                <img 
                  src="https://fotomhs.amikom.ac.id/2022/22_82_1428.jpg" 
                  alt="Niko Suryo Prayogo" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2 text-amber-400">Niko Suryo Prayogo</h3>
                <p className="text-gray-300 mb-4">22.82.1428</p>
                <p className="text-gray-100 leading-relaxed">
                  Game Developer & Designer
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-secondary bg-opacity-80 p-8 rounded-lg shadow-lg">
            <p className="text-lg text-gray-100 leading-relaxed text-center">
              We are passionate game developers from Amikom Yogyakarta University, 
              dedicated to creating immersive adventure experiences. "Legacy of the Sunstone" 
              is our debut title, combining our love for game development, 
              ancient mysteries, and challenging puzzles. Our goal is to transport players 
              to a world of wonder and excitement, where they can live out their explorer 
              fantasies and uncover ancient secrets.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeveloperSection;