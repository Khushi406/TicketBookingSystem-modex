import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <span className="logo-icon">🎫</span>
          <span className="logo-text">Tickety</span>
        </Link>
        
        <nav className="header-nav">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            <span className="nav-icon">�</span>
            <span>Shows</span>
          </Link>
          <Link 
            to="/admin" 
            className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
          >
            <span className="nav-icon">⚙</span>
            <span>Admin</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;