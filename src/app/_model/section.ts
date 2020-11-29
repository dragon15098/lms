import {Lesson} from './lesson';
import {Quiz} from './quiz';

export interface Section {
  id: number;
  sectionTitle: string;
  lessons: Lesson[];
  quiz: Quiz;
}
