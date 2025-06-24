// import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-8 bg-stone-900 text-stone-400 text-center">
      <div className="container mx-auto px-4">
        <p>
          &copy; {currentYear} Versequest — Legacy of the Sunstone. All rights reserved.
        </p>
        <p className="mt-2 text-sm">
          <a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
          {' | '}
          <a href="#" className="hover:text-amber-400 transition-colors">Terms of Service</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;