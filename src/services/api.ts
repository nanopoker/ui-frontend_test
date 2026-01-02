import axios, { AxiosError } from 'axios';
import { Lesson, LoginCredentials, Tutor } from '../types';
import { mockAuthService, mockLessonService } from './mockApi';

// Detect if we're running on GitHub Pages or in production
const isProduction = import.meta.env.PROD;
const isGitHubPages = window.location.hostname.includes('github.io') || 
                      window.location.hostname.includes('github.com');
const useMockApi = isGitHubPages || (!import.meta.env.VITE_API_URL && isProduction);

// Get API URL - use environment variable or default to localhost for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // 5 second timeout
});

// Helper function to check if error is a network error
const isNetworkError = (error: unknown): boolean => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    return !axiosError.response && axiosError.code !== 'ECONNABORTED';
  }
  return false;
};

// Wrapper function that falls back to mock API on network errors
const withFallback = async <T>(
  apiCall: () => Promise<T>,
  mockCall: () => Promise<T>
): Promise<T> => {
  if (useMockApi) {
    return mockCall();
  }
  
  try {
    return await apiCall();
  } catch (error) {
    // If it's a network error and we're not explicitly using mock, try mock API
    if (isNetworkError(error)) {
      console.warn('API request failed, using mock data:', error);
      return mockCall();
    }
    throw error;
  }
};

export const authService = {
  login: async (credentials: LoginCredentials): Promise<{ tutor: Tutor; token: string }> => {
    return withFallback(
      async () => {
        const response = await api.post('/api/login', credentials);
        return response.data;
      },
      () => mockAuthService.login(credentials)
    );
  },
};

export const lessonService = {
  getLessons: async (): Promise<Lesson[]> => {
    return withFallback(
      async () => {
        const response = await api.get('/api/lessons');
        return response.data;
      },
      () => mockLessonService.getLessons()
    );
  },
  
  takeClass: async (lessonId: string, tutorName: string): Promise<Lesson> => {
    return withFallback(
      async () => {
        const response = await api.post('/api/lessons/take', {
          lessonId,
          tutorName,
        });
        return response.data.lesson;
      },
      () => mockLessonService.takeClass(lessonId, tutorName)
    );
  },
};

