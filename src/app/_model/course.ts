import {Section} from './section';
import {Category} from './category';
import {User} from './user';

export interface Course {
  id: number;
  title: string;
  category: Category;
  instructor: User;
  sections: Section[];
}
