import {LessonQuestion} from './lesson-question';

export interface Lesson {
  id: number;
  lessonTitle: string;
  urlVideo: string;
  description: string;
  lessonQuestions: LessonQuestion[];
}
