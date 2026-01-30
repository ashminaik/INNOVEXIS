import { useState } from 'react';
import axios from 'axios';
import HomePage from './pages/HomePage';
import TranscribeApp from './pages/TranscribeApp';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const token = response.data.token;
      localStorage.setItem('token', token);
      setUser({ email });
    } catch (error) {
      alert('Login failed: ' + (error.response?.data?.msg || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (email, password) => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/auth/register`, { email, password });
      // Auto-login after registration
      await handleLogin(email, password);
    } catch (error) {
      alert('Registration failed: ' + (error.response?.data?.msg || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Check if user is logged in on mount
  useState(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ email: 'User' }); // Set user when token exists
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {!user ? (
        <HomePage onLogin={handleLogin} onRegister={handleRegister} loading={loading} />
      ) : (
        <TranscribeApp user={user} onLogout={handleLogout} apiUrl={API_URL} />
      )}
    </div>
  );
}

export default App;
