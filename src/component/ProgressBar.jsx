const ProgressBar = ({ xp, level }) => {
  const xpProgress = Math.min((xp / (level * 100)) * 100, 100).toFixed(0);

  return (
    <>
      <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-2">
        <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all" style={{ width: `${xpProgress}%` }} />
      </div>
      <p className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">{xpProgress}%</p>
    </>
  );
};

export default ProgressBar;
