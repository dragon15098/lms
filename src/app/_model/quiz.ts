import {QuizQuestion} from './quiz-question';

export interface Quiz {
  id: number;
  quizTitle: string;
  quizQuestions: QuizQuestion[];
}
