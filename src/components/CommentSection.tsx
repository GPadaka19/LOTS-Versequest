import React, { useState, useEffect } from 'react';
import { auth, googleProvider, db } from '../firebase/config';
import { signInWithPopup, signOut, User } from 'firebase/auth';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp, deleteDoc, doc } from 'firebase/firestore';
import DefaultAvatar from './DefaultAvatar';

interface Comment {
  id: string;
  text: string;
  userName: string;
  userPhoto: string;
  timestamp: Timestamp | null;
  userId: string;
}

const CommentSection = () => {
  const [user, setUser] = useState<User | null>(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  // Handle auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log('Auth state changed:', user?.photoURL);
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  // Handle comments subscription
  useEffect(() => {
    if (!user) {
      setComments([]); // Clear comments when user is not logged in
      return;
    }

    const q = query(collection(db, 'comments'), orderBy('timestamp', 'desc'));
    const unsubscribeComments = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Comment data:', data);
        return {
          id: doc.id,
          text: data.text || '',
          userName: data.userName || 'Anonymous',
          userPhoto: data.userPhoto || '',
          timestamp: data.timestamp || null,
          userId: data.userId || ''
        };
      }) as Comment[];
      setComments(commentsData);
    }, (error) => {
      console.error('Error fetching comments:', error);
    });

    return () => unsubscribeComments();
  }, [user]);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Sign in successful:', result.user.photoURL);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !user) return;

    setLoading(true);
    try {
      let photoURL = '';
      if (user.photoURL) {
        photoURL = user.photoURL.split('=')[0] + '=s400-c';
        console.log('Modified photo URL:', photoURL);
      }
      
      await addDoc(collection(db, 'comments'), {
        text: comment,
        userName: user.displayName || 'Anonymous',
        userPhoto: photoURL,
        timestamp: serverTimestamp(),
        userId: user.uid
      });
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
    setLoading(false);
  };

  const handleDeleteComment = async (commentId: string, commentUserId: string) => {
    if (!user || user.uid !== commentUserId) return;
    
    try {
      await deleteDoc(doc(db, 'comments', commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const formatDate = (timestamp: Timestamp | null) => {
    if (!timestamp) return 'Just now';
    try {
      const date = timestamp.toDate();
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const handlePhotoError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    console.error('Error loading photo:', target.src);
    target.style.display = 'none';
    const nextSibling = target.nextElementSibling as HTMLElement;
    if (nextSibling) {
      nextSibling.classList.remove('hidden');
    }
  };

  return (
    <div className="mt-12 p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 text-amber-700">Community Comments</h3>
      
      {!user ? (
        <button
          onClick={handleGoogleSignIn}
          className="w-full px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-md transition-colors mb-6"
        >
          Sign in with Google to comment
        </button>
      ) : (
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              {user.photoURL ? (
                <>
                  <img
                    key={`user-photo-${user.uid}`}
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={handlePhotoError}
                  />
                  <div className="hidden">
                    <DefaultAvatar />
                  </div>
                </>
              ) : (
                <DefaultAvatar />
              )}
            </div>
            <div>
              <p className="font-medium text-amber-600">{user.displayName || 'Anonymous User'}</p>
              <button
                onClick={handleSignOut}
                className="text-sm text-amber-600 hover:text-amber-700"
              >
                Sign out
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmitComment} className="flex flex-col gap-4">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment..."
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[100px] text-black placeholder-gray-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-md transition-colors disabled:opacity-50"
            >
              {loading ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {comments.map((comment) => {
          const photoURL = comment.userPhoto;
          console.log('Comment photo URL:', photoURL);
          
          return (
            <div key={comment.id} className="flex gap-4 p-4 bg-stone-50 rounded-lg">
              <div className="relative">
                {photoURL ? (
                  <>
                    <img
                      key={`comment-photo-${comment.id}`}
                      src={photoURL}
                      alt={comment.userName}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={handlePhotoError}
                    />
                    <div className="hidden">
                      <DefaultAvatar />
                    </div>
                  </>
                ) : (
                  <DefaultAvatar />
                )}
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-amber-600">{comment.userName}</p>
                    <span className="text-sm text-stone-500">
                      {formatDate(comment.timestamp)}
                    </span>
                  </div>
                  {user && user.uid === comment.userId && (
                    <button
                      onClick={() => handleDeleteComment(comment.id, comment.userId)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="text-stone-700 mt-1">{comment.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommentSection; 