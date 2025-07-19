import React, { useEffect, useState } from 'react';
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
  const [badge, setBadge] = useState<null | { label: string; emoji: string }>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      setLoading(true);
      console.log('[UserRoleBadge] Fetching role for UID:', uid);
      try {
        const userRef = doc(db, 'user-role', uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          console.log('[UserRoleBadge] Firestore data for', uid, ':', data);
          // Web Dev badge
          if (uid === 'z8i4M64NHAO3HBBZSQTRJDC7GSg2' && data.role === 'web-dev') {
            setBadge({ label: 'Web Dev', emoji: WEBDEV_EMOJI_URL });
            console.log('[UserRoleBadge] Web Dev badge set for', uid);
          }
          // Game Dev badge
          else if (uid === 'awpW7OdqHeMwjkkjM37f5560wBh2' && data.role === 'game-dev') {
            setBadge({ label: 'Game Dev', emoji: GAMEDEV_EMOJI_URL });
            console.log('[UserRoleBadge] Game Dev badge set for', uid);
          } else {
            console.log('[UserRoleBadge] No badge set for', uid, 'with role', data.role);
          }
        } else {
          console.log('[UserRoleBadge] No Firestore document found for', uid);
        }
      } catch (error) {
        console.error('[UserRoleBadge] Error fetching user role for', uid, ':', error);
      }
      setLoading(false);
    };
    fetchRole();
  }, [uid]);

  useEffect(() => {
    if (!loading) {
      if (badge) {
        console.log('[UserRoleBadge] Badge will render for', uid, ':', badge);
      } else {
        console.log('[UserRoleBadge] No badge will render for', uid);
      }
    }
  }, [loading, badge, uid]);

  return (
    <span className={`user-info font-medium text-amber-600 ${className}`}>
      {userName}
      {!loading && badge && (
        <span
          className={`text-xs 
            ${badge.label === 'Web Dev' ? 'bg-amber-200 text-amber-700' : ''}
            ${badge.label === 'Game Dev' ? 'bg-green-200 text-green-700' : ''}
            w-[90px] justify-center
            py-0.5 rounded-full font-medium flex items-center gap-1 ml-2`
          }
        >
          <img
            src={badge.emoji}
            className="w-4 h-4 inline-block"
            alt={badge.label}
          />
          {badge.label.trim()}
        </span>
      )}
    </span>
  );
};

export default UserRoleBadge; 