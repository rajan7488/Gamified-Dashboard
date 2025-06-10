// AuthForm.jsx
import { useState } from 'react';
import { toast } from 'react-toastify';
import { auth, db } from '../firebase';
import { Navigate,useNavigate } from 'react-router';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const[name,setName]=useState('');
  const navigate=useNavigate();
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
         toast.success('Logged in!');
         navigate('/')
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        

      await setDoc(doc(db, 'users', user.uid), {
        name,
        email: user.email,
        createdAt: new Date(),
        xp: 0,
        level: 1,
        streak: 0,
        mood: '',
      })
 toast.success('Account created!');
 navigate('/')
        console.log("Created user:", user);
      }
    } catch (error) {
      console.error("Firebase auth error:", error.message);
       toast.error(error.message);
    }

    setName('')
    setEmail('');
    setPassword('');
    setIsLogin(true);
  };

   return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-lg font-sans">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>
        {!isLogin && (
  <input
  className="mb-4 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    value={name}
    onChange={(e) => setName(e.target.value)}
    placeholder="Name"
    required
  />
)}

        <input
          className="mb-4 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="email"
          placeholder="Enter Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="mb-6 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition cursor-pointer"
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>
      <button
        onClick={() => setIsLogin(!isLogin)}
        type="button"
        className="mt-4 text-blue-600 underline hover:text-blue-800 text-center w-full cursor-pointer"
      >
        {isLogin ? 'Create an account' : 'Already have an account? Log in'}
      </button>
    </div>
  );
};

export default AuthForm;
