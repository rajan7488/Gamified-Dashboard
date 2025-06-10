import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  // Load dark mode from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('darkMode') === 'true';
    setDarkMode(stored);
    document.documentElement.classList.toggle('dark', stored);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    document.documentElement.classList.toggle('dark', newMode);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md p-4 text-gray-800 dark:text-white">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h4 className="text-2xl font-bold">
          Gamified<span className="text-blue-600 dark:text-blue-400">Dashboard</span>
        </h4>

        <ul className="hidden md:flex gap-6 font-medium items-center">
          {user ? (
            <>
              <li className="hover:text-blue-600 dark:hover:text-blue-400">
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li className="hover:text-blue-600 dark:hover:text-blue-400">
                <Link to="/checkin">Mood Check-In</Link>
              </li>
              <li className="hover:text-blue-600 dark:hover:text-blue-400">
                <Link to='/MoodHistory'>Mood-History</Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-700 dark:hover:text-red-400 cursor-pointer"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li className="hover:text-blue-600 dark:hover:text-blue-400">
              <Link to="/login">Login</Link>
            </li>
          )}
          <li>
            <button onClick={toggleDarkMode}  className='mt-3 ml-4 cursor-pointer'>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </li>
        </ul>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button onClick={toggleDarkMode}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden mt-2 px-4">
          <ul className="flex flex-col gap-4 font-medium">
            {user ? (
              <>
                <li>
                  <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/checkin" onClick={() => setIsOpen(false)}>
                    Mood Check-In
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="text-red-500"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
              </li>
              
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
