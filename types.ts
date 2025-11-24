export interface Course {
  id: string;
  level: string;
  title: string;
  summary: string;
  details: string[];
  tags: string[];
}

export type ClassType = 'group' | 'private';

export interface CartItem {
  courseId: string;
  courseTitle: string;
  courseLevel: string;
  classType: ClassType;
  date: string;
  time: string;
  price: number;
}

export interface BookingState {
  date: string;
  time: string;
}