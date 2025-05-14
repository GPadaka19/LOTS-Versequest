import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import logo from '../assets/img/Versequest_White.png';


const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-stone-900/95 backdrop-blur-sm border-b border-amber-500/10 py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src={logo}
              alt="Versequest_Logo"
              className="h-8 md:h-10 object-contain"
            />
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {['about', 'gallery', 'features', 'developer', 'download', 'contact'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item)}
                className="text-amber-100 hover:text-amber-400 transition-colors capitalize relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all group-hover:w-full"></span>
              </button>
            ))}
            <a 
              href="https://s3.amazonaws.com/example/legacy-of-sunstone.zip"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md transition-colors"
            >
              Download
            </a>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-amber-100 hover:text-amber-400 transition-colors"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-stone-900/95 backdrop-blur-sm border-b border-amber-500/10">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {['about', 'gallery', 'features', 'developer', 'download', 'contact'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item)}
                className="text-amber-100 hover:text-amber-400 transition-colors text-left capitalize py-2 border-b border-stone-700"
              >
                {item}
              </button>
            ))}
            <a 
              href="https://s3.amazonaws.com/example/legacy-of-sunstone.zip"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md transition-colors text-center"
            >
              Download Now
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;