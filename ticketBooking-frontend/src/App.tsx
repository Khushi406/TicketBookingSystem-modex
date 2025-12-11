import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ShowProvider } from './context/ShowContext';
import { ToastProvider } from './context/ToastContext';
import Header from './components/shared/Header';
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
            <Header />
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