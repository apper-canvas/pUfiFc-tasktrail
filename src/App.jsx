import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { initializeApperClient } from './services/apperService';
import { setUser } from './store/userSlice';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);
  
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Initialize Apper client
    initializeApperClient();
    
    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem('apperUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        dispatch(setUser(userData));
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('apperUser');
      }
    }
  }, [dispatch]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 glass border-b border-surface-200 dark:border-surface-700">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <motion.div 
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              className="text-primary font-bold text-2xl"
            >
              TaskTrail
            </motion.div>
          </div>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleDarkMode}
            className="p-2 rounded-full neu-light"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Home />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="border-t border-surface-200 dark:border-surface-700 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-surface-500">
          <p>© {new Date().getFullYear()} TaskTrail. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;