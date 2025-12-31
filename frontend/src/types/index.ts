export interface Lesson {
  id: string;
  date: string;
  type: 'Historic' | 'Upcoming' | 'Available';
  subject: string;
  students: string[];
  tutor: string | null;
  status: string;
}

export interface Tutor {
  name: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

