import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AuthForm from './component/AuthForm';
import Dashboard from './component/Dashboard';
import MoodCheckIn from './component/MoodCheckin';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './navbar';
import MoodHistory from './component/MoodHistory';

function App() {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <Router>
      <div className="App bg-white dark:bg-gray-950 min-h-screen text-gray-900 dark:text-white">
        <Navbar />
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <AuthForm />} />
          <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/checkin"
            element={user ? <MoodCheckIn /> : <Navigate to="/login" />}
          />
          <Route path='/MoodHistory' element={user?<MoodHistory/>:<Navigate to='/login'/>}/>
          <Route path="*" element={<p className="text-center mt-10">404 Page Not Found</p>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
