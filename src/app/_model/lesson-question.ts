import {LessonAnswer} from './lesson-answer';

export interface LessonQuestion {
  id: number;
  questionTitle: string;
  question: string;
  correctAnswer: LessonAnswer;
  lessonAnswers: LessonAnswer[];
}
