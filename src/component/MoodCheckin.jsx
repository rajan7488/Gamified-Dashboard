// components/MoodCheckIn.jsx
import { useState } from 'react';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

const MoodCheckIn = () => {
  const [mood, setMood] = useState('');
  const [note, setNote] = useState('');
  const navigate = useNavigate();

  const handleCheckIn = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return toast.error("Please login first");

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    const data = userSnap.data();

    const now = new Date();
    const lastDate = data.lastCheckIn?.toDate?.() || null;
    let newXP = (data.xp || 0) + 10;
    let newStreak = data.streak || 0;
    const isNewDay =
      !lastDate || now.toDateString() !== new Date(lastDate).toDateString();

    if (isNewDay) {
      const diff =
        lastDate && (now - new Date(lastDate)) / (1000 * 60 * 60 * 24);
      newStreak = diff <= 1.5 ? newStreak + 1 : 1;
    }

    await updateDoc(userRef, {
      mood,
      note,
      xp: newXP,
      streak: newStreak,
      lastCheckIn: now,
      moods: arrayUnion({
        mood,
        note,
        timestamp: now,
      }),
    });

    toast.success("Mood checked in! (+10 XP)");
    setMood('');
    setNote('');
    navigate('/');
  } catch (err) {
    console.error(err);
    toast.error("Check-in failed");
  }
};


  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-center">Mood Check-In</h3>

      <div className="flex justify-center gap-4 mb-4">
        {['😄', '😐', '😢'].map((emoji) => (
          <button
            key={emoji}
            className={`text-3xl px-4 py-2 rounded-full border-2 ${
              mood === emoji
                ? 'border-blue-500 bg-blue-100 dark:bg-blue-800'
                : 'border-gray-300'
            }`}
            onClick={() => setMood(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-700"
        placeholder="Add a note"
        rows="3"
        required
      />

      <button
        onClick={handleCheckIn}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition cursor-pointer"
        disabled={!mood}
      >
        Submit Check-In
      </button>
    </div>
  );
};

export default MoodCheckIn;
