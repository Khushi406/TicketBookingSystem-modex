import React, { useState } from 'react';
import { showsApi } from '../../api/shows';
import { useShows } from '../../context/ShowContext';
import { useToast } from '../../context/ToastContext';

const CreateShowForm: React.FC = () => {
  const { addShow } = useShows();
  const { addToast } = useToast();
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [totalSeats, setTotalSeats] = useState('40');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const seats = Number(totalSeats);

    if (!name.trim()) {
      newErrors.name = 'Show name is required';
    } else if (name.length < 3) {
      newErrors.name = 'Show name must be at least 3 characters';
    }

    if (!startTime) {
      newErrors.start_time = 'Start time is required';
    } else {
      const selectedDate = new Date(startTime);
      const now = new Date();
      if (selectedDate <= now) {
        newErrors.start_time = 'Start time must be in the future';
      }
    }

    if (isNaN(seats) || seats < 1 || seats > 100) {
      newErrors.total_seats = 'Total seats must be a number between 1 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      addToast('Please fix the errors in the form', 'error');
      return;
    }

    setLoading(true);

    try {
      const show = await showsApi.createShow({
        name,
        start_time: new Date(startTime).toISOString(),
        total_seats: Number(totalSeats),
      });
      addShow(show);
      addToast(`Show "${show.name}" created successfully!`, 'success');
      setName('');
      setStartTime('');
      setTotalSeats('40');
      setErrors({});
    } catch (err: any) {
      const errorMsg = err.error || err.message || 'Failed to create show';
      addToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-show-form">
      <div className="form-group">
        <label htmlFor="name">Show Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Evening Express"
          className={errors.name ? 'input-error' : ''}
        />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="start_time">Start Time *</label>
        <input
          type="datetime-local"
          id="start_time"
          name="start_time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className={errors.start_time ? 'input-error' : ''}
        />
        {errors.start_time && <span className="field-error">{errors.start_time}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="total_seats">Total Seats *</label>
        <input
          type="number"
          id="total_seats"
          name="total_seats"
          value={totalSeats}
          onChange={(e) => setTotalSeats(e.target.value)}
          min="1"
          max="100"
          placeholder="Between 1 and 100"
          className={errors.total_seats ? 'input-error' : ''}
        />
        {errors.total_seats && <span className="field-error">{errors.total_seats}</span>}
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? (
          <>
            <span className="btn-spinner"></span>
            Creating...
          </>
        ) : (
          '➕ Create Show'
        )}
      </button>
    </form>
  );
};

export default CreateShowForm;