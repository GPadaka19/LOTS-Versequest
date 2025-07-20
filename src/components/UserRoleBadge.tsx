import React, { useEffect, useState, useMemo } from 'react';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

interface UserRoleBadgeProps {
  uid: string;
  userName: string;
  className?: string;
}

const WEBDEV_EMOJI_URL =
  'https://em-content.zobj.net/source/apple/81/male-technologist_1f468-200d-1f4bb.png';

const GAMEDEV_EMOJI_URL =
  'https://em-content.zobj.net/source/apple/419/video-game_1f3ae.png';

const UserRoleBadge: React.FC<UserRoleBadgeProps> = ({ uid, userName, className = '' }) => {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      setLoading(true);
      try {
        const userRef = doc(db, 'user-role', uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setRole(data.role || null);
        } else {
          setRole(null);
        }
      } catch {
        setRole(null);
      }
      setLoading(false);
    };
    fetchRole();
  }, [uid]);

  const badge = useMemo(() => {
    if (role === 'web-dev') {
      return { label: 'Web Dev', emoji: WEBDEV_EMOJI_URL, badgeClass: 'bg-amber-200 text-amber-700' };
    }
    if (role === 'game-dev') {
      return { label: 'Game Dev', emoji: GAMEDEV_EMOJI_URL, badgeClass: 'bg-green-200 text-green-700' };
    }
    return null;
  }, [role]);

  const usernameColor = useMemo(() => {
    if (!loading && role === 'game-dev') return 'text-green-700';
    if (!loading && role === 'web-dev') return 'text-amber-700';
    return 'text-stone-700';
  }, [loading, role]);

  return (
    <span className={`user-info font-medium ${usernameColor} ${className}`}>
      {userName}
      {!loading && badge && (
        <span
          className={`text-xs ${badge.badgeClass} w-[90px] justify-center py-0.5 rounded-full font-medium flex items-center gap-1 ml-2`}
        >
          <img
            src={badge.emoji}
            className="w-4 h-4 inline-block"
            alt={badge.label}
          />
          {badge.label}
        </span>
      )}
    </span>
  );
};

export default UserRoleBadge; 