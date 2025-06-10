const DailyRewardButton = ({ onClick, claiming }) => (
  <button
    onClick={onClick}
    disabled={claiming}
    className="mb-6 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded transition cursor-pointer"
  >
    {claiming ? 'Claiming...' : 'Claim Daily Reward 🎁'}
  </button>
);

export default DailyRewardButton;
