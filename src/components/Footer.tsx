const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-8 relative bg-stone-900 text-stone-400 text-center">
      <div className="absolute inset-0 bg-[url('/background/Wallpaper_Landscape.webp')] bg-cover bg-center opacity-5 bg-fixed pointer-events-none"></div>
      <div className="container mx-auto px-4 flex flex-col items-center relative z-10">
        <img
          src="/icons/Logo_Name.webp"
          alt="Versequest Logo"
          className="mb-4 h-16 w-auto"
        />
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