import React, { useState } from 'react';
import { useShows } from '../../context/ShowContext';
import { useToast } from '../../context/ToastContext';
import { showsApi } from '../../api/shows';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorMessage from '../shared/ErrorMessage';

const ShowList: React.FC = () => {
  const { shows, loading, error, removeShow } = useShows();
  const { addToast } = useToast();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This will also delete all associated bookings.`)) {
      return;
    }

    setDeletingId(id);
    try {
      await showsApi.deleteShow(id);
      removeShow(id);
      addToast(`Show "${name}" deleted successfully`, 'success');
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to delete show';
      addToast(errorMsg, 'error');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (shows.length === 0) return (
    <div className="no-shows-admin">
      <span className="no-shows-icon">📭</span>
      <p>No shows available. Create one above!</p>
    </div>
  );

  return (
    <div className="show-list">
      {shows.map((show) => (
        <div key={show.id} className="card show-card">
          <div className="show-card-header">
            <h3>{show.name}</h3>
            <button
              className="delete-btn"
              onClick={() => handleDelete(show.id, show.name)}
              disabled={deletingId === show.id}
              title="Delete show"
            >
              {deletingId === show.id ? (
                <span className="delete-spinner"></span>
              ) : (
                <span>🗑️</span>
              )}
            </button>
          </div>
          <div className="show-card-details">
            <p><span className="detail-icon">🕐</span> <strong>Start Time:</strong> {new Date(show.start_time).toLocaleString()}</p>
            <p><span className="detail-icon">💺</span> <strong>Total Seats:</strong> {show.total_seats}</p>
            <p><span className="detail-icon">📅</span> <strong>Created:</strong> {new Date(show.created_at || '').toLocaleDateString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShowList;