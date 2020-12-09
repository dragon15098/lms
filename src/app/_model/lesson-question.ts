import {LessonAnswer} from './lesson-answer';

export interface LessonQuestion {
  id: number;
  questionTitle: string;
  question: string;
  correctQuestionPosition: number;
  correctAnswer: LessonAnswer;
  lessonAnswers: LessonAnswer[];
}
