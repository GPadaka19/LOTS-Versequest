import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MapGalleryItem {
  code: string;
  name: string;
  images: string[];
}

const mapData: MapGalleryItem[] = [
  {
    code: 'EJ',
    name: 'East Java',
    images: [
      '/gallery/EJ001.webp',
      '/gallery/EJ002.webp',
      '/gallery/EJ003.webp',
    ],
  },
  {
    code: 'TM',
    name: 'Temple',
    images: [
      '/gallery/TM001.webp','/gallery/TM002.webp','/gallery/TM003.webp','/gallery/TM004.webp','/gallery/TM005.webp','/gallery/TM006.webp','/gallery/TM007.webp','/gallery/TM008.webp','/gallery/TM009.webp','/gallery/TM010.webp','/gallery/TM011.webp','/gallery/TM013.webp','/gallery/TM014.webp','/gallery/TM015.webp','/gallery/TM016.webp','/gallery/TM017.webp','/gallery/TM018.webp',
    ],
  },
  {
    code: 'UG',
    name: 'Underground',
    images: [
      '/gallery/UG001.webp','/gallery/UG002.webp','/gallery/UG003.webp','/gallery/UG004.webp','/gallery/UG005.webp',
    ],
  },
];

interface MapGalleryProps {
  compact?: boolean;
}

export default function MapGallery({ compact = false }: MapGalleryProps) {
  const [activeMapIdx, setActiveMapIdx] = useState<number>(0);
  const [activeImgIdx, setActiveImgIdx] = useState<number>(0);
  const map = mapData[activeMapIdx];

  useEffect(() => {
    // Preload all images in mapData
    mapData.forEach(map =>
      map.images.forEach(src => {
        const img = new window.Image();
        img.src = src;
      })
    );
  }, []);

  // Reset image index when map changes
  function handleMapChange(idx: number) {
    setActiveMapIdx(idx);
    setActiveImgIdx(0);
  }

  function nextImage() {
    setActiveImgIdx((prev) => (prev === map.images.length - 1 ? 0 : prev + 1));
  }
  function prevImage() {
    setActiveImgIdx((prev) => (prev === 0 ? map.images.length - 1 : prev - 1));
  }

  return (
    <section className={compact ? "relative h-[25vh] min-h-[120px] w-full overflow-hidden text-accent" : "relative h-screen w-full overflow-hidden text-accent"}>
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-500"
        style={{ backgroundImage: `url(${map.images[activeImgIdx]})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60" />
      </div>
      {/* Content Overlay */}
      <div className={compact ? "relative z-10 h-full flex" : "relative z-10 h-full flex"}>
        {/* Left - Thumbnail List */}
        <div className={compact ? "w-1/4 p-2 flex flex-col gap-2 mt-2" : "w-1/4 p-8 flex flex-col gap-4 mt-12"}>
          <div className={compact ? "my-1 text-center text-lg font-bold text-accent" : "my-1 text-center text-4xl font-bold text-accent"}>Map</div>
          {mapData.map((m, idx) => (
            <button
              key={m.code}
              onClick={() => handleMapChange(idx)}
              className={`relative border-2 transition-all w-full aspect-[16/9] flex flex-col justify-end overflow-hidden ${
                activeMapIdx === idx ? 'border-accent' : 'border-white/40 hover:border-amber-200'
              }`}
            >
              {/* Prev/Next only on active thumbnail */}
              {activeMapIdx === idx && (
                <>
                  <button
                    className="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-base/80 hover:bg-accent text-accent hover:text-base border border-accent rounded-full p-1 transition"
                    onClick={e => { e.stopPropagation(); prevImage(); }}
                    aria-label="Previous image"
                    type="button"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    className="absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-base/80 hover:bg-accent text-accent hover:text-base border border-accent rounded-full p-1 transition"
                    onClick={e => { e.stopPropagation(); nextImage(); }}
                    aria-label="Next image"
                    type="button"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
              <div className="w-full h-3/4">
                <img src={activeMapIdx === idx ? m.images[activeImgIdx] : m.images[0]} alt={m.name} className="w-full aspect-[16/9] object-cover" />
              </div>
              <div className="w-full h-1/4 flex items-center text-left">
                <span className={compact ? "text-accent text-xs font-serif font-bold truncate px-1" : "text-accent text-lg font-serif font-bold truncate px-1"}>{m.name}</span>
              </div>
            </button>
          ))}
        </div>
        {/* Right - Main Image & Description */}
        <div className={compact ? "w-3/4 p-2 flex flex-col justify-start items-end" : "w-3/4 p-12 flex flex-col justify-start items-end"}>
          <h2 className={compact ? "text-lg font-serif font-bold mb-2" : "text-4xl font-serif font-bold mb-6"}>{map.name}</h2>
        </div>
      </div>
    </section>
  );
}
