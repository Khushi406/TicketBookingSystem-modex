import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-title">
          🎟️ Tickety
        </Link>
        <nav className="header-nav">
          <Link to="/" className="nav-link">
            Shows
          </Link>
          <Link to="/admin" className="nav-link admin-link">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;