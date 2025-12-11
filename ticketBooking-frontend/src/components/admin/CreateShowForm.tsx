import React, { useState } from 'react';
import { showsApi } from '../../api/shows';
import { useShows } from '../../context/ShowContext';
import { useToast } from '../../context/ToastContext';

const CreateShowForm: React.FC = () => {
  const { addShow } = useShows();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    start_time: '',
    total_seats: 40,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Show name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Show name must be at least 3 characters';
    }

    if (!formData.start_time) {
      newErrors.start_time = 'Start time is required';
    } else {
      const selectedDate = new Date(formData.start_time);
      const now = new Date();
      if (selectedDate <= now) {
        newErrors.start_time = 'Start time must be in the future';
      }
    }

    if (formData.total_seats < 1 || formData.total_seats > 100) {
      newErrors.total_seats = 'Total seats must be between 1 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
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
        ...formData,
        total_seats: Number(formData.total_seats),
      });
      addShow(show);
      addToast(`Show "${show.name}" created successfully!`, 'success');
      setFormData({ name: '', start_time: '', total_seats: 40 });
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
          value={formData.name}
          onChange={handleChange}
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
          value={formData.start_time}
          onChange={handleChange}
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
          value={formData.total_seats}
          onChange={handleChange}
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