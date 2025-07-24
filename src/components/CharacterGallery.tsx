import { useState } from 'react';

interface GalleryItem {
  src: string;
  title: string;
}

const galleryData: GalleryItem[] = [
  {
    src: '/gallery/Arka.webp',
    title: 'Arka',
  },
  {
    src: '/gallery/DrVictor.webp',
    title: 'Dr. Victor',
  },
  {
    src: '/gallery/DutchArmy.webp',
    title: 'Dutch Army',
  }
];

interface CharacterGalleryProps {
  compact?: boolean;
}

export default function GallerySection({ compact = false }: CharacterGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const activeMode = galleryData[activeIndex];

  return (
    <section className={compact ? "relative h-[25vh] min-h-[120px] w-full overflow-hidden text-accent" : "relative h-screen w-full overflow-hidden text-accent"}>
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-500"
        style={{ backgroundImage: `url(${activeMode.src})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60" />
      </div>
      {/* Content Overlay */}
      <div className={compact ? "relative z-10 h-full flex" : "relative z-10 h-full flex"}>
        {/* Left - Thumbnail List */}
        <div className={compact ? "w-1/4 p-2 flex flex-col gap-2 mt-2" : "w-1/4 p-8 flex flex-col gap-4 mt-12"}>
          <div className={compact ? "my-1 text-center text-lg font-bold text-accent" : "my-1 text-center text-4xl font-bold text-accent"}>Character</div>
          {galleryData.map((mode: GalleryItem, index: number) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`border-2 transition-all w-full aspect-[16/9] flex flex-col justify-end overflow-hidden ${
                activeIndex === index ? 'border-accent' : 'border-white/40 hover:border-amber-200'
              }`}
            >
              <div className="w-full h-3/4">
                <img src={mode.src} alt={mode.title} className="w-full aspect-[16/9] object-cover" />
              </div>
              <div className="w-full h-1/4 flex items-center text-left">
                <span className={compact ? "text-accent text-xs font-serif font-bold truncate px-1" : "text-accent text-lg font-serif font-bold truncate px-1"}>{mode.title}</span>
              </div>
            </button>
          ))}
        </div>
        {/* Right - Description */}
        <div className={compact ? "w-3/4 p-2 flex flex-col justify-start items-end" : "w-3/4 p-12 flex flex-col justify-start items-end"}>
          <h2 className={compact ? "text-lg font-serif font-bold mb-2" : "text-4xl font-serif font-bold mb-6"}>{activeMode.title}</h2>
        </div>
      </div>
    </section>
  );
}
