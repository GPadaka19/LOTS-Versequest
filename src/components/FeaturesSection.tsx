import { useEffect, useRef, useState } from 'react';
import { Compass, Puzzle, Swords, BookOpen, Gamepad2} from 'lucide-react';

const features = [
  {
    icon: <Compass size={36} />,
    title: 'Explore Ancient Temples',
    description: 'Journey through atmospheric ruins such as the Penataran Temple complex and underground sanctuaries. These spaces are filled with hidden entrances, dangerous traps, and symbolic clues, all presented with cinematic realism and traditional Indonesian aesthetics.'
  },
  {
    icon: <Puzzle size={36} />,
    title: 'Solve Intricate Puzzles',
    description: 'From mechanical glyph puzzles to aligning disappearing pathways, each challenge is deeply integrated into the narrative and architecture. Use your torch to illuminate clues and your journal to collect insights and unravel mysteries.'
  },
  {
    icon: <Swords size={36} />,
    title: 'Battle Forgotten Guardians',
    description: 'Face ancient guardians and Dutch soldiers who patrol the ruins. Whether through stealth takedowns, clever distractions, or engaging in direct duels using your Keris, combat encourages creativity and careful planning.'
  },
  {
    icon: <Gamepad2 size={36} />,
    title: 'Dynamic Gameplay Loop',
    description: 'Face ancient guardians and Dutch soldiers who patrol the ruins. Whether through stealth takedowns, clever distractions, or engaging in direct duels using your Keris, combat encourages creativity and careful planning.'
  },
  {
    icon: <BookOpen  size={36} />,
    title: 'Authentic World-Building',
    description: 'Face ancient guardians and Dutch soldiers who patrol the ruins. Whether through stealth takedowns, clever distractions, or engaging in direct duels using your Keris, combat encourages creativity and careful planning.'
  }
];

const FeaturesSection = () => {
  const [visibleFeatures, setVisibleFeatures] = useState<number[]>([]);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = featureRefs.current.map((ref, index) => {
      if (!ref) return null;
      
      const observer = new IntersectionObserver((entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setVisibleFeatures((prev) => [...prev, index]);
          observer.unobserve(entry.target);
        }
      }, { threshold: 0.1 });
      
      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  return (
    <section 
      id="features" 
      className="py-20 relative bg-base"
    >
      <div className="absolute inset-0 bg-[url('/background/Wallpaper_Landscape.webp')] bg-cover bg-center opacity-5 bg-fixed pointer-events-none"></div>
      
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-accent font-serif">
          Game Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              ref={(el) => (featureRefs.current[index] = el)}
              className={`bg-secondary bg-opacity-90 rounded-lg shadow-lg p-8 transform transition-all duration-700 ease-out ${
                visibleFeatures.includes(index) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-16'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="text-accent mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-accent">{feature.title}</h3>
              <p className="text-white">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;