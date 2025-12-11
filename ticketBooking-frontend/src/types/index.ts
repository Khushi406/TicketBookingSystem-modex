export interface Show {
  id: number;
  name: string;
  start_time: string;
  total_seats: number;
  created_at?: string;
}

export interface Seat {
  id: number;
  show_id: number;
  seat_number: number;
  booked: boolean;
  booking_id: number | null;
}

export interface Booking {
  id: number;
  show_id: number;
  user_email: string;
  seat_numbers: number[];
  status: 'PENDING' | 'CONFIRMED' | 'FAILED';
  created_at: string;
  reason?: string;
  conflictSeats?: number[];
}

export interface CreateShowRequest {
  name: string;
  start_time: string;
  total_seats: number;
}

export interface CreateBookingRequest {
  show_id: number;
  user_email: string;
  seat_numbers: number[];
}