import apiClient from './config';
import { Seat, Booking, CreateBookingRequest } from '../types';

export const bookingsApi = {
  // Get seats for a specific show
  getSeats: async (showId: number): Promise<Seat[]> => {
    const response = await apiClient.get<Seat[]>(`/bookings/seats/${showId}`);
    return response.data;
  },

  // Create a booking
  createBooking: async (data: CreateBookingRequest): Promise<Booking> => {
    const response = await apiClient.post<Booking>('/bookings', data);
    return response.data;
  },

  // Get booking by ID
  getBooking: async (bookingId: number): Promise<Booking> => {
    const response = await apiClient.get<Booking>(`/bookings/${bookingId}`);
    return response.data;
  },
};