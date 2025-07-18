import React, { useState, useEffect } from 'react';
import { auth, googleProvider, db } from '../firebase/config';
import { signInWithPopup, signOut, User } from 'firebase/auth';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp, deleteDoc, doc, getDoc } from 'firebase/firestore';
import DefaultAvatar from './DefaultAvatar';
import { Trash2, LogOut } from 'lucide-react';
import UserRoleBadge from './UserRoleBadge';

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
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState<Record<string, Comment[]>>({});
  const [userRoles, setUserRoles] = useState<Record<string, string>>({});
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; open: boolean }>({ id: '', open: false });

  // Handle auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // console.log('Auth state changed:', user?.photoURL);
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  // Handle comments subscription - PERUBAHAN: Hapus kondisi user check agar guest bisa lihat komentar
  useEffect(() => {
    // KODE LAMA: Hanya load komentar jika user sudah login
    // if (!user) {
    //   setComments([]); // Clear comments when user is not logged in
    //   return;
    // }

    const q = query(collection(db, 'comments'), orderBy('timestamp', 'desc'));
    const unsubscribeComments = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => {
        const data = doc.data();
        // console.log('Comment data:', data);
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
    }, (/* error */) => {
      // console.error('Error fetching comments:', error);
    });

    return () => unsubscribeComments();
  }, []); // PERUBAHAN: Hapus dependency [user] agar selalu load komentar

  // Fetch replies for each comment
  useEffect(() => {
    const unsubscribes: Array<() => void> = [];
    comments.forEach(comment => {
      const q = collection(db, 'comments', comment.id, 'replies');
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setReplies(prev => ({
          ...prev,
          [comment.id]: snapshot.docs.map(doc => {
            const data = doc.data();
            // console.log('Reply data:', data);
            return {
              id: doc.id,
              text: data.text || '',
              userName: data.userName || 'Anonymous',
              userPhoto: data.userPhoto || '',
              timestamp: data.timestamp || null,
              userId: data.userId || '',
            };
          })
        }));
      });
      unsubscribes.push(unsubscribe);
    });
    return () => unsubscribes.forEach(unsub => unsub());
  }, [comments]);

  // Fetch user roles for all reply users
  useEffect(() => {
    const fetchRoles = async () => {
      const userIds = new Set<string>();
      comments.forEach(comment => {
        (replies[comment.id] || []).forEach(reply => {
          if (reply.userId && !userRoles[reply.userId]) {
            userIds.add(reply.userId);
          }
        });
      });
      const newRoles: Record<string, string> = {};
      await Promise.all(Array.from(userIds).map(async (uid) => {
        try {
          const userRef = doc(db, 'user-role', uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            // console.log('UserRole fetch:', uid, data);
            newRoles[uid] = data.role || '';
          } else {
            // console.log('UserRole fetch: not found', uid);
            newRoles[uid] = '';
          }
        } catch {
          // console.error('UserRole fetch error:', uid, err);
          newRoles[uid] = '';
        }
      }));
      if (Object.keys(newRoles).length > 0) {
        setUserRoles(prev => ({ ...prev, ...newRoles }));
      }
    };
    fetchRoles();
  }, [comments, replies, userRoles]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // console.log('Sign in successful:', result.user.photoURL);
    } catch {/* ignore */}
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // console.log('Sign out successful');
    } catch {/* ignore */}
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !user) return;

    setLoading(true);
    try {
      let photoURL = '';
      if (user.photoURL) {
        photoURL = user.photoURL.split('=')[0] + '=s400-c';
        // console.log('Modified photo URL:', photoURL);
      }
      
      await addDoc(collection(db, 'comments'), {
        text: comment,
        userName: user.displayName || 'Anonymous',
        userPhoto: photoURL,
        timestamp: serverTimestamp(),
        userId: user.uid
      });
      setComment('');
      // console.log('Comment added');
    } catch {/* ignore */}
    setLoading(false);
  };

  const handleReplySubmit = async (e: React.FormEvent, commentId: string) => {
    e.preventDefault();
    if (!user || !replyText.trim()) return;
    try {
      await addDoc(collection(db, 'comments', commentId, 'replies'), {
        text: replyText,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userPhoto: user.photoURL ? user.photoURL.split('=')[0] + '=s400-c' : '',
        timestamp: serverTimestamp(),
      });
      setReplyText('');
      setReplyTo(null);
      // console.log('Reply added');
    } catch {/* ignore */}
  };

  const handleDeleteComment = async (commentId: string, commentUserId: string) => {
    if (!user || user.uid !== commentUserId) return;
    setConfirmDelete({ id: commentId, open: true });
  };

  const confirmDeleteComment = async () => {
    if (!user || !confirmDelete.id) return;
    try {
      await deleteDoc(doc(db, 'comments', confirmDelete.id));
      // console.log('Comment deleted:', confirmDelete.id);
    } catch {/* ignore */}
    setConfirmDelete({ id: '', open: false });
  };

  const cancelDeleteComment = () => {
    setConfirmDelete({ id: '', open: false });
  };

  const handleDeleteReply = async (commentId: string, replyId: string, replyUserId: string) => {
    if (!user || user.uid !== replyUserId) return;
    try {
      await deleteDoc(doc(db, 'comments', commentId, 'replies', replyId));
      // console.log('Reply deleted:', replyId);
    } catch {/* ignore */}
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
    } catch {/* ignore */}
    return 'Invalid date';
  };

  const handlePhotoError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    // console.error('Error loading photo:', target.src);
    target.style.display = 'none';
    const nextSibling = target.nextElementSibling as HTMLElement;
    if (nextSibling) {
      nextSibling.classList.remove('hidden');
    }
  };

  // Modal confirmation for delete comment
  useEffect(() => {
    if (confirmDelete.open) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [confirmDelete.open]);

  return (
    <>
      <div className="w-full max-w-4xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-md px-4">
        <h3 className="text-3xl font-bold mb-4 text-amber-700 font-serif">Community Comments</h3>
        
        {!user ? (
          // PERUBAHAN: Tambah placeholder untuk guest users
          <div className="mb-6">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4">
              <p className="text-amber-700 text-center">
                🔒 Sign in to join the conversation and share your thoughts!
              </p>
            </div>
            <button
              onClick={handleGoogleSignIn}
              className="w-full px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-md transition-colors"
            >
              Sign in with Google to comment
            </button>
          </div>
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
                  className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-full transition-all duration-200"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmitComment} className="flex flex-col gap-4">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your comment..."
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[100px] text-black placeholder-gray-900"
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

        {/* PERUBAHAN: Tambah informasi jika belum ada komentar */}
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-stone-500 text-lg">
              💬 No comments yet. {!user ? 'Sign in and ' : ''}Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => {
              const photoURL = comment.userPhoto;
              // console.log('Comment photo URL:', photoURL);
              return (
                <div key={comment.id} className="flex gap-4 p-4 bg-stone-50 rounded-lg border border-stone-300">
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
                      <div className="flex items-baseline gap-2">
                        <UserRoleBadge uid={comment.userId} userName={comment.userName} />
                        <span className="text-sm text-stone-500">
                          {formatDate(comment.timestamp)}
                        </span>
                      </div>
                      {user && user.uid === comment.userId && (
                        <button
                          onClick={() => handleDeleteComment(comment.id, comment.userId)}
                          className="text-red-600 hover:text-red-700 text-sm p-1 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete comment (Only the author can delete their comment)"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                    <p className="text-stone-700 mt-[10px] text-left">{comment.text}</p>
                    <button
                      className="text-xs text-blue-600 hover:underline ml-2"
                      onClick={() => setReplyTo(comment.id)}
                    >
                      Reply
                    </button>
                    {replyTo === comment.id && (
                      <form
                        onSubmit={e => handleReplySubmit(e, comment.id)}
                        className="flex flex-col gap-2 mt-2"
                      >
                        <textarea
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                          className="w-full px-2 py-1 border rounded text-stone-700 placeholder-stone-500"
                          placeholder="Write your reply..."
                          required
                        />
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="px-3 py-1 bg-amber-600 text-white rounded"
                          >
                            Send
                          </button>
                          <button
                            type="button"
                            className="px-3 py-1 bg-gray-200 rounded"
                            onClick={() => { setReplyTo(null); setReplyText(''); }}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                    <div className="ml-8 mt-2 space-y-2">
                      {(replies[comment.id] || []).map(reply => {
                        const replyRole = userRoles[reply.userId] || '';
                        return (
                          <div
                            key={reply.id}
                            className={
                              `flex gap-4 p-4 bg-amber-50 rounded-lg border border-stone-300 ` +
                              (replyRole === 'web-dev'
                                ? 'border-l-4 border-l-amber-300'
                                : replyRole === 'game-dev'
                                ? 'border-l-4 border-l-green-300'
                                : 'border-l-4 border-l-stone-300')
                            }
                          >
                            <div className="relative">
                              {reply.userPhoto ? (
                                <img
                                  src={reply.userPhoto}
                                  alt={reply.userName}
                                  className="w-10 h-10 rounded-full object-cover"
                                  onError={handlePhotoError}
                                />
                              ) : (
                                <DefaultAvatar />
                              )}
                            </div>
                            <div className="flex-grow">
                              <div className="flex items-center justify-between">
                                <div className="flex items-baseline gap-2">
                                  <UserRoleBadge uid={reply.userId} userName={reply.userName} />
                                  <span className="text-sm text-stone-500">
                                    {reply.timestamp?.toDate ? formatDate(reply.timestamp) : ''}
                                  </span>
                                </div>
                                {user && user.uid === reply.userId && (
                                  <button
                                    onClick={() => handleDeleteReply(comment.id, reply.id, reply.userId)}
                                    className="text-red-600 hover:text-red-700 text-sm p-1 hover:bg-red-50 rounded-full transition-colors"
                                    title="Delete reply (Only the author can delete their reply)"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                )}
                              </div>
                              <p className="text-stone-700 mt-[10px] text-left">{reply.text}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {confirmDelete.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-gray-100 rounded-lg shadow-lg p-6 w-full max-w-sm mx-auto flex flex-col items-center border border-amber-400">
            <div className="text-amber-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
            </div>
            <h2 className="text-lg font-semibold mb-2 text-center">Delete Comment?</h2>
            <p className="text-stone-600 mb-6 text-center">Are you sure you want to delete this comment? This action cannot be undone.</p>
            <div className="flex gap-4 w-full justify-center">
              <button
                onClick={confirmDeleteComment}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold transition-colors"
              >
                Yes, Delete
              </button>
              <button
                onClick={cancelDeleteComment}
                className="px-4 py-2 bg-gray-200 text-stone-700 rounded hover:bg-gray-300 font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CommentSection;