import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Componentes
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import EducationalContent from './components/EducationalContent';
import AddContent from './components/AddContent';
import ProgrammingChallenges from './components/ProgrammingChallenges';
import Navbar from './components/Navbar';

// Configurar axios para incluir cookies
axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se o usuário está logado
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('/api/profile');
      setUser(response.data);
    } catch (error) {
      console.log('Usuário não autenticado');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout');
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {user && <Navbar user={user} onLogout={handleLogout} />}
        
        <Routes>
          <Route 
            path="/login" 
            element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/register" 
            element={!user ? <Register /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/content" 
            element={user ? <EducationalContent user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/add-content" 
            element={user && (user.role === 'professor' || user.role === 'admin') ? 
              <AddContent user={user} /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/programming" 
            element={user ? <ProgrammingChallenges user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/" 
            element={<Navigate to={user ? "/dashboard" : "/login"} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

