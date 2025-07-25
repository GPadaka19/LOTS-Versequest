'use client';

import { useRef, useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

interface MerchItem {
  id: string;
  name: string;
  stock: number;
  image: string;
}

const initialMerchIds = ['m_kartuNama', 'm_stickerA', 'm_stickerB', 'm_coklat'];

const imageMap: Record<string, string> = {
  m_kartuNama: '/background/Wallpaper_Landscape.webp',
  m_stickerA: '/merch/Stiker_1.webp',
  m_stickerB: '/merch/Stiker_2.webp',
  m_coklat: '/merch/coklat.webp',
};

const ITEM_WIDTH = 256 + 16; // w-64 + mx-2

const MerchWheel = () => {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<MerchItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
      if (firebaseUser) {
        const snap = await getDoc(doc(db, 'user-role', firebaseUser.uid));
        setRole(snap.exists() ? snap.data().role || null : null);
      } else {
        setRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Detect 1080x1920 or 1920x1080 and zoom
  useEffect(() => {
    const checkZoom = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setIsZoomed((w === 1080 && h === 1920) || (w === 1920 && h === 1080));
    };

    checkZoom();
    window.addEventListener('resize', checkZoom);
    return () => window.removeEventListener('resize', checkZoom);
  }, []);

  const canSpin = user && (role === 'web-dev' || role === 'game-dev');

  const fetchStock = async () => {
    const result: MerchItem[] = [];
    for (const id of initialMerchIds) {
      const snap = await getDoc(doc(db, 'merch_stock', id));
      if (snap.exists()) {
        const data = snap.data();
        result.push({ id, name: data.name, stock: data.stock, image: imageMap[id] });
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
          'w-64 h-64 mx-2 flex flex-col items-center justify-center rounded text-white text-2xl shrink-0 bg-stone-700 border border-stone-500';
        const img = document.createElement('img');
        img.src = item.image;
        img.className = 'w-64 h-64 object-contain mb-1';
        div.appendChild(img);
        const text = document.createElement('div');
        text.innerText = item.name;
        div.appendChild(text);
        strip.appendChild(div);
      });

      await new Promise((r) => setTimeout(r, 50)); // wait DOM render

      const container = strip.parentElement;
      if (!container) return;

      const translateX = container.offsetWidth / 2 - (centerIndex * ITEM_WIDTH + ITEM_WIDTH / 2);

      strip.animate([{ transform: `translateX(0px)` }, { transform: `translateX(${translateX}px)` }], {
        duration: 6400,
        easing: 'cubic-bezier(0.1, 0.9, 0.2, 1)',
        fill: 'forwards',
      });

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
      }, 6400);
    } catch {
      setError('Terjadi kesalahan.');
      setSpinning(false);
    }
  };

  return (
    <div
      className={`h-128 flex flex-col items-center justify-center bg-stone-900 text-white px-4 py-10 transition-transform duration-300 ${
        isZoomed ? 'scale-[1.2]' : ''
      }`}
    >
      <h1 className="text-5xl font-bold mb-16">Gacha Merchandise</h1>

      <div className="relative w-full max-w-6xl overflow-hidden border-4 border-stone-700 rounded-lg shadow-lg bg-stone-800">
        <div className="flex py-4 px-2" ref={stripRef}></div>
        <div className="absolute top-0 bottom-0 left-1/2 w-1 border-l-4 border-accent transform -translate-x-1/2 z-10" />
      </div>

      <button
        onClick={handleSpin}
        disabled={spinning || !canSpin}
        className="mt-8 px-8 py-3 bg-amber-500 hover:bg-amber-600 text-3xl font-bold rounded-lg shadow-lg transition-colors disabled:opacity-50"
      >
        {spinning ? 'Rolling...' : 'Open Chest'}
      </button>

      {!canSpin && !authLoading && (
        <div className="mt-4 text-red-600 font-semibold">
          Hanya user dengan role <b>Web Dev</b> atau <b>Game Dev</b> yang bisa spin.
        </div>
      )}

      {error && <p className="mt-4 text-red-500 font-semibold">{error}</p>}

      {result && (
        <div className="mt-8 text-center">
          <div className="text-4xl mb-5">Kamu mendapatkan:</div>
          <div className="flex flex-col items-center mt-2">
            <img src={result.image} alt={result.name} width={264} height={264} className="rounded-lg shadow mb-2" />
            <div className="text-3xl font-bold p-4 my-5 rounded bg-stone-700 border border-stone-500">{result.name}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MerchWheel;
