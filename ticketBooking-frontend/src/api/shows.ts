import apiClient from './config';
import { Show, CreateShowRequest } from '../types';

export const showsApi = {
  // Get all shows
  getShows: async (): Promise<Show[]> => {
    const response = await apiClient.get<Show[]>('/shows');
    return response.data;
  },

  // Create a new show (Admin)
  createShow: async (data: CreateShowRequest): Promise<Show> => {
    const response = await apiClient.post<Show>('/shows', data);
    return response.data;
  },

  // Delete a show (Admin)
  deleteShow: async (id: number): Promise<{ message: string; id: number }> => {
    const response = await apiClient.delete<{ message: string; id: number }>(`/shows/${id}`);
    return response.data;
  },
};