const UserInfo = ({ name, email, level, xp }) => {
  const xpProgress = Math.min((xp / (level * 100)) * 100, 100).toFixed(0);

  return (
    <div className="mb-6">
      <h2 className="text-3xl font-bold mb-2">Welcome, <span className="text-blue-600">{name || 'User'}</span></h2>
      <p className="text-lg mb-4">{email}</p>
      <p className="font-medium text-lg">Level: <span className="font-bold">{level}</span></p>
      <p className="text-sm text-gray-600 dark:text-gray-400">XP: <strong>{xp}</strong> / {level * 100}</p>
    </div>
  );
};

export default UserInfo;
