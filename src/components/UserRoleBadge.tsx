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

const UserRoleBadge: React.FC<UserRoleBadgeProps> = ({ uid, userName, className = '' }) => {
  const [isWebDev, setIsWebDev] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      setLoading(true);
      try {
        const userRef = doc(db, 'user-role', uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          console.log('UserRoleBadge data:', data); // <--- LOG
          if (data.role === 'web-dev') {
            setIsWebDev(true);
          }
        } else {
          console.log('UserRoleBadge: user not found');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
      setLoading(false);
    };
    fetchRole();
  }, [uid]);

  return (
    <span className={`user-info font-medium text-amber-600 ${className}`}>
      {userName}
      {!loading && isWebDev && (
        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ml-2">
          <img
            src={WEBDEV_EMOJI_URL}
            className="w-4 h-4 inline-block"
            alt="Web Dev"
          />
          Web Dev
        </span>
      )}
    </span>
  );
};

export default UserRoleBadge; 