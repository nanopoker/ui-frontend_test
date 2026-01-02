import { create } from 'zustand';
import { Lesson } from '../types';
import { lessonService } from '../services/api';

interface LessonState {
  lessons: Lesson[];
  loading: boolean;
  error: string | null;
  fetchLessons: () => Promise<void>;
  takeClass: (lessonId: string, tutorName: string) => Promise<void>;
}

export const useLessonStore = create<LessonState>((set, get) => ({
  lessons: [],
  loading: false,
  error: null,
  
  fetchLessons: async () => {
    set({ loading: true, error: null });
    try {
      const lessons = await lessonService.getLessons();
      set({ lessons, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch lessons',
        loading: false 
      });
    }
  },
  
  takeClass: async (lessonId: string, tutorName: string) => {
    try {
      const updatedLesson = await lessonService.takeClass(lessonId, tutorName);
      const lessons = get().lessons.map(lesson =>
        lesson.id === lessonId ? updatedLesson : lesson
      );
      set({ lessons });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to take class'
      });
      throw error;
    }
  },
}));

