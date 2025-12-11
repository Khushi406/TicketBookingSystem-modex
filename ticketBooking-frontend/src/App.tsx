import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ShowProvider } from './context/ShowContext';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/shared/ToastContainer';
import AdminDashboard from './components/admin/AdminDashboard';
import HomePage from './components/user/HomePage';
import BookingPage from './components/user/BookingPage';
import './App.css';

const App: React.FC = () => {
  return (
    <ToastProvider>
      <ShowProvider>
        <Router>
          <div className="App">
            <nav className="navbar">
              <div className="nav-container">
                <Link to="/" className="nav-title">Tickety</Link>
                <div className="nav-links">
                  <Link to="/" className="nav-link">Shows</Link>
                  <Link to="/admin" className="nav-link">Admin</Link>
                </div>
              </div>
            </nav>
            <ToastContainer />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/booking/:showId" element={<BookingPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </ShowProvider>
    </ToastProvider>
  );
};

export default App;