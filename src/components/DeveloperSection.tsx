import React, { useEffect, useRef, useState } from 'react';

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
      className="py-20 bg-stone-900 text-white"
    >
      <div className="container mx-auto px-4">
        <div 
          className={`max-w-4xl mx-auto transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-amber-500 font-serif">
            Meet the Developer
          </h2>
          
          <div className="bg-stone-800 bg-opacity-80 p-8 rounded-lg shadow-lg flex flex-col md:flex-row gap-8 items-center">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-amber-600 flex-shrink-0 mx-auto md:mx-0">
              <img 
                src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Developer Portrait" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-2 text-amber-400 text-center md:text-left">Indie Studio Name</h3>
              <p className="text-gray-300 mb-4 text-center md:text-left">Founded by Adventure Game Enthusiasts</p>
              <p className="text-gray-100 leading-relaxed">
                We are a small independent game studio passionate about creating immersive adventure experiences. 
                "Legacy of the Sunstone" is our debut title, combining our love for archaeology, 
                ancient mysteries, and challenging puzzles. Our goal is to transport players to 
                a world of wonder and excitement, where they can live out their explorer fantasies 
                and uncover ancient secrets.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeveloperSection;