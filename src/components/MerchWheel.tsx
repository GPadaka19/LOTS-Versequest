import { useRef, useState } from 'react';
import confetti from 'canvas-confetti';

const merchItems = ['stiker', 'gantungan kunci', 'photocard', 'paket (semua merch)'];

const rarityMap: Record<string, string> = {
  common: 'bg-stone-400',
  rare: 'bg-indigo-500',
  epic: 'bg-pink-500',
  mythical: 'bg-yellow-400 text-black font-bold',
};

function getRarity(item: string): keyof typeof rarityMap {
  if (item === 'stiker') return 'common';
  if (item === 'photocard') return 'rare';
  if (item === 'gantungan kunci') return 'epic';
  return 'mythical'; // paket (semua merch)
}

const MerchWheel = () => {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<{ name: string; rarity: string } | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    const totalBoxes = 100;
    const centerIndex = Math.floor(totalBoxes / 2);
    const strip = stripRef.current;

    if (strip) {
      strip.innerHTML = '';

      const elements: HTMLDivElement[] = [];
      for (let i = 0; i < totalBoxes; i++) {
        const item = merchItems[Math.floor(Math.random() * merchItems.length)];
        const rarity = getRarity(item);
        const div = document.createElement('div');
        div.className = `w-32 h-32 mx-2 flex items-center justify-center rounded text-white text-sm shrink-0 ${rarityMap[rarity]}`;
        div.innerText = item;
        elements.push(div);
      }

      const selected = elements[centerIndex];
      strip.dataset.result = selected.innerText;

      elements.forEach(el => strip.appendChild(el));

      const boxWidth = 128;
      const marginX = 16;
      const totalMove = (boxWidth + marginX) * centerIndex;

      strip.animate(
        [
          { transform: `translateX(0px)` },
          { transform: `translateX(-${totalMove}px)` },
        ],
        {
          duration: 6000,
          easing: 'cubic-bezier(0.1, 0.9, 0.2, 1)',
          fill: 'forwards',
        }
      );

      setTimeout(() => {
        const winnerName = selected.innerText;
        const winnerRarity = getRarity(winnerName);
        setResult({ name: winnerName, rarity: winnerRarity });
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.7 },
        });
        setSpinning(false);
      }, 6000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-900 text-white px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Gacha Merchandise</h1>

      <div className="relative w-full max-w-6xl overflow-hidden border-4 border-stone-700 rounded-lg shadow-lg bg-stone-800">
        <div
          className="flex py-4 px-2 transition-transform duration-1000 ease-out"
          ref={stripRef}
        ></div>

        <div className="absolute top-0 bottom-0 left-1/2 w-1 border-l-4 border-amber-400 transform -translate-x-1/2 z-10" />
      </div>

      <button
        onClick={handleSpin}
        disabled={spinning}
        className="mt-8 px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg shadow-lg transition-colors disabled:opacity-50"
      >
        {spinning ? 'Rolling...' : 'Open Case'}
      </button>

      {result && (
        <div className="mt-8 text-center">
          <div className="text-xl">Kamu mendapatkan:</div>
          <div className={`text-3xl font-bold mt-2 p-4 rounded ${rarityMap[result.rarity]}`}>
            {result.name} ({result.rarity})
          </div>
        </div>
      )}
    </div>
  );
};

export default MerchWheel;
