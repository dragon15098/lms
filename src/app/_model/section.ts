import {Lesson} from './lesson';
import {Quiz} from './quiz';
import {Course} from './course';

export interface Section {
  id: number;
  sectionTitle: string;
  lessons: Lesson[];
  quiz: Quiz;
  course: Course;
}
