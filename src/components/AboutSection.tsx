import { useEffect, useRef, useState } from 'react';

const AboutSection = () => {
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
      id="about" 
      ref={sectionRef}
      className="py-20 relative bg-base"
    >
      <div className="absolute inset-0 bg-[url('/background/Wallpaper_Landscape.webp')] bg-cover bg-center opacity-5 bg-fixed"></div> 
      
      <div className="container mx-auto px-4">
        <div 
          className={`max-w-4xl mx-auto transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-accent font-serif">
            About the Game
          </h2>
          
          <div className="bg-secondaryAccent p-8 rounded-lg shadow-lg">
            <p className="text-lg leading-relaxed mb-6 text-white text-justify">
              <span className="text-xl font-bold text-accent">Legacy of the Sunstone</span> is an 
              adventure-puzzle game that takes you on a thrilling journey through ancient temples, 
              forgotten civilizations, and mysterious tombs in search of the legendary Sunstone artifact.
            </p>
            
            <p className="text-lg leading-relaxed mb-8 text-white text-justify">
              As an intrepid archaeologist on the trail of the fabled Sunstone, you'll navigate treacherous 
              environments, solve intricate puzzles, evade deadly traps, and uncover the secrets of a lost 
              civilization. Will you claim the Sunstone and reveal its true power, or will you become another 
              victim of its curse?
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Immersive Exploration',
                  desc: 'Traverse beautifully rendered ancient temples and ruins with realistic physics and environmental interactions.'
                },
                {
                  title: 'Mind-Bending Puzzles',
                  desc: 'Test your intellect with a variety of challenging puzzles that unlock ancient mechanisms and reveal hidden passages.'
                },
                {
                  title: 'Compelling Narrative',
                  desc: 'Uncover an engrossing story through ancient texts, artifacts, and encounters with other characters seeking the Sunstone.'
                }
              ].map((item, index) => (
                <div key={index} className="bg-secondary p-6 rounded-md shadow-md">
                  <h3 className="text-xl font-bold mb-2 text-accent">{item.title}</h3>
                  <p className="text-white">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;