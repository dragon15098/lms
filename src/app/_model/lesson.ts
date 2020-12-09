import {LessonQuestion} from './lesson-question';
import {Section} from './section';

export interface Lesson {
  id: number;
  lessonTitle: string;
  urlVideo: string;
  description: string;
  lessonQuestions: LessonQuestion[];
  section: Section;
}
