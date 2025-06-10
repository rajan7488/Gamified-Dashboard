import { useEffect, useState } from 'react';
import { auth, db } from '../firebase';

import {
  doc, getDoc, updateDoc,
  collection, query, orderBy, limit,
  getDocs, Timestamp,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';

import Spinner from './Spinner';
import UserInfo from './UserInfo';
import ProgressBar from './ProgressBar';
import DailyRewardButton from './DailyRewardButton';
import Leaderboard from './LeaderBoard';
// import AvatarUpload from './AvatarUpload';

const DAILY_XP_REWARD = 50;

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setData(null);
        setLeaderboard([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      try {
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          setError('User data not found.');
          setData(null);
          setLoading(false);
          return;
        }

        let userData = snap.data();
        let xpNeeded = userData.level * 100;
        let leveledUp = false;

        while (userData.xp >= xpNeeded) {
          userData.xp -= xpNeeded;
          userData.level += 1;
          xpNeeded = userData.level * 100;
          leveledUp = true;
        }

        if (leveledUp) {
          await updateDoc(userRef, {
            xp: userData.xp,
            level: userData.level,
          });
          toast.success(`🎉 Congrats! You reached Level ${userData.level}!`);
        }

        setData(userData);

        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('xp', 'desc'), limit(5));
        const leaderboardSnap = await getDocs(q);
        const leaderboardData = [];

        leaderboardSnap.forEach((doc) => {
          const d = doc.data();
          leaderboardData.push({
            id: doc.id,
            name: d.name || d.email?.split('@')[0] || 'User',
            level: d.level,
            xp: d.xp,
          });
        });

        setLeaderboard(leaderboardData);
      } catch (err) {
        console.error('Error fetching user data:', err);
        toast.error('Failed to load user data.');
        setError('Failed to load user data.');
        setData(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDailyReward = async () => {
    if (!data) return;
    setClaiming(true);

    try {
      const now = Timestamp.now();
      const lastClaim = data.lastDailyClaim || null;

      if (lastClaim && now.seconds - lastClaim.seconds < 24 * 3600) {
        const remaining = 24 * 3600 - (now.seconds - lastClaim.seconds);
        const hours = Math.floor(remaining / 3600);
        const mins = Math.floor((remaining % 3600) / 60);
        toast.info(`⏳ Daily reward already claimed. Come back in ${hours}h ${mins}m.`);
        setClaiming(false);
        return;
      }

      const userRef = doc(db, 'users', auth.currentUser.uid);
      const newXP = (data.xp || 0) + DAILY_XP_REWARD;
      let newLevel = data.level;
      let remainingXP = newXP;
      let xpNeeded = newLevel * 100;

      while (remainingXP >= xpNeeded) {
        remainingXP -= xpNeeded;
        newLevel += 1;
        xpNeeded = newLevel * 100;
      }

      const safeUpdate = {
        xp: remainingXP,
        level: newLevel,
        lastDailyClaim: now,
        streak: (data.streak || 0) + 1,
      };

      if (data.mood) safeUpdate.mood = data.mood;
      if (data.name) safeUpdate.name = data.name;

      await updateDoc(userRef, safeUpdate);
      setData((prev) => ({ ...prev, ...safeUpdate }));

      if (newLevel > data.level) {
        toast.success(`🎉 Congrats! You reached Level ${newLevel}!`);
      } else {
        toast.success(`🎁 You received ${DAILY_XP_REWARD} XP!`);
      }
    } catch (err) {
      console.error('Error claiming daily reward:', err);
      toast.error('Failed to claim daily reward.');
    } finally {
      setClaiming(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-600 text-center mt-4 font-semibold">{error}</p>;
  if (!data) return <p className="text-gray-500 text-center mt-4 font-semibold">No user data available.</p>;

 return (
  <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 text-gray-800 dark:text-white rounded-xl shadow-md mt-8">
    <div className="flex items-center mb-6 space-x-4">
      <img
        src={data.avatarURL || './Avatar.jpg'}
        alt="User Avatar"
        className="w-16 h-16 rounded-full border-2 border-blue-500 object-cover"
      />
      <div>
        <h2 className="text-xl font-semibold">{data.name}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-300">{auth.currentUser?.email}</p>
      </div>
    </div>
    {/* {auth.currentUser?.uid === data.id && <AvatarUpload/>} */}
    <UserInfo
      name={data.name}
      email={auth.currentUser?.email}
      level={data.level}
      xp={data.xp}
    />

    <ProgressBar xp={data.xp} level={data.level} />

    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 mb-6 mt-4">
      <p>🔥 <strong>Streak:</strong> {data.streak} day{data.streak !== 1 && 's'}</p>
      {data.mood && <p>😊 <strong>Current Mood:</strong> {data.mood}</p>}
    </div>

    {!claiming && <DailyRewardButton onClick={handleDailyReward} claiming={claiming} />}

    <Leaderboard leaderboard={leaderboard} />
  </div>
);
}
export default Dashboard;
