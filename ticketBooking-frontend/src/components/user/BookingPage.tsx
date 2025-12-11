import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingsApi } from '../../api/bookings';
import { useShows } from '../../context/ShowContext';
import { useToast } from '../../context/ToastContext';
import { Seat, Booking } from '../../types';
import SeatGrid from './SeatGrid';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorMessage from '../shared/ErrorMessage';
import './BookingPage.css';

const BookingPage: React.FC = () => {
  const { showId } = useParams<{ showId: string }>();
  const navigate = useNavigate();
  const { shows } = useShows();
  const { addToast } = useToast();

  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const show = shows.find(s => s.id === Number(showId));

  const fetchSeats = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setError(null);
      const data = await bookingsApi.getSeats(Number(showId));
      setSeats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load seats');
    } finally {
      if (!silent) setLoading(false);
    }
  }, [showId]);

  useEffect(() => {
    fetchSeats();

    // Auto-refresh seats every 10 seconds
    refreshIntervalRef.current = setInterval(() => {
      fetchSeats(true); // Silent refresh
    }, 10000);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [fetchSeats]);

  const handleSeatClick = (seatNumber: number) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
      addToast(`Seat ${seatNumber} selected`, 'info');
    }
  };

  const validateEmail = (value: string) => {
    if (!value.trim()) {
      setEmailError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (emailError) validateEmail(value);
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      addToast('Please select at least one seat', 'warning');
      return;
    }
    if (!validateEmail(email)) {
      addToast('Please enter a valid email address', 'error');
      return;
    }

    setBookingLoading(true);
    setError(null);

    try {
      const result = await bookingsApi.createBooking({
        show_id: Number(showId),
        user_email: email,
        seat_numbers: selectedSeats,
      });
      setBooking(result);
      
      if (result.status === 'CONFIRMED') {
        addToast('Booking confirmed successfully!', 'success');
        await fetchSeats(true); // Refresh seats
      } else {
        addToast('Booking failed: ' + (result.reason || 'Unknown error'), 'error');
      }
    } catch (err: any) {
      const errorMsg = err.error || err.message || 'Booking failed';
      setError(errorMsg);
      addToast(errorMsg, 'error');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error && !booking) return <ErrorMessage message={error} />;

  return (
    <div className="booking-page">
      <div className="booking-header">
        <button className="btn-back" onClick={() => navigate('/')}>
          ← Back to Shows
        </button>
        <h1>Book Tickets: {show?.name}</h1>
        <p className="show-time">
          📅 {show ? new Date(show.start_time).toLocaleString() : ''}
        </p>
      </div>

      {booking ? (
        <div className="booking-result">
          {booking.status === 'CONFIRMED' ? (
            <div className="success-message">
              <h2>🎉 Booking Confirmed!</h2>
              <p><strong>Booking ID:</strong> {booking.id}</p>
              <p><strong>Email:</strong> {booking.user_email}</p>
              <p><strong>Seats:</strong> {booking.seat_numbers.join(', ')}</p>
              <button className="btn btn-primary" onClick={() => navigate('/')}>
                Back to Home
              </button>
            </div>
          ) : (
            <div className="error-message">
              <h2>❌ Booking Failed</h2>
              <p><strong>Reason:</strong> {booking.reason}</p>
              {booking.conflictSeats && (
                <p><strong>Conflicting Seats:</strong> {booking.conflictSeats.join(', ')}</p>
              )}
              <button className="btn btn-primary" onClick={() => {
                setBooking(null);
                setSelectedSeats([]);
                fetchSeats();
              }}>
                Try Again
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="booking-info">
            <div className="legend">
              <h3>Legend:</h3>
              <div className="legend-items">
                <div className="legend-item">
                  <div className="seat-demo available"></div>
                  <span>Available</span>
                </div>
                <div className="legend-item">
                  <div className="seat-demo selected"></div>
                  <span>Selected</span>
                </div>
                <div className="legend-item">
                  <div className="seat-demo booked"></div>
                  <span>Booked</span>
                </div>
              </div>
            </div>
            <div className="selected-info">
              <h3>Selected Seats: {selectedSeats.length}</h3>
              <p>{selectedSeats.length > 0 ? selectedSeats.sort((a, b) => a - b).join(', ') : 'None'}</p>
            </div>
          </div>

          <SeatGrid 
            seats={seats}
            selectedSeats={selectedSeats}
            onSeatClick={handleSeatClick}
          />

          <div className="booking-form card">
            <h3>Complete Booking</h3>
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="your.email@example.com"
                className={emailError ? 'input-error' : ''}
              />
              {emailError && <span className="field-error">{emailError}</span>}
            </div>
            {error && <div className="error-message">{error}</div>}
            <button 
              className="btn btn-success"
              onClick={handleBooking}
              disabled={bookingLoading || selectedSeats.length === 0}
            >
              {bookingLoading ? (
                <>
                  <span className="btn-spinner"></span>
                  Processing...
                </>
              ) : (
                `✓ Confirm Booking (${selectedSeats.length} seat${selectedSeats.length !== 1 ? 's' : ''})`
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BookingPage;

