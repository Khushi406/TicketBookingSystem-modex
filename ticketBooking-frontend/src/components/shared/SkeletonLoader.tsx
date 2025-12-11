import React from 'react';
import './SkeletonLoader.css';

interface SkeletonLoaderProps {
  type?: 'card' | 'seat' | 'form';
  count?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type = 'card', count = 3 }) => {
  if (type === 'card') {
    return (
      <div className="skeleton-container">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="skeleton-card">
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text short"></div>
            <div className="skeleton skeleton-button"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'seat') {
    return (
      <div className="skeleton-seat-container">
        <div className="skeleton skeleton-screen"></div>
        <div className="skeleton-seat-grid">
          {Array.from({ length: 40 }).map((_, index) => (
            <div key={index} className="skeleton skeleton-seat"></div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'form') {
    return (
      <div className="skeleton-form">
        <div className="skeleton skeleton-input"></div>
        <div className="skeleton skeleton-input"></div>
        <div className="skeleton skeleton-button"></div>
      </div>
    );
  }

  return null;
};

export default SkeletonLoader;
