import React from 'react';
import { Seat } from '../../types';
import './SeatGrid.css';

interface SeatGridProps {
  seats: Seat[];
  selectedSeats: number[];
  onSeatClick: (seatNumber: number) => void;
}

const SeatGrid: React.FC<SeatGridProps> = ({ seats, selectedSeats, onSeatClick }) => {
  const getSeatClass = (seat: Seat) => {
    if (seat.booked) return 'seat booked';
    if (selectedSeats.includes(seat.seat_number)) return 'seat selected';
    return 'seat available';
  };

  const getSeatIcon = (seat: Seat) => {
    if (seat.booked) return '✖';
    if (selectedSeats.includes(seat.seat_number)) return '✓';
    return seat.seat_number;
  };

  return (
    <div className="seat-grid-container">
      <div className="screen">
        <span className="screen-text">🎬 SCREEN</span>
        <div className="screen-glow"></div>
      </div>
      <div className="seat-grid">
        {seats.map((seat, index) => (
          <button
            key={seat.id}
            className={getSeatClass(seat)}
            onClick={() => !seat.booked && onSeatClick(seat.seat_number)}
            disabled={seat.booked}
            title={`Seat ${seat.seat_number}${seat.booked ? ' (Booked)' : ''}`}
            style={{ animationDelay: `${index * 0.01}s` }}
          >
            <span className="seat-number">{getSeatIcon(seat)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SeatGrid;