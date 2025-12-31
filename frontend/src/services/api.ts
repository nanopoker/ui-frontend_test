import axios from 'axios';
import { Lesson, LoginCredentials, Tutor } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  login: async (credentials: LoginCredentials): Promise<{ tutor: Tutor; token: string }> => {
    const response = await api.post('/api/login', credentials);
    return response.data;
  },
};

export const lessonService = {
  getLessons: async (): Promise<Lesson[]> => {
    const response = await api.get('/api/lessons');
    return response.data;
  },
  
  takeClass: async (lessonId: string, tutorName: string): Promise<Lesson> => {
    const response = await api.post('/api/lessons/take', {
      lessonId,
      tutorName,
    });
    return response.data.lesson;
  },
};

