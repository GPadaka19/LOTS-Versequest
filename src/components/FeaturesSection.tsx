import React, { useEffect, useRef, useState } from 'react';
import { Compass, Puzzle, Sword } from 'lucide-react';

const features = [
  {
    icon: <Compass size={36} />,
    title: 'Explore Ancient Temples',
    description: 'Venture through meticulously designed ancient temples filled with hidden passages, deadly traps, and priceless treasures. Each location tells a story of the past civilizations that created them.'
  },
  {
    icon: <Puzzle size={36} />,
    title: 'Solve Intricate Puzzles',
    description: 'Challenge your mind with a variety of puzzles that integrate seamlessly with the environment. Decipher ancient languages, manipulate mechanisms, and uncover the secrets needed to progress.'
  },
  {
    icon: <Sword size={36} />,
    title: 'Battle Forgotten Guardians',
    description: 'Encounter and overcome ancient guardians that protect the temples. Use your wits and the environment to your advantage as you face these formidable foes on your quest for the Sunstone.'
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
      className="py-20 relative bg-stone-200"
    >
      <div className="absolute inset-0 bg-[url('/background/Wallpaper_Landscape.webp')] bg-fixed bg-cover bg-center opacity-10"></div>
      
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-amber-800 font-serif">
          Game Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              ref={(el) => (featureRefs.current[index] = el)}
              className={`bg-white bg-opacity-90 rounded-lg shadow-lg p-8 transform transition-all duration-700 ease-out ${
                visibleFeatures.includes(index) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-16'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="text-amber-600 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-amber-800">{feature.title}</h3>
              <p className="text-stone-700">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;