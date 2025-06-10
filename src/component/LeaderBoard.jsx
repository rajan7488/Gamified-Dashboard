import { auth } from '../firebase';

const Leaderboard = ({ leaderboard }) => (
  <div>
    <h3 className="text-xl font-bold mb-3">Leaderboard (Top 5 XP)</h3>
    {leaderboard.length > 0 ? (
      <ol className="list-decimal ml-5 space-y-1">
        {leaderboard.map((user) => (
          <li
            key={user.id}
            className={`flex justify-between ${user.id === auth.currentUser?.uid ? 'font-bold text-blue-600' : ''}`}
          >
            <span>{user.name}</span>
            <span>Lvl {user.level} - XP: {user.xp}</span>
          </li>
        ))}
      </ol>
    ) : (
      <p>No leaderboard data available.</p>
    )}
  </div>
);

export default Leaderboard;
