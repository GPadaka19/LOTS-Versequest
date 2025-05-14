import React, { useEffect, useRef, useState } from 'react';
import { DownloadCloud, MonitorSmartphone, Apple, Monitor } from 'lucide-react';

const platforms = [
  { name: 'Windows', icon: <Monitor size={24} /> },
  { name: 'macOS', icon: <Apple size={24} /> },
  { name: 'Linux', icon: <MonitorSmartphone size={24} /> }
];

const DownloadSection = () => {
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
      id="download" 
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-amber-600 to-amber-800 text-white"
    >
      <div className="container mx-auto px-4">
        <div 
          className={`max-w-4xl mx-auto text-center transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white font-serif">
            Ready for Adventure?
          </h2>
          
          <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
            Download "Legacy of the Sunstone" now and begin your quest to uncover the ancient artifact.
          </p>
          
          <div className="mb-10">
            <a 
              href="https://s3.amazonaws.com/example/legacy-of-sunstone.zip" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-amber-800 font-bold rounded-md shadow-lg hover:bg-amber-100 transform transition-all hover:scale-105 active:scale-95"
            >
              <DownloadCloud size={24} />
              <span>Download Now</span>
            </a>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {platforms.map((platform, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 bg-amber-900 bg-opacity-50 px-4 py-2 rounded-md"
              >
                {platform.icon}
                <span>{platform.name}</span>
              </div>
            ))}
          </div>
          
          <p className="mt-6 text-amber-200 text-sm">
            Version 1.0.2 | 2.3 GB | Released October 15, 2025
          </p>
        </div>
      </div>
    </section>
  );
};

export default DownloadSection;