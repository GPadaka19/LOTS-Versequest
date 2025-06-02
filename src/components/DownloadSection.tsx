import React, { useEffect, useRef, useState } from 'react';

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
              <img 
                src="https://img.icons8.com/color/48/windows-10.png" 
                alt="Windows 10" 
                className="w-6 h-6"
              />
              <span>Download for Windows</span>
            </a>
          </div>
          
          <div className="bg-amber-900/30 p-4 rounded-lg max-w-md mx-auto mb-6">
            <h3 className="font-semibold mb-2">System Requirements:</h3>
            <ul className="text-sm text-amber-100 space-y-1">
              <li>• Windows 10 64-bit or later</li>
              <li>• 8 GB RAM</li>
              <li>• 4 GB available storage</li>
              <li>• DirectX 11 compatible graphics card</li>
            </ul>
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