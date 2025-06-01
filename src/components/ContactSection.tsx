import React, { useEffect, useRef, useState } from 'react';
import { Mail, Instagram, Youtube } from 'lucide-react';
import { createLucideIcon } from "lucide-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faItchIo } from '@fortawesome/free-brands-svg-icons';

const XIcon = createLucideIcon("X", [
  [
    "path",
    {
      d: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
      stroke: "none",
      fill: "currentColor",
    },
  ],
]);

const socials = [
  { 
    name: 'Email', 
    icon: <Mail size={24} />, 
    link: 'mailto:versequest.contact@gmail.com',
    color: 'bg-blue-600 hover:bg-blue-700' 
  },
  { 
    name: 'Instagram', 
    icon: <Instagram size={24} />, 
    link: 'https://instagram.com/versequest.games',
    color: 'bg-gradient-to-bl from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90' 
  },
  { 
    name: 'X', 
    icon: <XIcon size={24} />, 
    link: 'https://x.com/versequestgame',
    color: 'bg-black hover:bg-gray-800' 
  },
  { 
    name: 'YouTube', 
    icon: <Youtube size={24} />, 
    link: 'https://youtube.com/@versequestgames',
    color: 'bg-red-600 hover:bg-red-700' 
  },
  { 
    name: 'Itch.io', 
    icon: <FontAwesomeIcon icon={faItchIo} size="lg" />, 
    link: 'https://versequest.itch.io',
    color: 'bg-[#fa5c5c] hover:bg-[#e54b4b]' 
  }
];

const ContactSection = () => {
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
      id="contact" 
      ref={sectionRef}
      className="py-20 bg-stone-100"
    >
      <div className="container mx-auto px-4">
        <div 
          className={`max-w-4xl mx-auto text-center transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-amber-800 font-serif">
            Contact & Follow Us
          </h2>
          
          <p className="text-lg text-stone-700 mb-10 max-w-2xl mx-auto">
            Have questions about "Legacy of the Sunstone"? Want to share your experience or report an issue? 
            We'd love to hear from you!
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {socials.map((social, index) => (
              <a 
                key={index}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-6 py-3 text-white rounded-md shadow-md transition-all hover:scale-105 ${social.color}`}
              >
                {social.icon}
                <span>{social.name}</span>
              </a>
            ))}
          </div>
          
          <div className="mt-12 p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 text-amber-700">Join Our Community</h3>
            <p className="text-stone-700 mb-6">
              Subscribe to our newsletter to receive updates, game tips, and exclusive content about 
              "Legacy of the Sunstone" and our future projects.
            </p>
            
            <form className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
              <button 
                type="submit"
                className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-md transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;