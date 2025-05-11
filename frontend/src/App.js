

import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Boards from './pages/Boards';
import Board from './pages/Board';

export const ThemeContext = createContext(null);

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.body.className = theme;
    document.body.style.backgroundColor = theme === 'dark' ? '#212529' : '#f8f9fa';
  }, [theme]);

  useEffect(() => {
    checkAuthStatus();
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/check', {
        withCredentials: true
      });
      setLoggedIn(response.data.loggedIn);
    } catch (error) {
      console.error('Auth check failed:', error);
      setLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, {
        withCredentials: true
      });
      setLoggedIn(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  if (loading) {
    return <div className="d-flex justify-content-center mt-5">Loading...</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Router>
        <Navbar loggedIn={loggedIn} onLogout={handleLogout} />
        <div className={`app-container ${theme}`}>
          <div className="container mt-4">
            <Routes>
              <Route 
                path="/login" 
                element={loggedIn ? <Navigate to="/boards" replace /> : <Login onLogin={handleLogin} />} 
              />
              <Route 
                path="/register" 
                element={loggedIn ? <Navigate to="/boards" replace /> : <Register />} 
              />
              <Route 
                path="/boards" 
                element={loggedIn ? <Boards /> : <Navigate to="/login" replace />} 
              />
              <Route 
                path="/boards/:boardId" 
                element={loggedIn ? <Board /> : <Navigate to="/login" replace />} 
              />
              <Route 
                path="/" 
                element={<Navigate to={loggedIn ? "/boards" : "/login"} replace />} 
              />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeContext.Provider>
  );
}

export default App;