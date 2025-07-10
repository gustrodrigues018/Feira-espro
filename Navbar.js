import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/dashboard" className="navbar-brand">
          Portal Espro
        </Link>
        
        <ul className="navbar-nav">
          <li>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
          </li>
          <li>
            <Link to="/content" className="nav-link">Conteúdos</Link>
          </li>
          {(user.role === 'professor' || user.role === 'admin') && (
            <li>
              <Link to="/add-content" className="nav-link">Adicionar Conteúdo</Link>
            </li>
          )}
          <li>
            <Link to="/programming" className="nav-link">Programação</Link>
          </li>
          <li>
            <span style={{ color: '#666', fontSize: '0.9rem' }}>
              Olá, {user.username} ({user.role})
            </span>
          </li>
          <li>
            <button onClick={onLogout} className="logout-btn">
              Sair
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;

