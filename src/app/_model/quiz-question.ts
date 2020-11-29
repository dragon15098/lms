import {QuizAnswer} from './quiz-answer';

export interface QuizQuestion {
  id: number;
  question: string;
  correctAnswer: QuizAnswer;
  quizAnswers: QuizAnswer[];
}
