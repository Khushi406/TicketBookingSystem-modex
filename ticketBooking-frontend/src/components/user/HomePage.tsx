import React from 'react';
import { useShows } from '../../context/ShowContext';
import { useNavigate } from 'react-router-dom';
import SkeletonLoader from '../shared/SkeletonLoader';
import ErrorMessage from '../shared/ErrorMessage';
import './HomePage.css';

const HomePage: React.FC = () => {
  const { shows, loading, error } = useShows();
  const navigate = useNavigate();

  if (loading) return (
    <div className="home-page">
      <div className="page-header">
        <h1 className="page-title">Available Shows</h1>
        <p className="page-subtitle">Book your favorite shows with ease</p>
      </div>
      <SkeletonLoader type="card" count={3} />
    </div>
  );
  
  if (error) return <ErrorMessage message={error} />;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="home-page">
      <div className="page-header">
        <h1 className="page-title">Available Shows</h1>
        <p className="page-subtitle">Book your favorite shows with ease</p>
      </div>
      
      {shows.length === 0 ? (
        <div className="no-shows">
          <div className="no-shows-icon">📋</div>
          <h2>No Shows Available</h2>
          <p>Check back later for new shows!</p>
        </div>
      ) : (
        <div className="shows-grid">
          {shows.map((show, index) => {
            const { date, time } = formatDate(show.start_time);
            return (
              <div 
                key={show.id} 
                className="show-card-user"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="show-card-gradient"></div>
                <div className="show-header">
                  <h3>{show.name}</h3>
                  <span className="show-badge">Available</span>
                </div>
                <div className="show-details">
                  <div className="detail-row">
                    <span className="detail-icon">📅</span>
                    <div className="detail-content">
                      <span className="detail-label">Date</span>
                      <span className="detail-value">{date}</span>
                    </div>
                  </div>
                  <div className="detail-row">
                    <span className="detail-icon">⏰</span>
                    <div className="detail-content">
                      <span className="detail-label">Time</span>
                      <span className="detail-value">{time}</span>
                    </div>
                  </div>
                  <div className="detail-row">
                    <span className="detail-icon">🪑</span>
                    <div className="detail-content">
                      <span className="detail-label">Total Seats</span>
                      <span className="detail-value">{show.total_seats}</span>
                    </div>
                  </div>
                </div>
                <button 
                  className="btn btn-primary book-btn"
                  onClick={() => navigate(`/booking/${show.id}`)}
                >
                  <span>Book Now</span>
                  <span className="btn-arrow">→</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HomePage;