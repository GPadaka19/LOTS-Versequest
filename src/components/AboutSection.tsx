import { useEffect, useRef, useState } from 'react';

interface AboutSectionProps {
  compact?: boolean;
}

const AboutSection = ({ compact = false }: AboutSectionProps) => {
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
      className={compact ? "h-[25vh] min-h-[120px] py-12 relative bg-base" : "py-20 relative bg-base"}
    >
      <div className="absolute inset-0 bg-[url('/background/Wallpaper_Landscape.webp')] bg-cover bg-center opacity-5 bg-fixed"></div> 
      
      <div className="container mx-auto px-2 md:px-4">
        <div 
          className={`max-w-4xl mx-auto transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          } -mt-8`}
        >
          <h2 className={compact ? "text-xl font-bold mb-2 text-center text-accent font-serif" : "text-3xl md:text-4xl font-bold mb-8 text-center text-accent font-serif"}>
            About the Game
          </h2>
          
          <div className={compact ? "bg-secondaryAccent px-2 py-12 rounded-lg shadow-lg" : "bg-secondaryAccent p-8 rounded-lg shadow-lg"}>
            <p className={compact ? "text-sm leading-tight mb-2 text-white text-justify" : "text-lg leading-relaxed mb-6 text-white text-justify"}>
              <span className="custom-base-accent text-accent">Legacy of the Sunstone</span> is a third-person action-adventure game that combines 
              historical exploration, intricate puzzles, stealth tactics, and emotional narrative into a cinematic experience set 
              in the ancient world.
            </p>
            <p className={compact ? "text-sm leading-tight mb-2 text-white text-justify line-clamp-3" : "text-lg leading-relaxed mb-8 text-white text-justify"}>
            In the game, you play as Arka Widjaya, a young archaeologist from a dystopian future who travels back in time to uncover the legendary 
            artifact known as the Sunstone—an ancient relic from the Majapahit Empire said to hold immense magical powers capable of altering human 
            consciousness, unlocking latent memories, and restoring lost knowledge.
            </p>
            <p className={compact ? "text-sm leading-tight mb-10 text-white text-justify line-clamp-3" : "text-lg leading-relaxed text-white text-justify"}>
            As you traverse ancient temples, evade colonial patrols, and solve cryptic puzzles, your journey will be shadowed by your former mentor,
            Dr. Victor, who has aligned with Dutch colonial forces to seize the artifact for his own ambitions. Will you uncover the true Sunstone 
            and change the fate of the future—or become another casualty of its curse?
            </p>
            
            <div className={compact ? "grid grid-cols-1 md:grid-cols-3 gap-2" : "grid grid-cols-1 md:grid-cols-3 gap-6"}>
              {[
                {
                  title: 'Immersive Historical Exploration',
                  desc: 'Navigate lush tropical jungles and authentically recreated ruins inspired by the grandeur of ancient Majapahit architecture. From sacred temples to forgotten underground altars, each environment offers vertical navigation and strategic stealth elements to support your quest.'
                },
                {
                  title: 'Mind-Bending Environmental Puzzles',
                  desc: 'Solve puzzles intricately tied to the environment—align rotating stone pillars, manipulate hidden levers, and interpret ancient symbols to unlock new paths and reveal lost secrets.'
                },
                {
                  title: 'Emotional Time-Travel Narrative',
                  desc: 'Experience an emotionally driven story of betrayal, redemption, and hope as you uncover the past to save the future. Dialogue, artifacts, and environmental storytelling gradually reveal the deep lore behind the Sunstone and its mythical origins.'
                }
              ].map((item, index) => (
                <div key={index} className={compact ? "bg-secondary p-2 rounded-md shadow-md" : "bg-secondary p-6 rounded-md shadow-md"}>
                  <h3 className={compact ? "text-xs font-bold mb-1 text-accent" : "text-xl font-bold mb-2 text-accent"}>{item.title}</h3>
                  <p className={compact ? "text-xs text-white" : "text-white"}>{item.desc}</p>
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