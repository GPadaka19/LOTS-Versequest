'use client';

import { useRef, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

interface MerchItem {
  id: string;
  name: string;
  stock: number;
  image: string;
}

const initialMerchIds = [
  'm_kartuNama',
  'm_stickerA',
  'm_stickerB',
  'm_coklat',
];

const imageMap: Record<string, string> = {
  m_kartuNama: '/merch/kartuNama.webp',
  m_stickerA: '/merch/Stiker_1.webp',
  m_stickerB: '/merch/Stiker_2.webp',
  m_coklat: '/merch/coklat.webp',
};

const ITEM_WIDTH = 128 + 16; // width (w-32) + horizontal margin (mx-2)

const MerchWheel = () => {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<MerchItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  const fetchStock = async () => {
    const result: MerchItem[] = [];
    for (const id of initialMerchIds) {
      const snap = await getDoc(doc(db, 'merch_stock', id));
      if (snap.exists()) {
        const data = snap.data();
        result.push({
          id,
          name: data.name,
          stock: data.stock,
          image: imageMap[id],
        });
      }
    }
    return result.filter((item) => item.stock > 0);
  };

  const handleSpin = async () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    setError(null);

    try {
      const availableItems = await fetchStock();
      if (availableItems.length === 0) {
        setError('Stok habis semua!');
        setSpinning(false);
        return;
      }

      const winningItem = availableItems[Math.floor(Math.random() * availableItems.length)];
      const totalBoxes = 60;
      const items: MerchItem[] = Array.from({ length: totalBoxes }, () =>
        availableItems[Math.floor(Math.random() * availableItems.length)]
      );

      const centerIndex = Math.floor(totalBoxes / 2);
      items[centerIndex] = winningItem;

      const strip = stripRef.current;
      if (!strip) return;

      strip.innerHTML = '';
      items.forEach((item) => {
        const div = document.createElement('div');
        div.className =
          'w-32 h-32 mx-2 flex flex-col items-center justify-center rounded text-white text-xs shrink-0 bg-stone-700 border border-stone-500';
        const img = document.createElement('img');
        img.src = item.image;
        img.className = 'w-16 h-16 object-contain mb-1';
        div.appendChild(img);
        const text = document.createElement('div');
        text.innerText = item.name;
        div.appendChild(text);
        strip.appendChild(div);
      });

      await new Promise((r) => setTimeout(r, 50)); // wait DOM render

      const container = strip.parentElement;
      if (!container) return;

      const translateX =
        container.offsetWidth / 2 - (centerIndex * ITEM_WIDTH + ITEM_WIDTH / 2);

      strip.animate(
        [
          { transform: `translateX(0px)` },
          { transform: `translateX(${translateX}px)` },
        ],
        {
          duration: 4000,
          easing: 'cubic-bezier(0.1, 0.9, 0.2, 1)',
          fill: 'forwards',
        }
      );

      setTimeout(async () => {
        const ref = doc(db, 'merch_stock', winningItem.id);
        const snap = await getDoc(ref);
        if (snap.exists() && snap.data().stock > 0) {
          await updateDoc(ref, { stock: snap.data().stock - 1 });
          setResult(winningItem);
        } else {
          setError('Stok tidak tersedia.');
        }
        setSpinning(false);
      }, 4000);
    } catch {
      setError('Terjadi kesalahan.');
      setSpinning(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-900 text-white px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Gacha Merchandise (LOTS)</h1>
      <div className="relative w-full max-w-6xl overflow-hidden border-4 border-stone-700 rounded-lg shadow-lg bg-stone-800">
        <div className="flex py-4 px-2" ref={stripRef}></div>
        <div className="absolute top-0 bottom-0 left-1/2 w-1 border-l-4 border-accent transform -translate-x-1/2 z-10" />
      </div>
      <button
        onClick={handleSpin}
        disabled={spinning}
        className="mt-8 px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg shadow-lg transition-colors disabled:opacity-50"
      >
        {spinning ? 'Rolling...' : 'Open Case'}
      </button>
      {error && <p className="mt-4 text-red-500 font-semibold">{error}</p>}
      {result && (
        <div className="mt-8 text-center">
          <div className="text-xl">Kamu mendapatkan:</div>
          <div className="flex flex-col items-center mt-2">
            <img
              src={result.image}
              alt={result.name}
              width={120}
              height={120}
              className="rounded-lg shadow mb-2"
            />
            <div className="text-2xl font-bold p-4 rounded bg-stone-700 border border-stone-500">
              {result.name}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MerchWheel;
