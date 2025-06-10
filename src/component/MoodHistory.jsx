// components/MoodHistory.jsx
import { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const MoodHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setHistory(data.moods || []);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="p-4 bg-white shadow rounded-xl mt-4">
      <h3 className="text-xl font-semibold mb-2">Mood History</h3>
      {history.length === 0 ? (
        <p>No moods yet. Start checking in!</p>
      ) : (
        <ul className="space-y-2">
          {history
            .slice()
            .reverse()
            .map((entry, index) => (
              <li key={index} className="p-2 border rounded flex flex-col">
                <span className="text-2xl">{entry.mood}</span>
                <span className="text-sm text-gray-600">
                  {new Date(entry.timestamp?.seconds * 1000).toLocaleString()}
                </span>
                {entry.note && <p className="mt-1 text-gray-800">{entry.note}</p>}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default MoodHistory;
